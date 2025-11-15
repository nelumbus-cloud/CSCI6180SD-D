import { Plus } from 'lucide-react';

export function AddJobCardButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full mt-4 p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group"
            aria-label="Add new job"
        >
            <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 group-hover:border-indigo-300 group-hover:bg-indigo-100 transition-colors">
                    <Plus className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">
                    Add New Job
                </span>
            </div>
        </button>
    );
}

