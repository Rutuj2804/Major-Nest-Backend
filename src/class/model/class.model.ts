import * as mongoose from "mongoose"

export const classSchema = new mongoose.Schema({
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Universities",
        required: true
    },
    faculty: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Auth"
    },
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Auth"
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})