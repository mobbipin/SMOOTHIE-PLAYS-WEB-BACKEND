import { Router } from "express";

const router = Router();

router.get("/", (req,res) =>{
    res.send("ROUTE FOR ADMIN")
})

export default router; 