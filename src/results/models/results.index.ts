import mongoose from "mongoose"

export const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    name: {
        type: String,
        required: true
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
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University",
        required: true
    },
}, {
    timestamps: true
})