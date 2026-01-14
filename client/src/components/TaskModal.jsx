import { useState, useEffect } from 'react';
import { X, Calendar, Tag, Flag, Clock } from 'lucide-react';
import { formatDateForInput, defaultCategories, priorityOptions, statusOptions } from '../utils/helpers';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, isLoading = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                category: task.category || '',
                priority: task.priority || 'Medium',
                status: task.status || 'Pending',
                dueDate: formatDateForInput(task.dueDate) || ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: '',
                priority: 'Medium',
                status: 'Pending',
                dueDate: ''
            });
        }
        setErrors({});
    }, [task, isOpen]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length > 200) {
            newErrors.title = 'Title must be less than 200 characters';
        }
        if (formData.description && formData.description.length > 1000) {
            newErrors.description = 'Description must be less than 1000 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }

        const submitData = {
            ...formData,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
        };

        onSubmit(submitData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-dark-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative w-full max-w-lg bg-white dark:bg-dark-900 rounded-2xl shadow-2xl animate-scale-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-dark-100 dark:border-dark-800">
                        <h2 className="text-xl font-semibold text-dark-900 dark:text-dark-100">
                            {task ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter task title"
                                className={`input ${errors.title ? 'input-error' : ''}`}
                                autoFocus
                            />
                            {errors.title && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="label">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter task description"
                                rows={3}
                                className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                            />
                            {errors.description && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Category & Priority */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Select category</option>
                                    {defaultCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label flex items-center gap-2">
                                    <Flag className="w-4 h-4" /> Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    {priorityOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Status & Due Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Due Date
                                </label>
                                <input
                                    type="datetime-local"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="input"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {task ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    task ? 'Update Task' : 'Create Task'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
