import mongoose from "mongoose"

export const messageRoom = new mongoose.Schema({ 
    text: {
        type: String,
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})