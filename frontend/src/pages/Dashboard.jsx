import React from 'react';
import { useGetStatsQuery } from '../store/apiSlice';
import { Package, AlertTriangle, History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const Dashboard = () => {
    const { data: stats, isLoading } = useGetStatsQuery();

    if (isLoading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

                {/* 1. Stats Cards (Total & Low Stock) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                            <Package size={30} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Products</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stats?.totalProducts || 0}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className="bg-red-100 p-3 rounded-lg text-red-600">
                            <AlertTriangle size={30} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Low Stock Products</p>
                            <h3 className="text-3xl font-bold text-gray-800">{stats?.lowStockCount || 0}</h3>
                        </div>
                    </div>
                </div>

                {/* 2. Recent Stock Movements Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center space-x-2">
                        <History className="text-gray-400" size={20} />
                        <h2 className="font-bold text-gray-700">Recent Stock Movements</h2>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Product</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold">Current Stock</th>
                                    <th className="px-6 py-3 font-semibold">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.recentMovements?.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center text-xs font-bold ${item.quantity > (item.lowStockThreshold || 10) ? 'text-green-600' : 'text-red-500'}`}>
                                                {item.quantity > (item.lowStockThreshold || 10) ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownLeft size={14} className="mr-1" />}
                                                {item.quantity > (item.lowStockThreshold || 10) ? 'Healthy' : 'Low Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{item.quantity} units</td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {new Date(item.updatedAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(!stats?.recentMovements || stats.recentMovements.length === 0) && (
                            <div className="p-10 text-center text-gray-400 italic">No recent movements found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;