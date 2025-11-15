import { Briefcase } from 'lucide-react';
import { JobCard } from '@/components/JobCard';
import { AddJobCardButton } from './AddJobCardButton';

export function JobList({ jobs, loading, error, onEdit, onDelete, onStatusChange, onAddClick }) {
    return (
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
                            interview_date={job.interview_date}
                            follow_up_date={job.follow_up_date}
                            application_deadline={job.application_deadline}
                            offer_deadline={job.offer_deadline}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onStatusChange={onStatusChange}
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
            <AddJobCardButton onClick={onAddClick} />
        </div>
    );
}

