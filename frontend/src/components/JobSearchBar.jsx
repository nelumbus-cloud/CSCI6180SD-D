import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function JobSearchBar({
    value,
    onChange,
    filters = {},
    onFiltersChange,
    placeholder = "Search job title or company name"
}) {
    const [showFilters, setShowFilters] = useState(false);

    const statusOptions = ['Applied', 'Interviewing', 'Offered', 'Rejected', 'In Progress'];
    const typeOptions = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Freelance'];
    const workLocationOptions = ['Remote', 'Hybrid', 'On-site'];

    const handleFilterChange = (filterType, filterValue) => {
        const newFilters = { ...filters };
        if (newFilters[filterType] === filterValue) {
            delete newFilters[filterType];
        } else {
            newFilters[filterType] = filterValue;
        }
        onFiltersChange?.(newFilters);
    };

    const clearFilters = () => {
        onFiltersChange?.({});
    };

    const activeFiltersCount = Object.keys(filters).length;

    return (
        <div className="mb-6 space-y-4">
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="pl-12 pr-12 py-3 bg-white border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full rounded-lg"
                    />
                    {value && (
                        <button
                            onClick={() => onChange?.('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </button>
                    )}
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`border-slate-300 hover:bg-slate-50 ${showFilters ? 'bg-indigo-50 border-indigo-300' : ''}`}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">
                            {activeFiltersCount}
                        </span>
                    )}
                </Button>
            </div>

            {showFilters && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-md p-5 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-900">Filter Jobs</h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                Status
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleFilterChange('status', option)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.status === option
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                Employment Type
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {typeOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleFilterChange('type', option)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.type === option
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Work Location Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">
                                Work Location
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {workLocationOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleFilterChange('work_location', option)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filters.work_location === option
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
