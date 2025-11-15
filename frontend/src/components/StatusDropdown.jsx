import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const STATUS_OPTIONS = [
    { value: 'Saved', label: 'Saved' },
    { value: 'Applied', label: 'Applied' },
    { value: 'Interviewing', label: 'Interviewing' },
    { value: 'Offered', label: 'Offered' },
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Rejected', label: 'Rejected' }
];

const STATUS_MAP = {
    'In Progress': 'Saved',
    'Saved': 'Saved',
    'Applied': 'Applied',
    'Interviewing': 'Interviewing',
    'Offered': 'Offered',
    'Accepted': 'Accepted',
    'Rejected': 'Rejected'
};

export function StatusDropdown({ currentStatus, onStatusChange, jobId }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const normalizedStatus = STATUS_MAP[currentStatus] || 'Saved';
    const selectedOption = STATUS_OPTIONS.find(opt => opt.value === normalizedStatus) || STATUS_OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (option) => {
        if (onStatusChange && jobId) {
            onStatusChange(jobId, option.value);
        }
        setIsOpen(false);
    };

    const getStatusColor = (status) => {
        const statusLower = status?.toLowerCase() || '';
        if (statusLower.includes('applied')) return 'bg-blue-100 text-blue-700 border-blue-200';
        if (statusLower.includes('interview')) return 'bg-purple-100 text-purple-700 border-purple-200';
        if (statusLower.includes('offer')) return 'bg-green-100 text-green-700 border-green-200';
        if (statusLower.includes('accepted')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (statusLower.includes('rejected')) return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-slate-100 text-slate-700 border-slate-200';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                    ${getStatusColor(selectedOption.value)}
                    hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
                `}
            >
                <span>{selectedOption.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        <div className="py-1">
                            {STATUS_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option)}
                                    className={`
                                        w-full text-left px-4 py-2 text-sm transition-colors
                                        ${option.value === selectedOption.value
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-slate-700 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

