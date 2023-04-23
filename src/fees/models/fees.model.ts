import * as mongoose from "mongoose"

export const feeSchema = new mongoose.Schema({
    title: {
        type: String,
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
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class"
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})