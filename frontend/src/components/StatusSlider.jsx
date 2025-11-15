import { Check } from 'lucide-react';

const STATUS_STAGES = [
    { value: 'Saved', label: 'Saved', icon: '💾' },
    { value: 'Applied', label: 'Applied', icon: '📝' },
    { value: 'Interviewing', label: 'Interviewing', icon: '💼' },
    { value: 'Offered', label: 'Offered', icon: '🎉' },
    { value: 'Accepted', label: 'Accepted', icon: '✅' },
    { value: 'Rejected', label: 'Rejected', icon: '❌' }
];

const STATUS_ORDER = {
    'Saved': 0,
    'In Progress': 0,
    'Applied': 1,
    'Interviewing': 2,
    'Offered': 3,
    'Accepted': 4,
    'Rejected': 5
};

export function StatusSlider({ currentStatus, onStatusChange, jobId, compact = false }) {
    const getCurrentStageIndex = () => {
        const normalizedStatus = currentStatus || 'Saved';
        return STATUS_ORDER[normalizedStatus] ?? 0;
    };

    const currentStageIndex = getCurrentStageIndex();

    const handleStageClick = (stage) => {
        if (onStatusChange && jobId) {
            onStatusChange(jobId, stage.value);
        }
    };

    const getStageColor = (index, stage) => {
        if (index < currentStageIndex) {
            return 'bg-indigo-600 text-white border-indigo-600';
        }
        if (index === currentStageIndex) {
            if (stage.value === 'Rejected') {
                return 'bg-red-500 text-white border-red-500';
            }
            return 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300';
        }
        return 'bg-slate-100 text-slate-500 border-slate-200';
    };

    if (compact) {
        return (
            <div className="flex items-center gap-1">
                {STATUS_STAGES.map((stage, index) => {
                    const isActive = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const isClickable = onStatusChange && jobId;

                    return (
                        <button
                            key={stage.value}
                            onClick={() => isClickable && handleStageClick(stage)}
                            disabled={!isClickable}
                            className={`relative flex items-center justify-center ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                                } transition-all duration-200`}
                            title={stage.label}
                        >
                            <div className={`
                                w-6 h-6 rounded-full border flex items-center justify-center text-xs
                                transition-all duration-200
                                ${getStageColor(index, stage)}
                                ${isClickable && !isActive ? 'hover:bg-slate-200 hover:border-slate-300' : ''}
                                ${isCurrent ? 'shadow-md scale-110' : 'scale-100'}
                            `}>
                                {index < currentStageIndex ? (
                                    <Check className="w-3 h-3" />
                                ) : (
                                    <span className="text-xs">{stage.icon}</span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Application Stage</h4>
                <span className="text-xs text-slate-500">{currentStatus || 'Saved'}</span>
            </div>

            <div className="relative">
                {/* Progress line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                        style={{ width: `${(currentStageIndex / (STATUS_STAGES.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Stages */}
                <div className="relative flex items-center justify-between">
                    {STATUS_STAGES.map((stage, index) => {
                        const isActive = index <= currentStageIndex;
                        const isCurrent = index === currentStageIndex;
                        const isClickable = onStatusChange && jobId;

                        return (
                            <button
                                key={stage.value}
                                onClick={() => isClickable && handleStageClick(stage)}
                                disabled={!isClickable}
                                className={`relative z-10 flex flex-col items-center group ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                                    } transition-all duration-200`}
                                title={stage.label}
                            >
                                <div className={`
                                    w-10 h-10 rounded-full border-2 flex items-center justify-center
                                    transition-all duration-200
                                    ${getStageColor(index, stage)}
                                    ${isClickable && !isActive ? 'hover:bg-slate-200 hover:border-slate-300' : ''}
                                    ${isCurrent ? 'shadow-lg scale-110' : ''}
                                `}>
                                    {index < currentStageIndex ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span className="text-lg">{stage.icon}</span>
                                    )}
                                </div>
                                <span className={`
                                    mt-2 text-xs font-medium whitespace-nowrap
                                    ${isActive ? 'text-slate-900' : 'text-slate-400'}
                                    ${isCurrent ? 'font-bold' : ''}
                                `}>
                                    {stage.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
