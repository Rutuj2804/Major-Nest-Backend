import * as mongoose from "mongoose"

export const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        ref: "Universities",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University"
    },
    files: {
        type: [String],
    },
    description: {
        type: String,
    }
}, {
    timestamps: true
})