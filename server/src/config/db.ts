import mongoose from "mongoose";
import {config} from "dotenv"
config({
    path: ".env"
})

console.log('process.env.DATABASE_URL',process.env.DATABASE_URL);
export const connectMongoDB=async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL as string);
        console.log('MongoDB connected');
    } catch (error) {
        console.log('connection error in mongodb: ', error);
        // process.exit(1);
    }
}