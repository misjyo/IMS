import express from 'express';
const router = express.Router();

import { getProducts, adjustStock, getDashboardStats, createProduct,deleteProduct,updateProduct } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

router.get('/stats', protect, getDashboardStats);
router.get('/', protect, getProducts); // Viewer & Admin both
router.post('/', protect, adminOnly, createProduct); // Admin only
router.put('/:id', protect, adminOnly, updateProduct); // Admin only
router.delete('/:id', protect, adminOnly, deleteProduct); // Admin only
router.post('/stock', protect, adminOnly, adjustStock); // Admin only

export default router;