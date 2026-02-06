import React from 'react';
import { Edit, Trash, ArrowUpDown } from 'lucide-react';

const ProductList = ({ products, isLoading, onAdjustStock, onDelete, onEdit, isAdmin }) => {

    // console.log("ProductList received isAdmin:", isAdmin);

    if (isLoading) return <div className="text-center py-20">Loading Inventory...</div>;

    return (
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="p-4 font-semibold">Product Details</th>
                        <th className="p-4 font-semibold">Category</th>
                        <th className="p-4 font-semibold">Stock</th>
                        <th className="p-4 font-semibold">Price</th>
                        {/* 1. Header Check: only Admin  */}
                        {isAdmin === true && (
                            <th className="p-4 font-semibold text-right">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products && products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50 transition">
                            <td className="p-4">
                                <div className="font-semibold text-gray-800">{product.name}</div>
                                <div className="text-xs text-gray-400">{product.sku}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{product.category}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.quantity <= product.lowStockThreshold
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-green-100 text-green-600'
                                    }`}>
                                    {product.quantity} units
                                </span>
                            </td>
                            <td className="p-4 text-sm font-medium text-gray-700">
                                ${product.price !== undefined ? product.price : '0'}
                            </td>

                            {/* 2. Body Cell Check: Buttons logic*/}
                            {isAdmin === true && (
                                <td className="p-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        {/* Adjust Stock Button */}
                                        <button
                                            onClick={() => onAdjustStock(product)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                            title="Adjust Stock"
                                        >
                                            <ArrowUpDown size={18} />
                                        </button>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Edit size={18} />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => onDelete(product._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash size={18} />
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {products.length === 0 && (
                <div className="p-10 text-center text-gray-400 italic">No products available.</div>
            )}
        </div>
    );
};

export default ProductList;