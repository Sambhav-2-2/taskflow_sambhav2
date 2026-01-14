import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle2, Check } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const passwordRequirements = [
        { met: formData.password.length >= 6, text: 'At least 6 characters' },
        { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
        { met: /[0-9]/.test(formData.password), text: 'One number' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const result = await register(formData.name, formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard', { replace: true });
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
            {/* Left side - Form */}
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
                        <h2 className="text-3xl font-bold text-dark-900 dark:text-dark-100">Create account</h2>
                        <p className="text-dark-500 dark:text-dark-400 mt-2">
                            Start organizing your tasks today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="label">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                                    autoComplete="name"
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

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
                                    placeholder="Create a password"
                                    className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                                    autoComplete="new-password"
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

                            {/* Password requirements */}
                            {formData.password && (
                                <div className="mt-2 space-y-1">
                                    {passwordRequirements.map((req, i) => (
                                        <div key={i} className={`flex items-center gap-2 text-xs ${req.met ? 'text-green-600' : 'text-dark-400'}`}>
                                            <Check className={`w-3.5 h-3.5 ${req.met ? 'text-green-600' : 'text-dark-300'}`} />
                                            {req.text}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="label">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>
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
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-dark-500 dark:text-dark-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right side - Brand */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-primary-600 to-blue-600 p-12 flex-col justify-between relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex justify-end">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">TaskFlow</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                        Start your journey<br />
                        <span className="text-white/80">to productivity.</span>
                    </h1>
                    <p className="text-lg text-white/70 max-w-md">
                        Join thousands of users who have transformed their workflow with TaskFlow's intuitive task management.
                    </p>

                    <div className="space-y-4 pt-4">
                        {[
                            'Unlimited tasks and projects',
                            'Priority and category management',
                            'Due date tracking and reminders',
                            'Beautiful dashboard analytics'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-white">
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                    <Check className="w-4 h-4" />
                                </div>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-white/50 text-sm">© 2024 TaskFlow. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
