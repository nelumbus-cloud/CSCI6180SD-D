import { Briefcase, User, Search } from 'lucide-react';
import { useState, useEffect } from 'react'; // state hook
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCard } from '@/components/JobCard';
import NewFeed from '@/components/NewFeed';
import { jobService } from '@/services/jobService';

export default function DashboardLayout() {
  //state for jobs from API
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false); //modal for adding new jobs
  const [newJob, setNewJob] = useState({
    title: "",
    location: "",
    status: "",
    type: "",
    salary: "",
    work_location: "",
    company: "",
    description: "",
    requirementsText: ""
  });

  //fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await jobService.getJobs();
        setJobs(jobsData);
        setError(null);
      } catch (err) {
        setError('Failed to load jobs');
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


  async function handleAddJobSubmit(e) {
    e.preventDefault();

    try {
      //convert requirementsText to an array
      const requirements = newJob.requirementsText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      
      const jobToAdd = {
        title: newJob.title,
        location: newJob.location,
        status: newJob.status,
        type: newJob.type,
        salary: newJob.salary,
        work_location: newJob.work_location,
        company: newJob.company,
        description: newJob.description,
        requirements
      };

      //save to database
      const savedJob = await jobService.createJob(jobToAdd);
      
      //pdate local state
      setJobs(prev => [...prev, savedJob]);

      //closing modal and resetting the form
      setShowAddModal(false);
      setNewJob({
        title: "",
        location: "",
        status: "",
        type: "",
        salary: "",
        work_location: "",
        company: "",
        description: "",
        requirementsText: ""
      });
    } catch (error) {
      console.error('Error adding job:', error);
      setError('Failed to add job');
    }
  }

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
          <main className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-8">

            {/* Left Column (takes 2/3 of the space on large screens) */}
            <div className="lg:col-span-2">

              {/* Search Bar - This is part of the "My Jobs" tab in the design */}
              <TabsContent value="my-jobs">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 mb-6 flex justify-start">
                    <div className="relative w-full max-w-[calc(50%-1rem)]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search job title or company name"
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  {/* JobCard column -- with scroll container */}
                  <div className="lg:col-span-2 space-y-4">
                    <div 
                      className="max-h-[650px] overflow-y-auto space-y-4 pr-2"
                      style={{ scrollbarWidth: 'thin' }}
                    >
                      {loading ? (
                        <div className="text-center py-8">Loading jobs...</div>
                      ) : error ? (
                        <div className="text-center py-8 text-red-600">{error}</div>
                      ) : jobs.length > 0 ? (
                        jobs.map((job, idx) => (
                          <JobCard
                            key={`${job.id}-${idx}`}
                            title={job.title}
                            location={job.location}
                            status={job.status}
                            type={job.type}
                            salary={job.salary}
                            work_location={job.work_location}
                            company={job.company}
                            description={job.description}
                            requirements={job.requirements}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">No jobs found. Add your first job!</div>
                      )}
                    </div>
                    <AddJobCardButton onClick={() => setShowAddModal(true)} />
                  </div>

                  {/* Sidebar */}
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
                      </CardContent>
                    </Card>
                  </aside>
                </div>
              </TabsContent>

              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
                  <div className="relative z-10 w-full max-w-xl mx-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">Add Job</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-3" onSubmit={handleAddJobSubmit}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input placeholder="Title" value={newJob.title} onChange={e => setNewJob(v => ({ ...v, title: e.target.value }))} />
                            <Input placeholder="Company" value={newJob.company} onChange={e => setNewJob(v => ({ ...v, company: e.target.value }))} />
                            <Input placeholder="Location" value={newJob.location} onChange={e => setNewJob(v => ({ ...v, location: e.target.value }))} />
                            <Input placeholder="Work Location (e.g., Remote)" value={newJob.work_location} onChange={e => setNewJob(v => ({ ...v, work_location: e.target.value }))} />
                            <Input placeholder="Employment Type" value={newJob.type} onChange={e => setNewJob(v => ({ ...v, type: e.target.value }))} />
                            <Input placeholder="Status" value={newJob.status} onChange={e => setNewJob(v => ({ ...v, status: e.target.value }))} />
                            <Input placeholder="Salary" value={newJob.salary} onChange={e => setNewJob(v => ({ ...v, salary: e.target.value }))} />
                            <Input placeholder="Description" value={newJob.description} onChange={e => setNewJob(v => ({ ...v, description: e.target.value }))} />
                            <div className="sm:col-span-2">
                              <Input placeholder="Requirements (comma separated)" value={newJob.requirementsText} onChange={e => setNewJob(v => ({ ...v, requirementsText: e.target.value }))} />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button type="submit">Add Job</Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

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
                  <h2 className="text-xl font-semibold mb-4">Feed</h2>
                  <NewFeed />
                </div>
              </TabsContent>
            </div>
          </main>
        </Tabs>
      </div>
    </div>
  );
}

{/* function to add the AddJob button */ }
export function AddJobCardButton({ onClick }) {
  return (
    <div className="flex justify-center mt-6">
      <button onClick={onClick} className="flex items-center justify-center w-24 h-12 rounded-full bg-purple-200 hover:bg-purple-300 transition shadow-md" aria-label="Add job card">
        <span className="text-black text-2xl">+</span>
      </button>
    </div>
  )
}

