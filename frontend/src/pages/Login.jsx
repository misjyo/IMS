import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('https://ims-ol63.onrender.com/api/auth/login', {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role); // 'admin' or 'viewer'
            localStorage.setItem('userName', response.data.name);

            // Redirect to Dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <ShieldCheck size={40} />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">IMS Portal</h2>
                    <p className="text-center text-gray-500 mb-8 text-sm italic">Inventory Management System</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="admin@ims.com or viewer@ims.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center transition disabled:bg-blue-400"
                        >
                            {loading ? 'Authenticating...' : (
                                <><LogIn size={18} className="mr-2" /> Login</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Demo Access</p>
                    <div className="flex justify-around text-[10px] text-gray-500 mt-2">
                        <span>Admin: admin123</span>
                        <span>Viewer: viewer123</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;