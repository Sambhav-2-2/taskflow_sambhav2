import { useState, useEffect, useCallback } from 'react';
import { Plus, ListFilter, Grid3X3, List } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskFilters from '../components/TaskFilters';
import LoadingSpinner from '../components/LoadingSpinner';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        category: ''
    });

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const params = {};
            if (filters.search) params.search = filters.search;
            if (filters.status) params.status = filters.status;
            if (filters.priority) params.priority = filters.priority;
            if (filters.category) params.category = filters.category;

            const response = await taskService.getTasks(params);
            setTasks(response.tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchTasks();
        }, filters.search ? 300 : 0);

        return () => clearTimeout(debounceTimer);
    }, [fetchTasks, filters.search]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            status: '',
            priority: '',
            category: ''
        });
    };

    const handleCreateTask = async (taskData) => {
        try {
            setSubmitting(true);
            await taskService.createTask(taskData);
            toast.success('Task created successfully!');
            setShowModal(false);
            fetchTasks();
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            setSubmitting(true);
            await taskService.updateTask(editingTask.id, taskData);
            toast.success('Task updated successfully!');
            setShowModal(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Failed to update task');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            toast.success('Task deleted successfully!');
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.updateTask(taskId, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error('Failed to update task');
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingTask(null);
    };

    // Group tasks by status for kanban-like view
    const groupedTasks = {
        'Pending': tasks.filter(t => t.status === 'Pending'),
        'In Progress': tasks.filter(t => t.status === 'In Progress'),
        'Completed': tasks.filter(t => t.status === 'Completed')
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 dark:text-dark-100">
                        Tasks
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">
                        Manage and organize all your tasks
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* View toggle */}
                    <div className="flex items-center bg-dark-100 dark:bg-dark-800 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                                    ? 'bg-white dark:bg-dark-700 shadow text-primary-600'
                                    : 'text-dark-500 hover:text-dark-700'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                                    ? 'bg-white dark:bg-dark-700 shadow text-primary-600'
                                    : 'text-dark-500 hover:text-dark-700'
                                }`}
                        >
                            <Grid3X3 className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <Plus className="w-5 h-5" />
                        Add Task
                    </button>
                </div>
            </div>

            {/* Filters */}
            <TaskFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
            />

            {/* Tasks count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-dark-500 dark:text-dark-400">
                    {loading ? 'Loading...' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} found`}
                </p>
            </div>

            {/* Tasks */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center mb-4">
                        <ListFilter className="w-8 h-8 text-dark-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-2">
                        No tasks found
                    </h3>
                    <p className="text-dark-500 dark:text-dark-400 mb-4">
                        {filters.search || filters.status || filters.priority || filters.category
                            ? 'Try adjusting your filters'
                            : 'Create your first task to get started'}
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary"
                    >
                        <Plus className="w-5 h-5" />
                        Add Task
                    </button>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid/Kanban View */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                        <div key={status} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-dark-900 dark:text-dark-100 flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${status === 'Pending' ? 'bg-slate-400' :
                                            status === 'In Progress' ? 'bg-blue-500' : 'bg-green-500'
                                        }`} />
                                    {status}
                                </h3>
                                <span className="text-sm text-dark-500 dark:text-dark-400">
                                    {statusTasks.length}
                                </span>
                            </div>

                            <div className="space-y-3 min-h-[200px] p-3 rounded-xl bg-dark-50 dark:bg-dark-900/50">
                                {statusTasks.length === 0 ? (
                                    <p className="text-center text-sm text-dark-400 py-8">
                                        No {status.toLowerCase()} tasks
                                    </p>
                                ) : (
                                    statusTasks.map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onEdit={handleEdit}
                                            onDelete={handleDeleteTask}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="space-y-4">
                    {tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEdit}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            {/* Task Modal */}
            <TaskModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                task={editingTask}
                isLoading={submitting}
            />
        </div>
    );
};

export default Tasks;
