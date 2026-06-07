import mongoose from "mongoose";



const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        default: 'admin'
    },
},
    {
        timestamps: true
    }
)


export default mongoose.model("Admin", adminSchema);