import { Router } from "express";


const router = Router();

router.get("/", (req, res)=>{
    res.send("AUTH USING GET");
})



export default router;