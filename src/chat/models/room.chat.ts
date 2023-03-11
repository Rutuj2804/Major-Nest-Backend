import mongoose from "mongoose"

export const chatRoom = new mongoose.Schema({ 
    name: {
        type: String,
        required: false
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Auth",
        required: false
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: false
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Message"
    }
}, {
    timestamps: true
})