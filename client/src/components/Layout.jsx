import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard,
    ListTodo,
    User,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    CheckCircle2
} from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/tasks', icon: ListTodo, label: 'Tasks' },
        { path: '/profile', icon: User, label: 'Profile' }
    ];

    const NavItem = ({ path, icon: Icon, label }) => (
        <NavLink
            to={path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                }`
            }
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </NavLink>
    );

    return (
        <div className="min-h-screen flex bg-dark-50 dark:bg-dark-950">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-dark-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-6 py-6 border-b border-dark-100 dark:border-dark-800">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">TaskFlow</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navItems.map((item) => (
                            <NavItem key={item.path} {...item} />
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="px-4 py-4 border-t border-dark-100 dark:border-dark-800">
                        <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-dark-50 dark:bg-dark-800">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-dark-900 dark:text-dark-100 truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-sm text-dark-500 dark:text-dark-400 truncate">
                                    {user?.email || ''}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="flex-1 btn-ghost justify-center rounded-xl"
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 btn-ghost justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-dark-100 dark:border-dark-800 px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden lg:block">
                            <h1 className="text-lg font-semibold text-dark-900 dark:text-dark-100">
                                Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="hidden lg:flex p-2 rounded-xl text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
