import { Briefcase, User, Search, LogOut, AlertCircle } from 'lucide-react';
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
  const [successMessage, setSuccessMessage] = useState('');

  const [showAddModal, setShowAddModal] = useState(false); //modal for adding new jobs
  const [editingJobId, setEditingJobId] = useState(null); //track which job is being edited
  const [showDeleteModal, setShowDeleteModal] = useState(false); //modal for delete confirmation
  const [deleteTargetId, setDeleteTargetId] = useState(null); //job to be deleted
  const [deleteTargetTitle, setDeleteTargetTitle] = useState(''); //job title for display
  const [isDeleting, setIsDeleting] = useState(false); //loading state for delete

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
        console.log('Fetched jobs:', jobsData);
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

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  async function handleAddJobSubmit(e) {
    e.preventDefault();

    try {
      // Validate required fields
      if (!newJob.title || !newJob.company) {
        setError('Job title and company are required');
        return;
      }

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

      console.log('Submitting job:', jobToAdd);

      if (editingJobId) {
        // Update existing job
        console.log('Updating job with ID:', editingJobId);
        const updatedJob = await jobService.updateJob(editingJobId, jobToAdd);
        console.log('Updated job response:', updatedJob);
        setJobs(prev => prev.map(job => job.id === editingJobId ? updatedJob : job));
        setSuccessMessage('Job updated successfully!');
        setEditingJobId(null);
      } else {
        // Create new job
        console.log('Creating new job');
        const savedJob = await jobService.createJob(jobToAdd);
        console.log('Created job response:', savedJob);
        setJobs(prev => [...prev, savedJob]);
        setSuccessMessage('Job added successfully!');
      }

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
      console.error('Error saving job:', error);
      setError('Failed to save job: ' + (error.message || 'Unknown error'));
    }
  }

  function handleEditJob(jobId) {
    console.log('Edit clicked for job:', jobId);
    console.log('Available jobs:', jobs);
    const jobToEdit = jobs.find(job => job.id === jobId);
    console.log('Job found:', jobToEdit);

    if (jobToEdit) {
      const requirements = Array.isArray(jobToEdit.requirements)
        ? jobToEdit.requirements.join(', ')
        : '';

      setNewJob({
        title: jobToEdit.title,
        location: jobToEdit.location || '',
        status: jobToEdit.status || '',
        type: jobToEdit.type || '',
        salary: jobToEdit.salary || '',
        work_location: jobToEdit.work_location || '',
        company: jobToEdit.company || '',
        description: jobToEdit.description || '',
        requirementsText: requirements
      });
      setEditingJobId(jobId);
      setShowAddModal(true);
    } else {
      console.error('Job not found with ID:', jobId);
      setError('Failed to load job for editing');
    }
  }

  function handleDeleteJob(jobId) {
    const jobToDelete = jobs.find(job => job.id === jobId);
    if (jobToDelete) {
      setDeleteTargetId(jobId);
      setDeleteTargetTitle(jobToDelete.title);
      setShowDeleteModal(true);
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;

    try {
      setIsDeleting(true);
      await jobService.deleteJob(deleteTargetId);
      setJobs(prev => prev.filter(job => job.id !== deleteTargetId));
      setSuccessMessage('Job deleted successfully!');
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      setDeleteTargetTitle('');
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job: ' + (error.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
    setDeleteTargetTitle('');
  }

  function handleCloseModal() {
    setShowAddModal(false);
    setEditingJobId(null);
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
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">

        {/* Main Tabs Component Wrapper */}
        <Tabs defaultValue="my-jobs" className="w-full">

          {/* Header Section - Enhanced Professional Design */}
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-8 border-b-2 border-slate-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg shadow-lg">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">My Career</h1>
                  <p className="text-sm text-slate-600 mt-1">Track and manage your job opportunities</p>
                </div>
              </div>

              {/* Centered Tab Navigation */}
              <div className="flex-grow flex justify-center">
                <TabsList className="bg-white border border-slate-200 shadow-sm">
                  <TabsTrigger value="my-jobs" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">My Jobs</TabsTrigger>
                  <TabsTrigger value="resume-studio" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Resume Studio</TabsTrigger>
                  <TabsTrigger value="feed" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700">Feed</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="hover:bg-slate-200">
                  <User className="h-5 w-5 text-slate-600" />
                  <span className="sr-only">Profile</span>
                </Button>
                <Button variant="outline" className="border-slate-300 hover:bg-slate-100">Logout</Button>
              </div>

            </div>
          </header>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 shadow-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 shadow-sm">
              {error}
            </div>
          )}

          {/* Main Content Grid */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column (takes 2/3 of the space on large screens) */}
            <div className="lg:col-span-2">

              {/* My Jobs Tab Content */}
              <TabsContent value="my-jobs" className="space-y-6">

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search job title or company name"
                    className="pl-12 py-3 bg-white border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Jobs List with scroll container */}
                <div className="space-y-4">
                  <div
                    className="max-h-[700px] overflow-y-auto space-y-4 pr-3"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                          <p className="text-slate-600">Loading jobs...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg border border-red-100">
                        <p>{error}</p>
                      </div>
                    ) : jobs.length > 0 ? (
                      jobs.map((job) => (
                        <JobCard
                          key={job.id}
                          id={job.id}
                          title={job.title}
                          location={job.location}
                          status={job.status}
                          type={job.type}
                          salary={job.salary}
                          work_location={job.work_location}
                          company={job.company}
                          description={job.description}
                          requirements={job.requirements}
                          onEdit={handleEditJob}
                          onDelete={handleDeleteJob}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                        <p className="text-lg font-medium">No jobs found</p>
                        <p className="text-sm mt-1">Add your first job to get started</p>
                      </div>
                    )}
                  </div>
                  <AddJobCardButton onClick={() => setShowAddModal(true)} />
                </div>
              </TabsContent>

              {/* Modal for Add/Edit Job */}
              {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
                  <div className="relative z-10 w-full max-w-2xl">
                    <Card className="shadow-2xl">
                      <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
                        <CardTitle className="text-2xl">
                          {editingJobId ? 'Edit Job' : 'Add New Job'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <form className="space-y-4" onSubmit={handleAddJobSubmit}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                              <Input
                                placeholder="e.g., Senior Software Engineer"
                                value={newJob.title}
                                onChange={e => setNewJob(v => ({ ...v, title: e.target.value }))}
                                required
                                className="border-slate-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                              <Input
                                placeholder="e.g., Tech Corp"
                                value={newJob.company}
                                onChange={e => setNewJob(v => ({ ...v, company: e.target.value }))}
                                required
                                className="border-slate-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                              <Input
                                placeholder="e.g., San Francisco, CA"
                                value={newJob.location}
                                onChange={e => setNewJob(v => ({ ...v, location: e.target.value }))}
                                className="border-slate-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Work Location</label>
                              <Input
                                placeholder="e.g., Remote, Hybrid, On-site"
                                value={newJob.work_location}
                                onChange={e => setNewJob(v => ({ ...v, work_location: e.target.value }))}
                                className="border-slate-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                              <Input
                                placeholder="e.g., Full-time, Contract"
                                value={newJob.type}
                                onChange={e => setNewJob(v => ({ ...v, type: e.target.value }))}
                                className="border-slate-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                              <Input
                                placeholder="e.g., Applied, Interviewing"
                                value={newJob.status}
                                onChange={e => setNewJob(v => ({ ...v, status: e.target.value }))}
                                className="border-slate-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Salary</label>
                              <Input
                                placeholder="e.g., $80k - $150k/yr"
                                value={newJob.salary}
                                onChange={e => setNewJob(v => ({ ...v, salary: e.target.value }))}
                                className="border-slate-200"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                              <Input
                                placeholder="Brief description of the role"
                                value={newJob.description}
                                onChange={e => setNewJob(v => ({ ...v, description: e.target.value }))}
                                className="border-slate-200"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-slate-700 mb-2">Requirements</label>
                              <Input
                                placeholder="Enter requirements separated by commas"
                                value={newJob.requirementsText}
                                onChange={e => setNewJob(v => ({ ...v, requirementsText: e.target.value }))}
                                className="border-slate-200"
                              />
                              <p className="text-xs text-slate-500 mt-1">Example: Python, React, 5+ years experience</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                            <Button type="button" variant="outline" onClick={handleCloseModal} className="border-slate-300">
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              {editingJobId ? 'Update Job' : 'Add Job'}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelDelete} />
                  <div className="relative z-10 w-full max-w-md">
                    <Card className="shadow-2xl border-red-200">
                      <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <AlertCircle className="w-6 h-6" />
                          Delete Job
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <p className="text-slate-700">
                            Are you sure you want to delete <span className="font-semibold text-slate-900">"{deleteTargetTitle}"</span>?
                          </p>
                          <p className="text-sm text-slate-600">
                            This action cannot be undone. The job will be permanently removed from your job list.
                          </p>
                          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelDelete}
                              className="border-slate-300"
                              disabled={isDeleting}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={confirmDelete}
                              className="bg-red-600 hover:bg-red-700 text-white"
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete Job'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Resume Studio Tab */}
              <TabsContent value="resume-studio">
                <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                  <h2 className="text-2xl font-semibold text-slate-900">Resume Studio</h2>
                  <p className="mt-4 text-slate-600">
                    The resume builder, templates, and related components will be rendered here.
                  </p>
                </div>
              </TabsContent>

              {/* Feed Tab */}
              <TabsContent value="feed">
                <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-6">Feed</h2>
                  <NewFeed />
                </div>
              </TabsContent>
            </div>

            {/* Sidebar - Right Column */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Next Event Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Next Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-medium text-slate-800">Interview with Acme Inc.</p>
                    <p className="text-sm text-slate-600 mt-2">📅 Sept 5 - 12:15 PM</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Job Card */}
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Suggested Job Match
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <JobCard
                    title="Software Engineer, Full Stack"
                    location="New York City, New York"
                    status="Recommended"
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

              {/* Stats/Info Card */}
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">Job Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded border border-slate-200">
                      <span className="text-sm font-medium text-slate-600">Total Jobs</span>
                      <span className="text-lg font-bold text-indigo-600">{jobs.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded border border-slate-200">
                      <span className="text-sm font-medium text-slate-600">Applications</span>
                      <span className="text-lg font-bold text-indigo-600">{jobs.filter(j => j.status === 'Applied').length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded border border-slate-200">
                      <span className="text-sm font-medium text-slate-600">Interviews</span>
                      <span className="text-lg font-bold text-indigo-600">{jobs.filter(j => j.status === 'Interviewing' || j.status === 'In Progress').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
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
      <button
        onClick={onClick}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl text-white font-semibold"
        aria-label="Add new job"
      >
        <span className="text-2xl">+</span>
      </button>
    </div>
  )
}

