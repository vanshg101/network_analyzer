import mongoose from "mongoose"
import {DB_NAME}from "../constant.js"

const connectDB=async () =>{
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        )
        console.log(
             `\n Mongoose connected !! DB HOST:${connectionInstance.connection.host}DB NAME:${connectionInstance.connection.name}\n`
        )
    } catch (error) {
        console.error("Error connecting to MongoDB",error);
        process.exit(1);
    }
}
export default connectDB;

