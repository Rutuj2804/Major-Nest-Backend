import * as mongoose from "mongoose"

export const subjectSchema = new mongoose.Schema({
    faculty: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Auth"
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})