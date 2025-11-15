// components/JobCard.jsx
import { MapPin, Building2, Edit2, Trash2, Bell, Calendar, Clock, DollarSign, Briefcase } from "lucide-react"
import { StatusDropdown } from "./StatusDropdown"

function getNotificationInfo(job) {
    const now = new Date();
    const notifications = [];

    if (job.interview_date) {
        const interviewDate = new Date(job.interview_date);
        const daysUntil = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 7) {
            notifications.push({
                type: 'interview',
                message: daysUntil === 0 ? 'Interview today!' : daysUntil === 1 ? 'Interview tomorrow' : `Interview in ${daysUntil} days`,
                date: interviewDate,
                urgent: daysUntil <= 1
            });
        }
    }

    if (job.application_deadline) {
        const deadline = new Date(job.application_deadline);
        const daysUntil = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 7) {
            notifications.push({
                type: 'deadline',
                message: daysUntil === 0 ? 'Deadline today!' : daysUntil === 1 ? 'Deadline tomorrow' : `Deadline in ${daysUntil} days`,
                date: deadline,
                urgent: daysUntil <= 2
            });
        }
    }

    if (job.follow_up_date) {
        const followUp = new Date(job.follow_up_date);
        const daysUntil = Math.ceil((followUp - now) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 3) {
            notifications.push({
                type: 'followup',
                message: daysUntil === 0 ? 'Follow-up today!' : daysUntil === 1 ? 'Follow-up tomorrow' : `Follow-up in ${daysUntil} days`,
                date: followUp,
                urgent: daysUntil <= 1
            });
        }
    }

    if (job.offer_deadline) {
        const offerDeadline = new Date(job.offer_deadline);
        const daysUntil = Math.ceil((offerDeadline - now) / (1000 * 60 * 60 * 24));
        if (daysUntil >= 0 && daysUntil <= 7) {
            notifications.push({
                type: 'offer',
                message: daysUntil === 0 ? 'Offer deadline today!' : daysUntil === 1 ? 'Offer deadline tomorrow' : `Offer deadline in ${daysUntil} days`,
                date: offerDeadline,
                urgent: daysUntil <= 2
            });
        }
    }

    return notifications.sort((a, b) => a.date - b.date);
}

export function JobCard({ id, title, location, status, type, salary, work_location, company, description, requirements, onEdit, onDelete, onStatusChange, interview_date, follow_up_date, application_deadline, offer_deadline }) {
    const job = { interview_date, follow_up_date, application_deadline, offer_deadline };
    const notifications = getNotificationInfo(job);
    const hasNotifications = notifications.length > 0;
    const urgentNotification = notifications.find(n => n.urgent);

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('applied')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (statusLower.includes('interview')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (statusLower.includes('offer')) return 'bg-green-100 text-green-700 border-green-200';
        if (statusLower.includes('rejected')) return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 p-6">
            {/* Notification banner */}
            {hasNotifications && (
                <div className={`mb-4 p-3 rounded-lg border-l-4 ${urgentNotification
                    ? 'bg-red-50 border-red-500'
                    : 'bg-amber-50 border-amber-500'
                    }`}>
                    <div className="flex items-start gap-2">
                        <Bell className={`w-4 h-4 mt-0.5 flex-shrink-0 ${urgentNotification ? 'text-red-600' : 'text-amber-600'
                            }`} />
                        <div className="flex-1">
                            {notifications.map((notif, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                                    <span className={`font-medium ${urgentNotification ? 'text-red-800' : 'text-amber-800'
                                        }`}>
                                        {notif.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                        {hasNotifications && (
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${urgentNotification ? 'bg-red-400' : 'bg-amber-400'
                                    } opacity-75`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${urgentNotification ? 'bg-red-500' : 'bg-amber-500'
                                    }`}></span>
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium text-slate-700">{company}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                    {onStatusChange && (
                        <StatusDropdown
                            currentStatus={status}
                            onStatusChange={onStatusChange}
                            jobId={id}
                        />
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(id)}
                            className="p-2 hover:bg-indigo-100 rounded-lg transition-colors text-indigo-600 hover:text-indigo-700"
                            aria-label="Edit job"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 hover:text-red-700"
                            aria-label="Delete job"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Info chips */}
            <div className="flex flex-wrap gap-2 mb-4">
                {location && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>{location}</span>
                    </div>
                )}
                {type && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>{type}</span>
                    </div>
                )}
                {salary && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                        <DollarSign className="w-4 h-4 text-slate-500" />
                        <span>{salary}</span>
                    </div>
                )}
                {work_location && (
                    <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700">
                        {work_location}
                    </div>
                )}
            </div>

            {/* Description */}
            {description && (
                <div className="mb-4 pt-3 border-t border-slate-200">
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {description}
                    </p>
                </div>
            )}

            {/* Requirements */}
            {requirements && requirements.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Requirements</p>
                    <ul className="space-y-1.5">
                        {requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="text-indigo-500 mt-1">•</span>
                                <span>{req}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
