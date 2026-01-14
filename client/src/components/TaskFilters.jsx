import { Search, Filter, X } from 'lucide-react';
import { defaultCategories, priorityOptions, statusOptions } from '../utils/helpers';

const TaskFilters = ({ filters, onFilterChange, onClear }) => {
    const hasActiveFilters = filters.search || filters.status || filters.priority || filters.category;

    return (
        <div className="card p-4">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search || ''}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                        className="input pl-10"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    {/* Status filter */}
                    <select
                        value={filters.status || ''}
                        onChange={(e) => onFilterChange('status', e.target.value)}
                        className="input w-auto min-w-[140px]"
                    >
                        <option value="">All Status</option>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Priority filter */}
                    <select
                        value={filters.priority || ''}
                        onChange={(e) => onFilterChange('priority', e.target.value)}
                        className="input w-auto min-w-[140px]"
                    >
                        <option value="">All Priority</option>
                        {priorityOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Category filter */}
                    <select
                        value={filters.category || ''}
                        onChange={(e) => onFilterChange('category', e.target.value)}
                        className="input w-auto min-w-[140px]"
                    >
                        <option value="">All Categories</option>
                        {defaultCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={onClear}
                            className="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                            <X className="w-4 h-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap items-center gap-2 pt-3 border-t border-dark-100 dark:border-dark-800">
                    <span className="text-sm text-dark-500 dark:text-dark-400">Active filters:</span>
                    {filters.search && (
                        <span className="badge-info flex items-center gap-1">
                            Search: "{filters.search}"
                            <button onClick={() => onFilterChange('search', '')}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.status && (
                        <span className="badge-info flex items-center gap-1">
                            {filters.status}
                            <button onClick={() => onFilterChange('status', '')}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.priority && (
                        <span className="badge-info flex items-center gap-1">
                            {filters.priority} Priority
                            <button onClick={() => onFilterChange('priority', '')}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.category && (
                        <span className="badge-info flex items-center gap-1">
                            {filters.category}
                            <button onClick={() => onFilterChange('category', '')}>
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskFilters;
