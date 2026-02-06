import React, { useState, useEffect } from 'react';
import { useGetProductsQuery, useDeleteProductMutation } from '../store/apiSlice';
import ProductList from '../components/ProductList';
import StockModal from '../components/StockModal';
import AddProductModal from '../components/AddProductModal';
import { Search, Plus, Loader2, RefreshCw } from 'lucide-react';

const Inventory = () => {
    // 1. States
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    // 2. Role Logic
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'admin';

    // Debugging Logs
    // console.log("Current Role from LocalStorage:", userRole);
    // console.log("Boolean isAdmin Check:", isAdmin);

    // 3. API calls
    const { data, isLoading, isFetching, isError, refetch } = useGetProductsQuery({ page, search });
    const [deleteProduct] = useDeleteProductMutation();

    // 4. Delete Handler
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id).unwrap();
                console.log("Product deleted successfully");
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete product");
            }
        }
    };

    const handleEditClick = (product) => {
        setProductToEdit(product); 
        setIsAddModalOpen(true); 
    };

    // Error UI
    if (isError) return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p className="text-red-500 font-bold mb-4">Error loading data. Is the backend running?</p>
            <button onClick={() => refetch()} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
                <RefreshCw size={18} className="mr-2" /> Retry
            </button>
        </div>
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Logged in as: <span className="font-semibold text-blue-600 uppercase">{userRole}</span>
                        </p>
                    </div>

                    {/* ONLY ADMIN: Add Button */}
                    {isAdmin && (
                        <button
                            onClick={() => { setProductToEdit(null); setIsAddModalOpen(true); }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow"
                        >
                            <Plus size={20} className="mr-2" /> Add New Product
                        </button>
                    )}
                </div>

                {/* Search Bar Section */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex items-center">
                    <Search className="text-gray-400 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Product Name or SKU..."
                        className="w-full outline-none text-gray-700"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                    {(isFetching || isLoading) && <Loader2 className="animate-spin text-blue-500" />}
                </div>

                {/* Main Product Table */}
                <ProductList
                    products={data?.products || []}
                    isLoading={isLoading}
                    isAdmin={isAdmin} 
                    onAdjustStock={(p) => setSelectedProduct(p)}
                    onDelete={handleDelete}
                    onEdit={handleEditClick}
                />

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg border border-gray-200">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(prev => prev - 1)}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 flex items-center"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        Page {page} of {data?.totalPages || 1}
                    </span>
                    <button
                        disabled={page >= (data?.totalPages || 1)}
                        onClick={() => setPage(prev => prev + 1)}
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 flex items-center"
                    >
                        Next
                    </button>
                </div>

                {/* Modals */}
                {isAddModalOpen && (
                    <AddProductModal
                        key={productToEdit ? `edit-${productToEdit._id}` : 'add-new'}
                        onClose={() => {
                            setIsAddModalOpen(false);
                            setProductToEdit(null);
                        }}
                        editData={productToEdit}
                    />
                )}

                {selectedProduct && (
                    <StockModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                    />
                )}

            </div>
        </div>
    );
};

export default Inventory;