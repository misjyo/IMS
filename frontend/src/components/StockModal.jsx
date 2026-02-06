import React, { useState } from 'react';
import { useAdjustStockMutation } from '../store/apiSlice';

const StockModal = ({ product, onClose }) => {
    const [type, setType] = useState('IN');
    const [quantity, setQuantity] = useState(1);
    const [adjustStock, { isLoading }] = useAdjustStockMutation();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Logic check
        if (type === 'OUT' && quantity > product.quantity) {
            setError('Cannot remove more than available stock!');
            return;
        }

        try {
            await adjustStock({
                productId: product._id,
                type,
                quantity: Number(quantity)
            }).unwrap();
            
            onClose(); 
        } catch (err) {
            setError(err.data?.message || 'Failed to update stock');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-in fade-in duration-300">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Adjust Stock: <span className="text-blue-600">{product.name}</span>
                </h3>
                
                {error && <p className="text-red-500 bg-red-50 p-2 rounded mb-4 text-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                        <select 
                            className="w-full border rounded-md p-2"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="IN">Restock (Stock IN)</option>
                            <option value="OUT">Sale/Damage (Stock OUT)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input 
                            type="number" 
                            min="1"
                            className="w-full border rounded-md p-2"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-md text-white transition ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isLoading ? 'Updating...' : 'Update Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockModal;