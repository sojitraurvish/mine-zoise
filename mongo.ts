const mongoose = require('mongoose')

console.log("11", process.env.AWS_BUCKET_NAME);

const videoSchema = new mongoose.Schema({
    resetPasswordOtp: String,
    longitude: { type: Number, default: 0, min: 0 },
    type: { type: Number, default: 0, enum: [0, 1,] },
    setting: {
        type: {
            comment: { type: Boolean, },
            duet: { type: Boolean, },
            stich: { type: Boolean, },
        },
        default: {
            comment: true, duet: true, stich: true
        }
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    listViewUser: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], default: [] },
    tag: { type: [{ type: String }], default: [] },
    isActive: { type: Boolean, default: true, },
}, { timestamps: true });