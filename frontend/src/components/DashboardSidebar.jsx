import { MapPin, Briefcase, DollarSign, Clock, Building2, Calendar, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardSidebar() {
    return (
        <aside className="lg:col-span-2 flex flex-col min-h-[750px] gap-6">
            {/* Next Event Card */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Next Event</h3>
                            <p className="text-xs text-slate-500 mt-0.5">Upcoming interview</p>
                        </div>
                    </div>
                    <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        Soon
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">
                            Interview with Acme Inc.
                        </h4>
                        <p className="text-sm text-slate-600">
                            Software Engineer, Full Stack Position
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-blue-200">
                        <div className="flex items-center gap-2.5 text-sm">
                            <div className="p-1.5 bg-white rounded-lg border border-blue-200">
                                <Clock3 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">September 5, 2024</p>
                                <p className="text-slate-600">12:15 PM</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm">
                            <div className="p-1.5 bg-white rounded-lg border border-blue-200">
                                <MapPin className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Location</p>
                                <p className="text-slate-600">Virtual Meeting (Zoom)</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                            View Details
                        </Button>
                        <Button variant="outline" className="border-blue-300 hover:bg-blue-50 text-blue-700">
                            Add to Calendar
                        </Button>
                    </div>
                </div>
            </div>

            {/* Suggested Job Match Card */}
            <div className="bg-gradient-to-br from-indigo-50 via-white to-indigo-50 rounded-xl border border-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Suggested Job Match</h3>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        Recommended for you
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1">
                            Software Engineer, Full Stack
                        </h4>
                        <div className="flex items-center gap-2 text-slate-600 mb-3">
                            <Building2 className="w-4 h-4 text-indigo-500" />
                            <span className="font-medium text-slate-700">Apex Omnitools</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            <span>New York City, NY</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                            <Clock className="w-4 h-4 text-slate-500" />
                            <span>Full Time</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                            <DollarSign className="w-4 h-4 text-slate-500" />
                            <span>$80k - $150k/yr</span>
                        </div>
                        <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                            Remote
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                            <span className="font-semibold text-slate-800">About:</span> Salarian-owned omni-tool developer and producer
                        </p>

                        <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Requirements</p>
                            <ul className="space-y-1.5">
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    <span>2+ years of professional software engineering</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-indigo-500 mt-1">•</span>
                                    <span>Experience in Angular, C#, and .NET Core Web API development</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                                Apply Now
                            </Button>
                            <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

