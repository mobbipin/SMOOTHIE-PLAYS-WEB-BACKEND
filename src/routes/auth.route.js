import { Router } from 'express';
import { authCallback, login, signup } from '../controller/auth.controller.js';

const router = Router();

router.post('/callback', authCallback);
router.post('/signup', signup);
router.post('/login', login);

export default router;