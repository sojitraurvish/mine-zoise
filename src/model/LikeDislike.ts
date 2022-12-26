import mongoose from 'mongoose';

const likeDislikeSchema = new mongoose.Schema({
    // isActive: { type: Boolean, default: true },
    // isBlock: { type: Boolean, default: false },
    likeDislike: { type: Number, enum: [0, 1] }, // 0 = dislike || 1 = like 
    feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feed', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const LikeDislike = mongoose.model('LikeDislike', likeDislikeSchema);