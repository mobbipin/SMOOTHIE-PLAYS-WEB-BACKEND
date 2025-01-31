import express from 'express';
import { login, signup } from '../controller/auth.controller.js';
import upload from '../middleware/multer.middleware.js';

const router = express.Router();

router.post('/signup', upload.single('photo'), signup); 
router.post('/login', login);

export default router;