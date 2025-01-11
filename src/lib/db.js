import mongoose  from "mongoose";

export const connectDB= async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log( `CONNECTED TO DB ${conn.connection.host} `);
        
    } catch (error) {
        console.log("Failed to connect to db ",error);
        process.exit(1);
        
    }
}