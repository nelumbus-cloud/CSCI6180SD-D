import { Search, AlertCircle, Plus, Pencil, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent } from '@/components/ui/tabs';
import { JobCard } from '@/components/JobCard';
import NewFeed from '@/components/NewFeed';
import DashboardLayout from '@/components/DashboardLayout';
import { jobService } from '@/services/jobService';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  async function handleAddJobSubmit(e) {
    e.preventDefault();

    try {
      if (!newJob.title || !newJob.company) {
        setError('Job title and company are required');
        return;
      }

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

      if (editingJobId) {
        const updatedJob = await jobService.updateJob(editingJobId, jobToAdd);
        setJobs(prev => prev.map(job => job.id === editingJobId ? updatedJob : job));
        setSuccessMessage('Job updated successfully!');
        setEditingJobId(null);
      } else {
        const savedJob = await jobService.createJob(jobToAdd);
        setJobs(prev => [...prev, savedJob]);
        setSuccessMessage('Job added successfully!');
      }

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
    const jobToEdit = jobs.find(job => job.id === jobId);

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
    <DashboardLayout>
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

      <div className="relative mb-6 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search job title or company name"
          className="pl-12 py-3 bg-white border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full"
        />
      </div>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <TabsContent value="my-jobs" className="space-y-6">
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

          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal} />
              <div className="relative z-10 w-full max-w-2xl">
                <Card className="shadow-2xl">
                  <CardHeader className="bg-slate-50 border-b border-slate-200">
                    <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
                      {editingJobId ? (
                        <>
                          <Pencil className="w-6 h-6 text-indigo-600" />
                          Edit Job
                        </>
                      ) : (
                        <>
                          <Plus className="w-6 h-6 text-indigo-600" />
                          Add New Job
                        </>
                      )}
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

          {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={cancelDelete} />
              <div className="relative z-10 w-full max-w-md">
                <Card className="shadow-2xl">
                  <CardHeader className="bg-slate-50 border-b border-slate-200">
                    <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
                      <AlertCircle className="w-6 h-6 text-red-600" />
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

          <TabsContent value="resume-studio">
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Resume Studio</h2>
              <p className="mt-4 text-slate-600">
                The resume builder, templates, and related components will be rendered here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="feed">
            <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Feed</h2>
              <NewFeed />
            </div>
          </TabsContent>
        </div>

        <aside className="lg:col-span-2 flex flex-col min-h-[750px] gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Next Event</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div>
                <p className="font-medium text-slate-800">Interview with Acme Inc.</p>
                <p className="text-sm text-slate-600 mt-2">📅 Sept 5 - 12:15 PM</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md transition-shadow flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Suggested Job Match
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
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
        </aside>
      </main>

      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowStatsModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center font-semibold text-lg"
        >
          📊
        </button>
      </div>

      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowStatsModal(false)} />
          <div className="relative z-10 w-full max-w-md">
            <Card className="shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <CardTitle className="text-2xl">Job Statistics</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600">{jobs.length}</p>
                    <p className="text-sm text-slate-600">Total Jobs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{jobs.filter(j => j.status === 'Applied').length}</p>
                    <p className="text-sm text-slate-600">Applied</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{jobs.filter(j => j.status === 'Interviewing').length}</p>
                    <p className="text-sm text-slate-600">Interviewing</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">{jobs.filter(j => j.status === 'Offered').length}</p>
                    <p className="text-sm text-slate-600">Offered</p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowStatsModal(false)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

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
  );
}
