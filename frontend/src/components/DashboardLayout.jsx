import { Briefcase, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function DashboardLayout({ children, activeTab, onTabChange }) {
    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">

                {/* Main Tabs Component Wrapper */}
                <Tabs value={activeTab} onValueChange={onTabChange} defaultValue="my-jobs" className="w-full">

                    {/* Header Section - Compact */}
                    <header className="mb-6">
                        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                            {/* Left: Title */}
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <div className="p-1.5 bg-indigo-100 rounded-md">
                                    <Briefcase className="h-4 w-4 text-indigo-600" />
                                </div>
                                <h1 className="text-lg font-semibold text-slate-900">My Career</h1>
                            </div>

                            {/* Center: Tab Navigation */}
                            <div className="flex-1 flex justify-center">
                                <TabsList className="bg-white border border-slate-200 shadow-sm h-8">
                                    <TabsTrigger value="my-jobs" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 text-sm px-3 py-1 h-7">My Jobs</TabsTrigger>
                                    <TabsTrigger value="resume-studio" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 text-sm px-3 py-1 h-7">Resume Studio</TabsTrigger>
                                    <TabsTrigger value="feed" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 text-sm px-3 py-1 h-7">Feed</TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Right: User Actions */}
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                                    <User className="h-4 w-4 text-slate-600" />
                                    <span className="sr-only">Profile</span>
                                </Button>
                                <Button variant="outline" size="sm" className="border-slate-300 hover:bg-slate-50 h-8 px-3 text-sm">
                                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
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
