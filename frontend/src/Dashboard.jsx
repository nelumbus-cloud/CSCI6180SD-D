import { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import DashboardLayout from '@/components/DashboardLayout';
import { jobService } from '@/services/jobService';
import { MessageNotification } from '@/components/MessageNotification';
import { JobSearchBar } from '@/components/JobSearchBar';
import { JobList } from '@/components/JobList';
import { JobFormModal } from '@/components/JobFormModal';
import { DeleteJobModal } from '@/components/DeleteJobModal';
import { JobStatsModal } from '@/components/JobStatsModal';
import { NotesModal } from '@/components/NotesModal';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import NewFeed from '@/components/NewFeed';
import { StickyNote } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('my-jobs');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetTitle, setDeleteTargetTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

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

  // Filter jobs based on search query and filters
  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (
        job.title?.toLowerCase().includes(query) ||
        job.company?.toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && job.status !== filters.status) {
      return false;
    }

    // Type filter
    if (filters.type && job.type !== filters.type) {
      return false;
    }

    // Work location filter
    if (filters.work_location && job.work_location !== filters.work_location) {
      return false;
    }

    return true;
  });

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
      resetJobForm();
    } catch (error) {
      console.error('Error saving job:', error);
      setError('Failed to save job: ' + (error.message || 'Unknown error'));
    }
  }

  function resetJobForm() {
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
    resetJobForm();
  }

  async function handleStatusChange(jobId, newStatus) {
    try {
      const jobToUpdate = jobs.find(job => job.id === jobId);
      if (!jobToUpdate) {
        setError('Job not found');
        return;
      }

      // Update only the status field
      const updatedJob = await jobService.updateJob(jobId, { status: newStatus });
      setJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
      setSuccessMessage(`Status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status: ' + (error.message || 'Unknown error'));
    }
  }

  const showSidebar = activeTab === 'my-jobs';

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <MessageNotification message={successMessage} type="success" />
      <MessageNotification message={error} type="error" />

      {activeTab === 'my-jobs' && (
        <JobSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      <main className={`grid grid-cols-1 gap-6 ${showSidebar ? 'lg:grid-cols-4' : 'lg:grid-cols-1'}`}>
        <div className={showSidebar ? 'lg:col-span-2' : 'lg:col-span-1'}>
          <TabsContent value="my-jobs" className="space-y-6">
            <JobList
              jobs={filteredJobs}
              loading={loading}
              error={error}
              onEdit={handleEditJob}
              onDelete={handleDeleteJob}
              onStatusChange={handleStatusChange}
              onAddClick={() => setShowAddModal(true)}
            />
          </TabsContent>

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

        {showSidebar && <DashboardSidebar />}
      </main>

      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={() => setShowStatsModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center font-semibold text-lg"
          aria-label="View statistics"
        >
          📊
        </button>
      </div>

      <div className="fixed bottom-8 left-8 z-40">
        <button
          onClick={() => setShowNotesModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          aria-label="View notes"
        >
          <StickyNote className="w-6 h-6" />
        </button>
      </div>

      <JobFormModal
        isOpen={showAddModal}
        isEditing={!!editingJobId}
        jobData={newJob}
        onClose={handleCloseModal}
        onSubmit={handleAddJobSubmit}
        onChange={setNewJob}
      />

      <DeleteJobModal
        isOpen={showDeleteModal}
        jobTitle={deleteTargetTitle}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <JobStatsModal
        isOpen={showStatsModal}
        jobs={jobs}
        onClose={() => setShowStatsModal(false)}
      />

      <NotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
      />
    </DashboardLayout>
  );
}
