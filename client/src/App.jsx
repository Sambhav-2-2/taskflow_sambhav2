import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 transition-colors duration-300">
                        <Routes>
                            {/* Public routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected routes */}
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Layout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<Navigate to="/dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="tasks" element={<Tasks />} />
                                <Route path="profile" element={<Profile />} />
                            </Route>

                            {/* Catch all - redirect to dashboard */}
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>

                        {/* Toast notifications */}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#1e293b',
                                    color: '#f1f5f9',
                                    borderRadius: '12px',
                                    padding: '16px',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#22c55e',
                                        secondary: '#f1f5f9',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#f1f5f9',
                                    },
                                },
                            }}
                        />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
