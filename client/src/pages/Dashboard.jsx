import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';
import DashboardStats from '../components/DashboardStats';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentTasks, setRecentTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, tasksRes] = await Promise.all([
                taskService.getStats(),
                taskService.getTasks({ sortBy: 'createdAt', sortOrder: 'DESC' })
            ]);
            setStats(statsRes.stats);
            setRecentTasks(tasksRes.tasks.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTask = async (taskData) => {
        try {
            setSubmitting(true);
            await taskService.createTask(taskData);
            toast.success('Task created successfully!');
            setShowModal(false);
            fetchData();
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
            fetchData();
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
            fetchData();
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.updateTask(taskId, { status: newStatus });
            toast.success(`Task marked as ${newStatus}`);
            fetchData();
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

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 dark:text-dark-100">
                        Dashboard
                    </h1>
                    <p className="text-dark-500 dark:text-dark-400 mt-1">
                        Track your tasks and stay productive
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                >
                    <Plus className="w-5 h-5" />
                    Add Task
                </button>
            </div>

            {/* Stats */}
            <DashboardStats stats={stats} loading={loading} />

            {/* Quick Actions */}
            <div className="card p-6 bg-gradient-to-r from-primary-500 to-purple-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Sparkles className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Boost Your Productivity</h3>
                            <p className="text-white/80 text-sm">Create a new task and stay on track</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn bg-white text-primary-600 hover:bg-white/90 shadow-lg"
                    >
                        Create Task
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Recent Tasks */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-dark-900 dark:text-dark-100">
                        Recent Tasks
                    </h2>
                    <Link
                        to="/tasks"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
                    >
                        View all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 rounded-2xl skeleton" />
                        ))}
                    </div>
                ) : recentTasks.length === 0 ? (
                    <div className="card p-12 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-dark-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-2">
                            No tasks yet
                        </h3>
                        <p className="text-dark-500 dark:text-dark-400 mb-4">
                            Create your first task to get started
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary"
                        >
                            <Plus className="w-5 h-5" />
                            Add Task
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentTasks.map(task => (
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
            </div>

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

export default Dashboard;
