import { useState } from 'react';
import { Edit2, Trash2, Calendar, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatDate, formatRelativeTime, isOverdue, isDueSoon, getPriorityClass, getStatusClass, truncate } from '../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await onDelete(task.id);
        setIsDeleting(false);
        setShowMenu(false);
    };

    const handleStatusChange = (newStatus) => {
        onStatusChange(task.id, newStatus);
    };

    const isTaskOverdue = task.status !== 'Completed' && isOverdue(task.dueDate);
    const isTaskDueSoon = task.status !== 'Completed' && isDueSoon(task.dueDate);

    return (
        <div
            className={`card-hover p-5 relative group ${task.status === 'Completed' ? 'opacity-75' : ''
                } ${isTaskOverdue ? 'border-red-200 dark:border-red-900/50' : ''}`}
        >
            {/* Priority indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${task.priority === 'High' ? 'bg-red-500' :
                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                }`} />

            <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                    onClick={() => handleStatusChange(task.status === 'Completed' ? 'Pending' : 'Completed')}
                    className={`flex-shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${task.status === 'Completed'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-dark-300 dark:border-dark-600 hover:border-primary-500'
                        }`}
                >
                    {task.status === 'Completed' && <CheckCircle2 className="w-4 h-4" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-dark-900 dark:text-dark-100 ${task.status === 'Completed' ? 'line-through text-dark-500' : ''
                                }`}>
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className="mt-1 text-sm text-dark-500 dark:text-dark-400">
                                    {truncate(task.description, 100)}
                                </p>
                            )}
                        </div>

                        {/* Menu button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 rounded-lg text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown menu */}
                            {showMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-dark-100 dark:border-dark-700 z-20 py-1 animate-slide-down">
                                        <button
                                            onClick={() => { onEdit(task); setShowMenu(false); }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700"
                                        >
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-4 h-4" /> {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Meta info */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {/* Status badge */}
                        <span className={getStatusClass(task.status)}>
                            {task.status}
                        </span>

                        {/* Priority badge */}
                        <span className={getPriorityClass(task.priority)}>
                            {task.priority}
                        </span>

                        {/* Category */}
                        {task.category && (
                            <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
                                {task.category}
                            </span>
                        )}

                        {/* Due date */}
                        {task.dueDate && (
                            <span className={`flex items-center gap-1 text-xs ${isTaskOverdue
                                    ? 'text-red-600 dark:text-red-400'
                                    : isTaskDueSoon
                                        ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-dark-500 dark:text-dark-400'
                                }`}>
                                {isTaskOverdue ? (
                                    <AlertCircle className="w-3.5 h-3.5" />
                                ) : (
                                    <Calendar className="w-3.5 h-3.5" />
                                )}
                                {formatDate(task.dueDate)}
                                {isTaskOverdue && ' (Overdue)'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
