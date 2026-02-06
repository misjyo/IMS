import React, { useState, useEffect } from 'react';
import { useCreateProductMutation, useUpdateProductMutation } from '../store/apiSlice';
import { X } from 'lucide-react';

const AddProductModal = ({ onClose, editData }) => {
    const [formData, setFormData] = useState({
        name: '', sku: '', category: '', price: '', quantity: '', lowStockThreshold: 5
    });
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    useEffect(() => {
        if (editData) {
            // console.log("Edit Data Found:", editData); 
            setFormData({
                name: editData.name || '',
                sku: editData.sku || '',
                category: editData.category || '',
                price: editData.price || 0,
                quantity: editData.quantity || '',
                lowStockThreshold: editData.lowStockThreshold || 5
            });
        } else {
            // Reset form for new product
            setFormData({ name: '', sku: '', category: '', price: '', quantity: '', lowStockThreshold: 5 });
        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                // Update Logic
                await updateProduct({ id: editData._id, ...formData }).unwrap();
            } else {
                // Create Logic
                await createProduct(formData).unwrap();
            }
            onClose();
        } catch (err) {
            alert("Error saving product: " + err.data?.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">{editData ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Product Name" className="w-full border p-2 rounded"  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <input type="text" placeholder="SKU (Unique)" className="w-full border p-2 rounded" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
                    <input type="text" placeholder="Category" className="w-full border p-2 rounded"  value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Price" className="border p-2 rounded"  value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                        <input type="number" placeholder="Initial Qty" className="border p-2 rounded"  value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required 
                                disabled={!!editData} />
                    </div>
                  <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                        <button type="submit" disabled={isCreating || isUpdating} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md">
                            {isCreating || isUpdating ? 'Saving...' : (editData ? 'Update Product' : 'Save Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;