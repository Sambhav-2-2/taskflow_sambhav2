import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            navigate(from, { replace: true });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">TaskFlow</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Organize your tasks,<br />
                        <span className="text-white/80">simplify your life.</span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-md">
                        The modern task management system that helps you stay productive and achieve your goals effortlessly.
                    </p>

                    <div className="flex items-center gap-6 pt-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">10k+</p>
                            <p className="text-white/60 text-sm">Active Users</p>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">50k+</p>
                            <p className="text-white/60 text-sm">Tasks Completed</p>
                        </div>
                        <div className="w-px h-12 bg-white/20" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">99%</p>
                            <p className="text-white/60 text-sm">Satisfaction</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-white/50 text-sm">© 2024 TaskFlow. All rights reserved.</p>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-dark-50 dark:bg-dark-950">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">TaskFlow</span>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-dark-900 dark:text-dark-100">Welcome back</h2>
                        <p className="text-dark-500 dark:text-dark-400 mt-2">
                            Sign in to continue managing your tasks
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="label">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-dark-500 dark:text-dark-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
