import * as mongoose from "mongoose"

export const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    file: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})