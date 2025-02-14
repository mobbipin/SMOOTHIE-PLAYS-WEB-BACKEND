import { Router } from "express";
import {
  authCallback,
  emailLogin,
  emailSignup,
} from "../controller/auth.controller.js";

const router = Router();

// Google authentication endpoint (for  web)
router.post("/callback", authCallback);

// Email/Password signup and login endpoints (for both mobile and web)
router.post("/signup", emailSignup);
router.post("/login", emailLogin);

export default router;
