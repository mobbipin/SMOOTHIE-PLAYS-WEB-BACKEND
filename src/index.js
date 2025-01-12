import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./lib/db.js";
import adminRoutes from "./routes/admin.route.js";
import albumRoutes from "./routes/album.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import statsRoutes from "./routes/stats.route.js";
import usersRoutes from "./routes/user.route.js";

dotenv.config();

const app =  express();
const PORT = process.env.PORT;

app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/auth", authRoutes);
app.use("/api/song", songRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/stats", statsRoutes);



app.listen(PORT, () => {
    console.log("SERVER IS RUNNINGs ON PORT" + PORT);
    connectDB();
})