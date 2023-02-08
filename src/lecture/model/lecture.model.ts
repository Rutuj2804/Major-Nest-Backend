import mongoose from "mongoose"

export const lectureSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    file: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        required: true
    },
    subjectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
}, {
    timestamps: true
})