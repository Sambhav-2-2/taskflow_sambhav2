import {
    ClipboardList,
    Clock,
    PlayCircle,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Calendar,
    Flag
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, gradient, subtext }) => (
    <div className={`stat-card ${gradient} text-white`}>
        <div className="relative z-10">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                    {subtext && (
                        <p className="text-white/70 text-xs mt-1">{subtext}</p>
                    )}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Icon className="w-7 h-7" />
                </div>
            </div>
        </div>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
    </div>
);

const DashboardStats = ({ stats, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-2xl skeleton" />
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Tasks',
            value: stats?.total || 0,
            icon: ClipboardList,
            gradient: 'bg-gradient-to-br from-primary-500 to-primary-700',
            subtext: `${stats?.completionRate || 0}% completed`
        },
        {
            title: 'Pending',
            value: stats?.pending || 0,
            icon: Clock,
            gradient: 'bg-gradient-to-br from-slate-500 to-slate-700',
            subtext: 'Awaiting action'
        },
        {
            title: 'In Progress',
            value: stats?.inProgress || 0,
            icon: PlayCircle,
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
            subtext: 'Currently working'
        },
        {
            title: 'Completed',
            value: stats?.completed || 0,
            icon: CheckCircle2,
            gradient: 'bg-gradient-to-br from-green-500 to-green-700',
            subtext: `${stats?.recentlyCompleted || 0} this week`
        }
    ];

    return (
        <div className="space-y-6">
            {/* Main stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {/* Overdue */}
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-dark-900 dark:text-dark-100">{stats?.overdue || 0}</p>
                        <p className="text-sm text-dark-500 dark:text-dark-400">Overdue Tasks</p>
                    </div>
                </div>

                {/* Due Soon */}
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-dark-900 dark:text-dark-100">{stats?.dueSoon || 0}</p>
                        <p className="text-sm text-dark-500 dark:text-dark-400">Due in 3 Days</p>
                    </div>
                </div>

                {/* High Priority */}
                <div className="card p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Flag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-dark-900 dark:text-dark-100">{stats?.highPriority || 0}</p>
                        <p className="text-sm text-dark-500 dark:text-dark-400">High Priority</p>
                    </div>
                </div>
            </div>

            {/* Categories breakdown */}
            {stats?.byCategory && Object.keys(stats.byCategory).length > 0 && (
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-4">
                        Tasks by Category
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {Object.entries(stats.byCategory).map(([category, count]) => (
                            <div
                                key={category}
                                className="flex items-center justify-between p-3 rounded-xl bg-dark-50 dark:bg-dark-800"
                            >
                                <span className="text-dark-700 dark:text-dark-300 font-medium">{category}</span>
                                <span className="px-2.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 text-sm font-semibold">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardStats;
