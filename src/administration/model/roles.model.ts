import * as mongoose from "mongoose"

export const rolesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Auth"
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "University"
    },
    roles: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true
    }
}, {
    timestamps: true
})

export const defineRolesSchema = new mongoose.Schema({
    university: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "University"
    },
    name: {
        type: String,
        required: true
    },
    students: {
        type: Number,
        default: 0
    },
    faculty: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})