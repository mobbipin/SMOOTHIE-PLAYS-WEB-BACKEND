import { Router } from "express";

const router = Router();
router.get("/", (req,res)=> {
    res.send("AT SONG");
})

export default router;

