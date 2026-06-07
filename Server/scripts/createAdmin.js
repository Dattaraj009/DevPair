import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import AdminModel from "../src/models/Admin.model.js";
import connectDB from "../src/config/db.js";


dotenv.config();
await connectDB();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME;

const createAdmin = async ()=>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

await AdminModel.create({
    name,
    email,
    password: hashedPassword,
});

console.log("Admin Created Successfully")
process.exit();

};

createAdmin();
