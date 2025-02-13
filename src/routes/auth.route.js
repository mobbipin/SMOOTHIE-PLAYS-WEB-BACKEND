
import { Router } from "express";
import {
    emailLogin,
    emailSignup,
    googleAuthCallback,
} from "../controller/auth.controller.js";

const router = Router();

// Google authentication endpoint (for both mobile and web)
router.post("/google/callback", googleAuthCallback);

// Email/Password signup and login endpoints (for both mobile and web)
router.post("/signup", emailSignup);
router.post("/login", emailLogin);

export default router;
