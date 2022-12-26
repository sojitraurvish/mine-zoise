import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    // isBlock: { type: Boolean, default: false },
    message: { type: String, default: null },
    feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feed', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likeBy: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] },
    totalLikes: { type: Number, default: 0, min: 0 },
    replayBy: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Comment = mongoose.model('Comment', commentSchema);