import { Plus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function JobFormModal({
    isOpen,
    isEditing,
    jobData,
    onClose,
    onSubmit,
    onChange
}) {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-2xl">
                <Card className="shadow-2xl">
                    <CardHeader className="bg-slate-50 border-b border-slate-200">
                        <CardTitle className="flex items-center gap-3 text-2xl text-slate-900">
                            {isEditing ? (
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
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                                    <Input
                                        placeholder="e.g., Senior Software Engineer"
                                        value={jobData.title || ''}
                                        onChange={e => onChange({ ...jobData, title: e.target.value })}
                                        required
                                        className="border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                                    <Input
                                        placeholder="e.g., Tech Corp"
                                        value={jobData.company || ''}
                                        onChange={e => onChange({ ...jobData, company: e.target.value })}
                                        required
                                        className="border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                                    <Input
                                        placeholder="e.g., San Francisco, CA"
                                        value={jobData.location || ''}
                                        onChange={e => onChange({ ...jobData, location: e.target.value })}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Work Location</label>
                                    <Input
                                        placeholder="e.g., Remote, Hybrid, On-site"
                                        value={jobData.work_location || ''}
                                        onChange={e => onChange({ ...jobData, work_location: e.target.value })}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                                    <Input
                                        placeholder="e.g., Full-time, Contract"
                                        value={jobData.type || ''}
                                        onChange={e => onChange({ ...jobData, type: e.target.value })}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                    <Input
                                        placeholder="e.g., Applied, Interviewing"
                                        value={jobData.status || ''}
                                        onChange={e => onChange({ ...jobData, status: e.target.value })}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Salary</label>
                                    <Input
                                        placeholder="e.g., $80k - $150k/yr"
                                        value={jobData.salary || ''}
                                        onChange={e => onChange({ ...jobData, salary: e.target.value })}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                    <Input
                                        placeholder="Brief description of the role"
                                        value={jobData.description || ''}
                                        onChange={e => onChange({ ...jobData, description: e.target.value })}
                                        className="border-slate-200"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Requirements</label>
                                    <Input
                                        placeholder="Enter requirements separated by commas"
                                        value={jobData.requirementsText || ''}
                                        onChange={e => onChange({ ...jobData, requirementsText: e.target.value })}
                                        className="border-slate-200"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Example: Python, React, 5+ years experience</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <Button type="button" variant="outline" onClick={onClose} className="border-slate-300">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {isEditing ? 'Update Job' : 'Add Job'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

