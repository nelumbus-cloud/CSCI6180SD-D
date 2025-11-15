import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DeleteJobModal({
    isOpen,
    jobTitle,
    isDeleting,
    onConfirm,
    onCancel
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
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
                                Are you sure you want to delete <span className="font-semibold text-slate-900">"{jobTitle}"</span>?
                            </p>
                            <p className="text-sm text-slate-600">
                                This action cannot be undone. The job will be permanently removed from your job list.
                            </p>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onCancel}
                                    className="border-slate-300"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={onConfirm}
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
    );
}

