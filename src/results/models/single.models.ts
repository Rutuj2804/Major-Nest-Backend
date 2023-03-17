import mongoose from "mongoose"

export const studentResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    result: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Result",
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
})