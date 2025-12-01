import { MapPin, Briefcase, DollarSign, Clock, Building2, Calendar, Clock3, X, ExternalLink, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

const BACKEND_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

export function DashboardSidebar() {
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [suggestedJobs, setSuggestedJobs] = useState([]);
    const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const [showInterviewDetails, setShowInterviewDetails] = useState(false);
    const [showJobDetails, setShowJobDetails] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);

    // Fetch upcoming interviews from LOCAL DATABASE (fast)
    const fetchInterviews = async () => {
        try {
            setIsLoadingInterviews(true);
            const res = await fetch(`${BACKEND_BASE}/api/jobs/dashboard/upcoming-interviews?limit=10`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setUpcomingInterviews(data || []);
            }
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setIsLoadingInterviews(false);
        }
    };

    // Fetch suggested jobs from EXTERNAL API (slower - don't block UI)
    const fetchSuggestions = async () => {
        try {
            setIsLoadingSuggestions(true);
            const res = await fetch(`${BACKEND_BASE}/api/external/jobs/suggested-matches?limit=5`, {
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setSuggestedJobs(data || []);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    useEffect(() => {
        // Fetch interviews immediately (local DB - fast)
        fetchInterviews();
        // Fetch suggestions separately (external API - slower, don't block UI)
        fetchSuggestions();
        
        // Listen for job updates to refresh the sidebar
        const handleJobUpdate = () => {
            fetchInterviews(); // Only refresh local data on job updates
        };
        
        window.addEventListener('jobUpdated', handleJobUpdate);
        return () => window.removeEventListener('jobUpdated', handleJobUpdate);
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const handleAddToCalendar = async (jobId) => {
        try {
            const response = await fetch(`${BACKEND_BASE}/api/calendar/sync/job/${jobId}`, {
                method: 'POST',
                credentials: 'include',
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                // Handle different error cases
                if (response.status === 401) {
                    alert('Google Calendar not connected. Please connect your Google Calendar first.\n\nYou will be redirected to connect your calendar.');
                    // You can optionally redirect to calendar connection
                    // window.location.href = `${BACKEND_BASE}/api/calendar/connect?redirect=false`;
                } else if (response.status === 400) {
                    alert('No events could be created. Make sure the job has at least one date set (interview date, deadline, or follow-up date).');
                } else {
                    alert(result.detail || 'Failed to add event to calendar');
                }
                return;
            }
            
            const eventsCount = result.events_created?.length || 0;
            if (eventsCount > 0) {
                alert(`Successfully added ${eventsCount} event(s) to your Google Calendar!`);
            } else {
                alert('No events were added. Please ensure the job has at least one date set.');
            }
        } catch (error) {
            console.error('Error adding to calendar:', error);
            alert('Error adding event to calendar. Please try again.');
        }
    };

    return (
        <aside className="lg:col-span-2 flex flex-col min-h-[750px] gap-6">
            {/* Upcoming Events Section - From LOCAL DATABASE (fast) */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isLoadingInterviews ? 'Loading...' : upcomingInterviews.length > 0 ? `${upcomingInterviews.length} interview${upcomingInterviews.length > 1 ? 's' : ''} scheduled` : 'No interviews scheduled'}
                        </p>
                    </div>
                </div>

                {isLoadingInterviews ? (
                    <p className="text-slate-500 text-sm py-4 text-center">Loading interviews...</p>
                ) : upcomingInterviews.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                        {upcomingInterviews.map((interview, index) => (
                            <div 
                                key={interview.id} 
                                className="bg-white rounded-lg border border-blue-100 p-4 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                                            Interview with {interview.company}
                                        </h4>
                                        <p className="text-xs text-slate-600 line-clamp-1">{interview.title}</p>
                                    </div>
                                    {index === 0 && (
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold ml-2">
                                            Next
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Clock3 className="w-3 h-3 text-blue-500" />
                                        <span>{formatDate(interview.interview_date)}</span>
                                    </div>
                                    {interview.work_location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-blue-500" />
                                            <span className="line-clamp-1">{interview.work_location}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        size="sm"
                                        onClick={() => {
                                            setSelectedInterview(interview);
                                            setShowInterviewDetails(true);
                                        }}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-7"
                                    >
                                        View Details
                                    </Button>
                                    <Button 
                                        size="sm"
                                        onClick={() => handleAddToCalendar(interview.id)}
                                        variant="outline" 
                                        className="border-blue-300 hover:bg-blue-50 text-blue-700 text-xs h-7"
                                    >
                                        <Calendar className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">Add interview dates to your jobs to see them here</p>
                )}
            </div>

            {/* Job Recommendations Section - From EXTERNAL API (slower) */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-xl border border-indigo-100 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Job Recommendations</h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {isLoadingSuggestions ? 'Searching...' : 'Based on your saved jobs'}
                            </p>
                        </div>
                    </div>
                    {!isLoadingSuggestions && suggestedJobs.length > 0 && (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs font-medium">
                            {suggestedJobs.length} found
                        </span>
                    )}
                </div>

                {isLoadingSuggestions ? (
                    <p className="text-slate-500 text-sm py-4 text-center">Fetching recommendations from Remotive...</p>
                ) : suggestedJobs.length > 0 ? (
                    <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                        {suggestedJobs.map((job) => (
                            <div 
                                key={job.id} 
                                className="bg-white rounded-lg border border-indigo-100 p-4 hover:shadow-md transition-all duration-200"
                            >
                                <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
                                    {job.title}
                                </h4>
                                <div className="flex items-center gap-1 text-xs text-slate-600 mb-2">
                                    <Building2 className="w-3 h-3 text-indigo-500" />
                                    <span className="line-clamp-1">{job.company}</span>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                    {job.location && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                                            <MapPin className="w-3 h-3" />
                                            <span className="line-clamp-1 max-w-[100px]">{job.location}</span>
                                        </span>
                                    )}
                                    {job.type && (
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">
                                            {job.type}
                                        </span>
                                    )}
                                </div>

                                {job.tags && job.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {job.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    {job.url && (
                                        <Button 
                                            size="sm"
                                            onClick={() => window.open(job.url, '_blank')}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-7"
                                        >
                                            <ExternalLink className="w-3 h-3 mr-1" />
                                            View Job
                                        </Button>
                                    )}
                                    <Button 
                                        size="sm"
                                        onClick={() => {
                                            setSelectedJob(job);
                                            setShowJobDetails(true);
                                        }}
                                        variant="outline" 
                                        className="border-indigo-200 hover:bg-indigo-50 text-indigo-600 text-xs h-7"
                                    >
                                        Details
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">Add jobs to your tracker to get personalized recommendations!</p>
                )}
            </div>

            {/* Interview Details Modal */}
            {showInterviewDetails && selectedInterview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowInterviewDetails(false)} />
                    <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-xl my-8">
                        <div className="sticky top-0 flex items-start justify-between p-6 border-b border-slate-200 bg-white rounded-t-xl">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Interview Details</h2>
                                <p className="text-sm text-slate-500 mt-1">Interview with {selectedInterview.company}</p>
                            </div>
                            <button
                                onClick={() => setShowInterviewDetails(false)}
                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedInterview.title}</h3>
                                <div className="flex items-center gap-2 text-indigo-600 mb-4">
                                    <Building2 className="w-4 h-4" />
                                    <span className="font-semibold">{selectedInterview.company}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock3 className="w-4 h-4 text-blue-600" />
                                        <p className="text-sm font-semibold text-slate-700">Interview Date & Time</p>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900">{formatDate(selectedInterview.interview_date)}</p>
                                    <p className="text-sm text-slate-600">{formatTime(selectedInterview.interview_date)}</p>
                                </div>

                                {selectedInterview.work_location && (
                                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-indigo-600" />
                                            <p className="text-sm font-semibold text-slate-700">Location</p>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">{selectedInterview.work_location}</p>
                                    </div>
                                )}

                                {selectedInterview.location && (
                                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-emerald-600" />
                                            <p className="text-sm font-semibold text-slate-700">Job Location</p>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">{selectedInterview.location}</p>
                                    </div>
                                )}

                                {selectedInterview.type && (
                                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Briefcase className="w-4 h-4 text-orange-600" />
                                            <p className="text-sm font-semibold text-slate-700">Employment Type</p>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">{selectedInterview.type}</p>
                                    </div>
                                )}
                            </div>

                            {selectedInterview.description && (
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 mb-2">Description</p>
                                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{selectedInterview.description}</p>
                                </div>
                            )}

                            {selectedInterview.salary && (
                                <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <DollarSign className="w-5 h-5 text-yellow-600" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Salary</p>
                                        <p className="text-lg font-bold text-slate-900">{selectedInterview.salary}</p>
                                    </div>
                                </div>
                            )}

                            {selectedInterview.status && (
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <p className="text-sm font-semibold text-slate-700 mb-1">Status</p>
                                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                        {selectedInterview.status}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 flex gap-2 p-6 border-t border-slate-200 bg-white rounded-b-xl">
                            <Button
                                onClick={() => setShowInterviewDetails(false)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Details Modal */}
            {showJobDetails && selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowJobDetails(false)} />
                    <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-xl my-8">
                        <div className="sticky top-0 flex items-start justify-between p-6 border-b border-slate-200 bg-white rounded-t-xl">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Job Details</h2>
                                <p className="text-sm text-slate-500 mt-1">{selectedJob.match_reason || "Suggested Match"}</p>
                            </div>
                            <button
                                onClick={() => setShowJobDetails(false)}
                                className="p-1 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedJob.title}</h3>
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <Building2 className="w-4 h-4" />
                                    <span className="font-semibold text-lg">{selectedJob.company}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {selectedJob.location && (
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            <p className="text-sm font-semibold text-slate-700">Location</p>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">{selectedJob.location}</p>
                                    </div>
                                )}

                                {selectedJob.type && (
                                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Briefcase className="w-4 h-4 text-indigo-600" />
                                            <p className="text-sm font-semibold text-slate-700">Job Type</p>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">{selectedJob.type}</p>
                                    </div>
                                )}

                                {selectedJob.salary && selectedJob.salary !== "Not specified" && (
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-4 h-4 text-yellow-600" />
                                            <p className="text-sm font-semibold text-slate-700">Salary</p>
                                        </div>
                                        <p className="text-lg font-bold text-slate-900">{selectedJob.salary}</p>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {selectedJob.tags && selectedJob.tags.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 mb-2">Skills & Tags</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedJob.tags.map((tag, idx) => (
                                            <span key={idx} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedJob.description && (
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 mb-2">About the Role</p>
                                    <div 
                                        className="text-slate-600 bg-slate-50 p-4 rounded-lg prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                                    />
                                </div>
                            )}

                            {selectedJob.source && (
                                <div className="p-3 bg-slate-100 rounded-lg text-sm text-slate-600">
                                    <span className="font-medium">Source:</span> {selectedJob.source === 'remotive' ? 'Remotive Jobs' : selectedJob.source}
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 flex gap-2 p-6 border-t border-slate-200 bg-white rounded-b-xl">
                            {selectedJob.url && (
                                <Button
                                    onClick={() => window.open(selectedJob.url, '_blank')}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Apply Now
                                </Button>
                            )}
                            <Button
                                onClick={() => setShowJobDetails(false)}
                                variant="outline"
                                className="border-slate-300"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}



