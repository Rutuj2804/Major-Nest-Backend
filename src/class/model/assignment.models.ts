import * as mongoose from "mongoose"

export const assignmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
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
    submission: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true
})