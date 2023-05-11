import * as mongoose from "mongoose"

export const attendenceSchema = new mongoose.Schema({
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
    students: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Auth",
        required: true
    },
}, {
    timestamps: true
})