import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Send, Users, Gift, CheckCircle, XCircle, FileText, TrendingUp } from 'lucide-react';
import { X } from 'lucide-react';

export function JobStatsModal({ isOpen, jobs, onClose }) {
    if (!isOpen) return null;

    const stats = {
        total: jobs.length,
        saved: jobs.filter(j => j.status === 'Saved' || j.status === 'In Progress').length,
        applied: jobs.filter(j => j.status === 'Applied').length,
        interviewing: jobs.filter(j => j.status === 'Interviewing').length,
        offered: jobs.filter(j => j.status === 'Offered').length,
        accepted: jobs.filter(j => j.status === 'Accepted').length,
        rejected: jobs.filter(j => j.status === 'Rejected').length
    };

    const getPercentage = (value) => {
        return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
    };

    const statCards = [
        {
            label: 'Total Jobs',
            value: stats.total,
            icon: Briefcase,
            color: 'indigo',
            bgColor: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            valueColor: 'text-indigo-600',
            borderColor: 'border-indigo-200'
        },
        {
            label: 'Saved',
            value: stats.saved,
            icon: FileText,
            color: 'slate',
            bgColor: 'bg-slate-50',
            iconColor: 'text-slate-600',
            valueColor: 'text-slate-700',
            borderColor: 'border-slate-200'
        },
        {
            label: 'Applied',
            value: stats.applied,
            icon: Send,
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600',
            valueColor: 'text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            label: 'Interviewing',
            value: stats.interviewing,
            icon: Users,
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600',
            valueColor: 'text-purple-600',
            borderColor: 'border-purple-200'
        },
        {
            label: 'Offered',
            value: stats.offered,
            icon: Gift,
            color: 'green',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600',
            valueColor: 'text-green-600',
            borderColor: 'border-green-200'
        },
        {
            label: 'Accepted',
            value: stats.accepted,
            icon: CheckCircle,
            color: 'emerald',
            bgColor: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            valueColor: 'text-emerald-600',
            borderColor: 'border-emerald-200'
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            icon: XCircle,
            color: 'red',
            bgColor: 'bg-red-50',
            iconColor: 'text-red-600',
            valueColor: 'text-red-600',
            borderColor: 'border-red-200'
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <Card className="shadow-2xl border-0">
                    <CardHeader className="bg-white border-b border-slate-200 relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg font-semibold text-slate-900">Job Statistics</CardTitle>
                                    <p className="text-xs text-slate-500 mt-0.5">Overview of your applications</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 bg-gradient-to-br from-slate-50 to-white">
                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {statCards.map((stat, index) => {
                                const Icon = stat.icon;
                                const percentage = getPercentage(stat.value);

                                return (
                                    <div
                                        key={index}
                                        className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-4 hover:shadow-md transition-all duration-200`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                                            <span className="text-xs font-semibold text-slate-500">
                                                {percentage}%
                                            </span>
                                        </div>
                                        <p className={`text-3xl font-bold ${stat.valueColor} mb-1`}>
                                            {stat.value}
                                        </p>
                                        <p className="text-xs font-medium text-slate-600">{stat.label}</p>
                                        {/* Progress bar */}
                                        <div className="mt-3 h-1.5 bg-white rounded-full overflow-hidden">
                                            <div
                                                className={`h-full bg-gradient-to-r ${stat.valueColor.replace('text-', 'from-')} ${stat.valueColor.replace('text-', 'to-')} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Summary Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Success Rate Card */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Success Rate</h3>
                                        <p className="text-xs text-slate-600">Accepted applications</p>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-green-600">
                                        {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                                    </span>
                                    <span className="text-sm text-slate-600">
                                        ({stats.accepted} of {stats.total})
                                    </span>
                                </div>
                            </div>

                            {/* Active Applications Card */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Active Applications</h3>
                                        <p className="text-xs text-slate-600">In progress</p>
                                    </div>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-blue-600">
                                        {stats.applied + stats.interviewing + stats.offered}
                                    </span>
                                    <span className="text-sm text-slate-600">
                                        applications
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <Button
                            onClick={onClose}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                        >
                            Close
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
