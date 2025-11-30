import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2, Briefcase, Clock, RefreshCw, Sparkles, Star } from "lucide-react";

const BACKEND_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function JobItem({ job, onToggleSave, isSaved }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-5 group relative">
            {/* Star Button */}
            <button
                onClick={() => onToggleSave?.(job)}
                className="absolute top-4 right-4 p-2 hover:bg-amber-50 rounded-lg transition-all duration-200 z-10"
                aria-label={isSaved ? "Remove from saved" : "Save job"}
            >
                <Star
                    className={`w-5 h-5 transition-all duration-200 ${isSaved
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-400 hover:text-amber-400'
                        }`}
                />
            </button>

            <div className="flex items-start justify-between mb-4 pr-8">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {job.title}
                        </h3>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                            New
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 mb-3">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium text-slate-700">{job.company_name}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {job.candidate_required_location && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{job.candidate_required_location}</span>
                    </div>
                )}
                {job.job_type && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>{job.job_type}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{job.publication_date ? `Posted ${formatDate(job.publication_date)}` : 'Remote Job'}</span>
                </div>
                <Button
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7 px-3"
                    onClick={() => window.open(job.url || 'https://remotive.com/remote-jobs', '_blank')}
                >
                    View More
                </Button>
            </div>
        </div>
    );
}

export default function NewFeed() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [company, setCompany] = useState("");
    const [savedJobs, setSavedJobs] = useState(new Set());
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [debouncedLocation, setDebouncedLocation] = useState("");
    const [debouncedCompany, setDebouncedCompany] = useState("");

    // Load saved jobs from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('savedFeedJobs');
        if (saved) {
            try {
                const savedArray = JSON.parse(saved);
                setSavedJobs(new Set(savedArray.map(j => j.id || `${j.company_name}-${j.title}`)));
            } catch (e) {
                console.error('Error loading saved jobs:', e);
            }
        }
    }, []);

    // Debounce filter inputs
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedLocation(location);
        }, 500);
        return () => clearTimeout(timer);
    }, [location]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCompany(company);
        }, 500);
        return () => clearTimeout(timer);
    }, [company]);

    // Save to localStorage whenever savedJobs changes
    useEffect(() => {
        if (savedJobs.size > 0) {
            const savedArray = Array.from(savedJobs).map(id => {
                return items.find(job => (job.id || `${job.company_name}-${job.title}`) === id);
            }).filter(Boolean);
            localStorage.setItem('savedFeedJobs', JSON.stringify(savedArray));
        } else {
            localStorage.removeItem('savedFeedJobs');
        }
    }, [savedJobs, items]);

    const toggleSaveJob = (job) => {
        const jobId = job.id || `${job.company_name}-${job.title}`;
        setSavedJobs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(jobId)) {
                newSet.delete(jobId);
            } else {
                newSet.add(jobId);
            }
            return newSet;
        });
    };

    const isJobSaved = (job) => {
        const jobId = job.id || `${job.company_name}-${job.title}`;
        return savedJobs.has(jobId);
    };

    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    const pageSize = 20;

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (debouncedLocation) params.set("location", debouncedLocation);
        if (debouncedCompany) params.set("company_name", debouncedCompany);
        params.set("limit", String(pageSize));
        return params.toString();
    }, [debouncedSearch, debouncedLocation, debouncedCompany]);

    async function fetchPage(nextPage) {
        setIsLoading(true);
        try {
            const limit = pageSize * nextPage;
            const url = `${BACKEND_BASE}/api/external/jobs/?${queryString.replace(/limit=\d+/, `limit=${limit}`)}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`Failed to load: ${resp.status}`);
            const data = await resp.json();

            const sliceStart = (nextPage - 1) * pageSize;
            const pageChunk = data.slice(sliceStart, sliceStart + pageSize);

            if (pageChunk.length < pageSize) {
                setHasMore(false);
            }

            setItems((prev) => {
                const combined = [...prev, ...pageChunk];
                const seen = new Set();
                return combined.filter((j) => {
                    const key = j.id ?? `${j.company_name}-${j.title}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                });
            });
            setPage(nextPage);
        } catch (err) {
            console.error(err);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }

    function resetAndRefetch() {
        setItems([]);
        setPage(0);
        setHasMore(true);
        fetchPage(1);
    }

    useEffect(() => {
        // Reset items and refetch when debounced filters change
        setItems([]);
        setPage(0);
        setHasMore(true);
        // Small delay to ensure state updates
        setTimeout(() => fetchPage(1), 0);
    }, [debouncedSearch, debouncedLocation, debouncedCompany]);

    useEffect(() => {
        if (!sentinelRef.current) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (first.isIntersecting && !isLoading && hasMore) {
                fetchPage(page + 1);
            }
        });
        observerRef.current.observe(sentinelRef.current);
        return () => observerRef.current && observerRef.current.disconnect();
    }, [page, isLoading, hasMore]);

    const hasActiveFilters = debouncedSearch || debouncedLocation || debouncedCompany;

    return (
        <div className="flex flex-col gap-6">
            {/* Search Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Discover Opportunities</h2>
                        <p className="text-xs text-slate-600">Find your next career opportunity</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search keywords..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 border-slate-200 bg-white"
                        />
                    </div>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-10 border-slate-200 bg-white"
                        />
                    </div>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Company..."
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="pl-10 border-slate-200 bg-white"
                        />
                    </div>
                    <Button
                        onClick={resetAndRefetch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Loading...' : 'Refresh'}
                    </Button>
                </div>

                {hasActiveFilters && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                        <span>Active filters:</span>
                        {debouncedSearch && (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-medium">
                                {debouncedSearch}
                            </span>
                        )}
                        {debouncedLocation && (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-medium">
                                {debouncedLocation}
                            </span>
                        )}
                        {debouncedCompany && (
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md font-medium">
                                {debouncedCompany}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Results Count */}
            {items.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium">
                        {items.length} {items.length === 1 ? 'opportunity' : 'opportunities'} found
                    </span>
                </div>
            )}

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((job) => (
                    <JobItem
                        key={job.id ?? `${job.company_name}-${job.title}`}
                        job={job}
                        onToggleSave={toggleSaveJob}
                        isSaved={isJobSaved(job)}
                    />
                ))}
            </div>

            {/* Loading/Status Indicator */}
            <div ref={sentinelRef} className="h-16 flex items-center justify-center">
                {isLoading ? (
                    <div className="flex items-center gap-2 text-slate-600">
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Loading more opportunities...</span>
                    </div>
                ) : hasMore ? (
                    <div className="text-center">
                        <p className="text-sm text-slate-500 mb-1">Scroll down to load more</p>
                        <div className="w-32 h-1 bg-slate-200 rounded-full mx-auto overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                ) : items.length > 0 ? (
                    <div className="text-center py-4">
                        <p className="text-sm font-medium text-slate-600">✨ All opportunities loaded</p>
                        <p className="text-xs text-slate-500 mt-1">You've seen all available jobs</p>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="text-sm font-medium text-slate-600">No opportunities found</p>
                        <p className="text-xs text-slate-500 mt-1">Try adjusting your search filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}
