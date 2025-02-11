
import { Router } from "express";
import { mobileLogin, mobileSignup } from "../controller/mobileAuth.controller.js";

const router = Router();

router.post("/login", mobileLogin);
router.post("/signup", mobileSignup);

export default router;
