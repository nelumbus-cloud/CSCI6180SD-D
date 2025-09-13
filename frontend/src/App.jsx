import { Briefcase, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCard } from '@/components/JobCard';

export default function DashboardLayout() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">

        {/* Main Tabs Component Wrapper */}
        <Tabs defaultValue="my-jobs" className="w-full">

          {/* Header Section */}
          <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b">
            <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">My Career</h1>
            </div>

            {/* Centered Tab Navigation */}
            <div className="flex-grow flex justify-center">
              <TabsList>
                <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
                <TabsTrigger value="resume-studio">Resume Studio</TabsTrigger>
                <TabsTrigger value="feed">Feed</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
                <span className="sr-only">Profile</span>
              </Button>
              <Button variant="outline">Logout</Button>
            </div>

          </header>

          {/* Main Content Grid */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

            {/* Left Column (takes 2/3 of the space on large screens) */}
            <div className="lg:col-span-2">

              {/* Search Bar - This is part of the "My Jobs" tab in the design */}

              <TabsContent value="my-jobs">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left column */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search job title or company name"
                        className="pl-10"
                      />
                    </div>
                    {/* sample job cards info */}
                    <div className="space-y-4">
                      <JobCard
                        title="Software Engineer, Full Stack"
                        location="New York City, New York"
                        status="In Progress"
                        type="Full Time"
                        salary="$80k - $150k/yr"
                        work_location="Remote"
                        company="Apex Omnitools"
                        description="salarian-owned omni-tool developer and producer"
                        requirements={[
                          "2+ years of professional software engineering",
                          "Experience in Angular, C#, and .NET Core Web API development"
                        ]}
                      />
                      <JobCard
                        title="Software Engineer, Full Stack"
                        location="New York City, New York"
                        status="In Progress"
                        type="Full Time"
                        salary="$80k - $150k/yr"
                        work_location="Remote"
                        company="Apex Omnitools"
                        description="salarian-owned omni-tool developer and producer"
                        requirements={[
                          "2+ years of professional software engineering",
                          "Experience in Angular, C#, and .NET Core Web API development"
                        ]}
                      />
                    </div>
                  </div>

                  {/* Right sidebar (only visible in this tab) */}
                  <aside className="lg:col-span-1 space-y-6">
                    <Card className="bg-blue-100 border-blue-200">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-blue-900">Next event</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-blue-800">Interview with Acme Inc.</p>
                        <p className="text-sm text-blue-700 mt-1">Sept 5 - 12:15 PM</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          Job that matches your profile
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">
                          A component for a matched job posting will go here.
                        </p>
                      </CardContent>
                    </Card>
                  </aside>
                </div>
              </TabsContent>


              <TabsContent value="resume-studio">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold">Resume Studio Content</h2>
                  <p className="mt-2 text-gray-600">
                    The resume builder, templates, and related components will be rendered here.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="feed">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold">Feed Content</h2>
                  <p className="mt-2 text-gray-600">
                    The personalized job feed, articles, and updates will be rendered here.
                  </p>
                </div>
              </TabsContent>

            </div>


          </main>

        </Tabs>
      </div>
    </div>
  );
}