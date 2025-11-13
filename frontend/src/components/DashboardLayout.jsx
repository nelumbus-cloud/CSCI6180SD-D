import { Briefcase, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function DashboardLayout({ children }) {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">

                {/* Main Tabs Component Wrapper */}
                <Tabs defaultValue="my-jobs" className="w-full">

                    {/* Header Section - Simplified */}
                    <header className="mb-8">
                        <div className="flex items-center justify-between gap-4 pb-8 border-b-2 border-slate-200">
                            {/* Left: Title and Tabs */}
                            <div className="flex items-center gap-8 flex-1">
                                <div className="flex items-center gap-4 whitespace-nowrap">
                                    <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg shadow-lg">
                                        <Briefcase className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900">My Career</h1>
                                        <p className="text-xs text-slate-600 mt-1">Manage opportunities</p>
                                    </div>
                                </div>

                                {/* Tab Navigation */}
                                <TabsList className="bg-white border border-slate-200 shadow-sm">
                                    <TabsTrigger value="my-jobs" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">My Jobs</TabsTrigger>
                                    <TabsTrigger value="resume-studio" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Resume Studio</TabsTrigger>
                                    <TabsTrigger value="feed" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Feed</TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Right: User Actions */}
                            <div className="flex items-center gap-3 whitespace-nowrap">
                                <Button variant="ghost" size="icon" className="hover:bg-slate-200">
                                    <User className="h-5 w-5 text-slate-600" />
                                    <span className="sr-only">Profile</span>
                                </Button>
                                <Button variant="outline" className="border-slate-300 hover:bg-slate-100 flex items-center gap-2">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Children Content */}
                    {children}

                </Tabs>
            </div>
        </div>
    );
}
