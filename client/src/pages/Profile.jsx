import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Calendar, Save, Eye, EyeOff } from 'lucide-react';
import { formatDate, getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'

    const validateProfileForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSecurityForm = () => {
        const newErrors = {};
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!validateProfileForm()) return;

        setLoading(true);
        const result = await updateProfile({ name: formData.name });
        setLoading(false);

        if (result.success) {
            toast.success('Profile updated successfully');
        }
    };

    const handleSecuritySubmit = async (e) => {
        e.preventDefault();
        if (!validateSecurityForm()) return;

        setLoading(true);
        const result = await updateProfile({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
        });
        setLoading(false);

        if (result.success) {
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-dark-900 dark:text-dark-100">
                    Profile Settings
                </h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Card */}
            <div className="card p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-dark-100 dark:border-dark-800">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary-500/30">
                        {getInitials(user?.name)}
                    </div>

                    <div className="text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-100">
                            {user?.name}
                        </h2>
                        <p className="text-dark-500 dark:text-dark-400 flex items-center justify-center sm:justify-start gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {user?.email}
                        </p>
                        <p className="text-sm text-dark-400 dark:text-dark-500 flex items-center justify-center sm:justify-start gap-2 mt-2">
                            <Calendar className="w-4 h-4" />
                            Member since {formatDate(user?.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-6 p-1 bg-dark-100 dark:bg-dark-800 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'profile'
                                ? 'bg-white dark:bg-dark-700 text-primary-600 shadow'
                                : 'text-dark-500 hover:text-dark-700'
                            }`}
                    >
                        <User className="w-4 h-4 inline-block mr-2" />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'security'
                                ? 'bg-white dark:bg-dark-700 text-primary-600 shadow'
                                : 'text-dark-500 hover:text-dark-700'
                            }`}
                    >
                        <Lock className="w-4 h-4 inline-block mr-2" />
                        Security
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="label">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="input pl-10 bg-dark-50 dark:bg-dark-800 cursor-not-allowed"
                                    />
                                </div>
                                <p className="mt-1.5 text-xs text-dark-400">
                                    Email cannot be changed
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                    <form onSubmit={handleSecuritySubmit} className="mt-6 space-y-5">
                        <div>
                            <label className="label">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    className={`input pl-10 pr-10 ${errors.currentPassword ? 'input-error' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                                >
                                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="mt-1.5 text-sm text-red-500">{errors.currentPassword}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="label">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        className={`input pl-10 pr-10 ${errors.newPassword ? 'input-error' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                                    >
                                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="mt-1.5 text-sm text-red-500">{errors.newPassword}</p>
                                )}
                            </div>

                            <div>
                                <label className="label">Confirm New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1.5 text-sm text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Update Password
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Profile;
