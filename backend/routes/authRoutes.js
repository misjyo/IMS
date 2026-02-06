import express from 'express';
const router = express.Router();

import { loginUser } from '../controllers/authController.js';

// POST /api/auth/login
router.post('/login', loginUser);

export default router;