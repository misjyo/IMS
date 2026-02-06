import express from 'express';
const router = express.Router();

import { getMovements } from '../controllers/movementController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route: GET /api/movements
router.get('/', protect, getMovements);

export default router;