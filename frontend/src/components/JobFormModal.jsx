import { useState } from 'react';
import { Plus, Pencil, Sparkles, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { jobService } from '@/services/jobService';

export function JobFormModal({
    isOpen,
    isEditing,
    jobData,
    onClose,
    onSubmit,
    onChange
}) {
    const [activeTab, setActiveTab] = useState('manual');
    const [pasteText, setPasteText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [parseError, setParseError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    const handleParseText = async () => {
        if (!pasteText.trim()) {
            setParseError('Please paste some job description text');
            return;
        }

        setIsParsing(true);
        setParseError('');

        try {
            const result = await jobService.parseJobDescription(pasteText);

            if (result.success && result.data) {
                const parsed = result.data;

                // Convert requirements array to comma-separated string
                const requirementsText = Array.isArray(parsed.requirements)
                    ? parsed.requirements.join(', ')
                    : '';

                // Update the form with parsed data
                onChange({
                    title: parsed.title || '',
                    company: parsed.company || '',
                    location: parsed.location || '',
                    work_location: parsed.work_location || '',
                    type: parsed.type || '',
                    status: jobData.status || 'Saved',
                    salary: parsed.salary || '',
                    description: parsed.description || '',
                    requirementsText: requirementsText
                });

                // Switch to manual tab to show the filled form
                setActiveTab('manual');
                setPasteText('');
            } else {
                setParseError(result.error || 'Failed to parse job description');
            }
        } catch (error) {
            console.error('Error parsing:', error);
            setParseError(error.message || 'Failed to parse job description. Please try again.');
        } finally {
            setIsParsing(false);
        }
    };

    const handleClose = () => {
        setActiveTab('manual');
        setPasteText('');
        setParseError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
            <div className="relative z-10 w-full max-w-2xl">
                <Card className="shadow-2xl">
                    <CardHeader className="bg-slate-50 border-b border-slate-200">
                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
                            {isEditing ? (
                                <>
                                    <Pencil className="w-5 h-5 text-indigo-600" />
                                    Edit Job
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5 text-indigo-600" />
                                    Add New Job
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!isEditing && (
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="manual" className="text-sm">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Manual Entry
                                    </TabsTrigger>
                                    <TabsTrigger value="paste" className="text-sm">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Paste & Parse
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="paste" className="mt-4">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Paste Job Description
                                            </label>
                                            <textarea
                                                placeholder="Paste the job description, email, or any unstructured text about the job here..."
                                                value={pasteText}
                                                onChange={(e) => {
                                                    setPasteText(e.target.value);
                                                    setParseError('');
                                                }}
                                                rows={8}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                            />
                                            <p className="text-xs text-slate-500 mt-2">
                                                AI will extract job details automatically
                                            </p>
                                        </div>

                                        {parseError && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                                {parseError}
                                            </div>
                                        )}

                                        <Button
                                            onClick={handleParseText}
                                            disabled={isParsing || !pasteText.trim()}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            {isParsing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Parsing...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Parse & Fill Form
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}

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
                                <Button type="button" variant="outline" onClick={handleClose} className="border-slate-300">
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
