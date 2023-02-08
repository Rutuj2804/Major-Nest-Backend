import * as mongoose from "mongoose"

export const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true
    },
    file: {
        type: String,
        required: true
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
}, {
    timestamps: true
})