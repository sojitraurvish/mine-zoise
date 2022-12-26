import mongoose from "mongoose";

const FeedSchema = new mongoose.Schema({
    type: { type: Number, enum: [0, 1] }, // 0 = Video=0,1,2 || 1 = Feed=0,1
    description: { type: String, required: true },
    feedUrl: { type: String, required: true, unique: true },
    thumbnail: { type: String },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    suburb: { type: String, default: null },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    setting: {
        comment: { type: Boolean, default: true },
        duet: { type: Boolean, default: true },
        stich: { type: Boolean, default: false },
    },
    listOfViewedUser: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], default: [] },
    totalView: { type: Number, default: 0 },
    totalLike: { type: Number, default: 0 },
    totalDislike: { type: Number, default: 0 },
    totalComment: { type: Number, default: 0 },
    totalShare: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false },
    // tag: { type: [{ type: String }], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    // categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
}, { timestamps: true });

export const Feed = mongoose.model("Feed", FeedSchema);

