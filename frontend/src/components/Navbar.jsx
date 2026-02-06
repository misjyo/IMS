import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token) return null;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Inventory', path: '/inventory', icon: <Package size={18} /> },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center space-x-10">
                <span className="text-2xl font-black text-blue-600 tracking-tighter">IMS PRO</span>
                
                <div className="flex space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center space-x-2 font-medium transition ${
                                location.pathname === link.path ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
                            }`}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full space-x-2">
                    <User size={16} className="text-gray-500" />
                    <span className="text-xs font-bold text-gray-700 uppercase">{role}</span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 transition p-2"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;