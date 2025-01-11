import { Router } from "express";
const router = Router();
router.get("/", (req, res) => {
    res.send("USER SEND USING GET")
})
export default router;