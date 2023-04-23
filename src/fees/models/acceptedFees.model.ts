import * as mongoose from "mongoose"

export const acceptedFeeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },
    fee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fee"
    },
}, {
    timestamps: true
})