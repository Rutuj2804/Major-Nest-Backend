import * as mongoose from "mongoose"

export const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    }
}, {
    timestamps: true
})