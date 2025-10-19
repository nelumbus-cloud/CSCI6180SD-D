import { Briefcase, User, Search } from 'lucide-react';
import { useState } from 'react'; // state hook
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCard } from '@/components/JobCard';
import { ChevronLeft, ChevronRight } from 'lucide-react'; //for pagination arrows
import NewFeed from '@/components/NewFeed';

export default function DashboardLayout() {
  //list of jobs -- 2 hardcoded
  const [jobs, setJobs] = useState([
    {
      title: "Software Engineer, Full Stack",
      location: "New York City, New York",
      status: "In Progress",
      type: "Full Time",
      salary: "$80k - $150k/yr",
      work_location: "Remote",
      company: "Apex Omnitools",
      description: "salarian-owned omni-tool developer and producer",
      requirements: [
        "2+ years of professional software engineering",
        "Experience in Angular, C#, and .NET Core Web API development"
      ]
    },
    {
      title: "Software Engineer, Full Stack",
      location: "New York City, New York",
      status: "In Progress",
      type: "Full Time",
      salary: "$80k - $150k/yr",
      work_location: "Remote",
      company: "Apex Omnitools",
      description: "salarian-owned omni-tool developer and producer",
      requirements: [
        "2+ years of professional software engineering",
        "Experience in Angular, C#, and .NET Core Web API development"
      ]
    }
  ]);

  const pageSize = 10; // 10 jobs per page
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize)); //at least one page
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedJobs = jobs.slice(startIndex, startIndex + pageSize);

  function handleAddJobSubmit(e) {
    e.preventDefault();

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
    setJobs(prev => {
      const next = [...prev, jobToAdd];
      // jump to last page where the new card will appear
      const nextTotalPages = Math.max(1, Math.ceil(next.length / pageSize));
      setCurrentPage(nextTotalPages);
      return next;
    });

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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="lg:col-span-2 mb-6 flex justify-start">
                    <div className="relative w-full max-w-[calc(50%-1rem)]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        placeholder="Search job title or company name"
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  {/* JobCard column */}
                  <div className="space-y-4">
                    {paginatedJobs.map((job, idx) => (
                      <JobCard
                        key={`${job.title}-${idx}`}
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
                    ))}
                    <AddJobCardButton onClick={() => setShowAddModal(true)} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>

                  {/* Sidebar */}
                  <aside className="space-y-6">
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

{/* function to add the pagination */ }
export function Pagination({ currentPage, totalPages, onPageChange }) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  function renderPageButtons() {
    const buttons = [];
    const pushBtn = (page) => {
      buttons.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 text-base rounded-md transition ${page === currentPage ? 'bg-green-300 text-gray-900' : 'text-gray-700 hover:bg-green-300'}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      );
    };

    if (totalPages <= 7) {
      for (let p = 1; p <= totalPages; p++) pushBtn(p);
      return buttons;
    }

    pushBtn(1);
    if (currentPage > 3) buttons.push(<span key="l-ell" className="px-2 py-1 text-gray-500">...</span>);

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let p = start; p <= end; p++) pushBtn(p);

    if (currentPage < totalPages - 2) buttons.push(<span key="r-ell" className="px-2 py-1 text-gray-500">...</span>);
    pushBtn(totalPages);
    return buttons;
  }

  return (
    <div className="w-full mt-8">
      <nav className="flex justify-between items-center w-full max-w-4xl mx-auto" aria-label="Pagination">

        {/* Previous button */}
        <Button variant="outline-none" size="sm" disabled={!canPrev} onClick={() => canPrev && onPageChange(currentPage - 1)} className="flex items-center gap-1 text-base text-gray-700 hover:bg-green-300 transition disabled:opacity-50">
          <ChevronLeft className="h-5 w-5" />Previous
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {renderPageButtons()}
        </div>

        {/* Next button */}
        <Button variant="outline-none" size="sm" disabled={!canNext} onClick={() => canNext && onPageChange(currentPage + 1)} className="flex items-center gap-1 text-base text-gray-700 hover:bg-green-300 transition disabled:opacity-50">
          Next<ChevronRight className="h-5 w-5" />
        </Button>
      </nav>
    </div>
  )
}
