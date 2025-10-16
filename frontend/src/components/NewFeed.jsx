import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BACKEND_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

function JobItem({ job }) {
    return (
        <Card className="bg-white border border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-sm text-gray-700">
                    <span className="font-medium">Company:</span> {job.company_name}
                </div>
                <div className="text-sm text-gray-700">
                    <span className="font-medium">Location:</span> {job.candidate_required_location}
                </div>
                <div className="text-sm text-gray-700">
                    <span className="font-medium">Type:</span> {job.job_type}
                </div>
                {job.publication_date && (
                    <div className="text-xs text-gray-500">{new Date(job.publication_date).toLocaleString()}</div>
                )}
            </CardContent>
        </Card>
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

    const observerRef = useRef(null);
    const sentinelRef = useRef(null);

    const pageSize = 20; // aligned with backend default max

    const queryString = useMemo(() => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (location) params.set("location", location);
        if (company) params.set("company_name", company);
        params.set("limit", String(pageSize));
        return params.toString();
    }, [search, location, company]);

    async function fetchPage(nextPage) {
        setIsLoading(true);
        try {
            // The backend endpoint returns up to `limit` items. Since Remotive API doesn't support offsets easily,
            // we simulate paging by increasing the limit and de-duplicating.
            const limit = pageSize * nextPage;
            const url = `${BACKEND_BASE}/external/jobs/?${queryString.replace(/limit=\d+/, `limit=${limit}`)}`;
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`Failed to load: ${resp.status}`);
            const data = await resp.json();

            // Remotive returns an array; slice to our current window and dedupe by id.
            const sliceStart = (nextPage - 1) * pageSize;
            const pageChunk = data.slice(sliceStart, sliceStart + pageSize);

            // If no more, mark hasMore false
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
            // eslint-disable-next-line no-console
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
        resetAndRefetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryString]);

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

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    placeholder="Search keywords"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="sm:max-w-xs"
                />
                <Input
                    placeholder="Location filter"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="sm:max-w-xs"
                />
                <Input
                    placeholder="Company filter"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="sm:max-w-xs"
                />
                <Button variant="outline" onClick={resetAndRefetch}>Refresh</Button>
            </div>

            <div className="space-y-3">
                {items.map((job) => (
                    <JobItem key={job.id ?? `${job.company_name}-${job.title}`} job={job} />
                ))}
            </div>

            <div ref={sentinelRef} className="h-10 flex items-center justify-center text-sm text-gray-500">
                {isLoading ? "Loading..." : hasMore ? "Scroll to load more" : items.length ? "No more results" : "No results"}
            </div>
        </div>
    );
}


