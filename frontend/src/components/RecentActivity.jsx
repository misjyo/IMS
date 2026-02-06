import React from 'react';
import { useGetMovementsQuery } from '../store/apiSlice';

const RecentActivity = () => {
    const { data: logs, isLoading } = useGetMovementsQuery();

    if (isLoading) return <p>Loading logs...</p>;

    return (
        <div className="bg-white p-6 shadow rounded-lg mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Stock Movements</h2>
            <div className="space-y-4">
                {logs?.map((log) => (
                    <div key={log._id} className="flex justify-between items-center border-b pb-2">
                        <div>
                            <p className="font-semibold text-gray-800">{log.productId?.name || 'Deleted Product'}</p>
                            <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                        </div>
                        <div className={`font-bold ${log.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                            {log.type === 'IN' ? '+' : '-'}{log.quantity}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};