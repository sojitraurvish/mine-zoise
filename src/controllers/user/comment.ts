import { Request, Response } from "express";
import { ErrorResponse } from "../../util/index";
import { asyncHandler } from "../../middleware/index";
import { send_Email } from "../../middleware/index";
import { Feed, LikeDislike, Comment } from "../../model/index";
import mongoose from "mongoose";

const ObjectId: any = mongoose.Types.ObjectId;

// @desc     Add Comment
// @route    POST /api/v1/comment/
// @access   public
export const addComment = asyncHandler(async (req: any, res: Response, next: any) => {

    req.body.createdBy = req.user.id;

    // check video exits or not 
    const feed = await Feed.findById(req.body.feedId);

    if (!feed) {
        return next(new ErrorResponse(`Feed id not exists`, 400));
    }

    if (!feed.isActive) {
        return next(new ErrorResponse(`Feed not Found exists`, 400));
    }

    if (feed.isBlock) {
        return next(new ErrorResponse(`Feed is block`, 400));
    }

    // Check comment is allowed or not
    if (!feed.setting.comment) {
        return next(new ErrorResponse(`Comment not Allow on this video`, 400));
    }

    let comment = await Comment.create(req.body);

    if (!comment) {
        return next(new ErrorResponse("Comment not Added successfully", 404));
    }

    res.status(201).json({ success: true, data: comment });
})

// @desc     Add Comment
// @route    POST /api/v1/comment/
// @access   public
export const commentByVideo = asyncHandler(async (req: any, res: Response, next: any) => {


    let comment = await Comment.find().populate({
        path: "replayBy",
        select: "",
        populate: {
            path: "createdBy",
            select: ""
        }
    });

    // let comment = await Comment.find({ replayBy: { $ne: [] } });


    // let comment = await Comment.aggregate([
    //     { $match: { feedId: ObjectId(req.params.videoId), isActive: true } },
    //     {
    //         $lookup: {
    //             from: "comments",
    //             // localField: "replayBy",
    //             // foreignField: "_id",
    //             let: { var: "$replayBy" },
    //             pipeline: [
    //                 {
    //                     $match:
    //                     {
    //                         $expr: {
    //                             $and: [
    //                                 { $in: ["$_id", "$$var"] },

    //                             ]
    //                         }
    //                     }
    //                 },
    //                 {
    //                     $project: { _id: 0 }
    //                 }
    //             ],
    //             as: "newdata"
    //         },
    //     },
    //     // { $project: { _id: 1, replayBy: 1 } },
    //     {
    //         $unwind: {
    //             "path": "$replayBy",
    //             "preserveNullAndEmptyArrays": true
    //         }
    //     }
    //    ]);

    // console.log(comment[0].replayBy);

    if (!comment) {
        return next(new ErrorResponse("Comment not Found", 404));
    }

    res.status(201).json({ success: true, data: comment });
})

// @desc     Add Comment
// @route    POST /api/v1/comment/
// @access   public
export const commentReplay = asyncHandler(async (req: any, res: Response, next: any) => {

    req.body.createdBy = req.user.id;



    // Check video exits or not 
    const isCommentExits = await Comment.findById(req.body.commentId);

    if (!isCommentExits) {
        return next(new ErrorResponse(`Comment id not exists`, 400));
    }

    // check video exits or not 
    const feed = await Feed.findById(isCommentExits.feedId);

    if (!feed) {
        return next(new ErrorResponse(`Feed id not exists`, 400));
    }

    // Check comment is allowed or not
    if (!feed.setting.comment) {
        return next(new ErrorResponse(`Comment not Allow on this video`, 400));
    }


    req.body.feedId = isCommentExits.feedId;
    req.body.createdBy = isCommentExits.feedId;
    // console.log(isCommentExits);

    let replay = await Comment.create(req.body);

    if (!replay) {
        return next(new ErrorResponse("Replay not Added successfully", 404));
    }


    // Set replay id
    // let new_replay = await Comment.findByIdAndUpdate(req.body.commentId, { $push: { replayBy: replay.id } }, {
    let new_replay = await Comment.findByIdAndUpdate(req.body.commentId, { $addToSet: { replayBy: replay.id } }, {
        new: true,
        runValidators: true
    });

    res.status(201).json({ success: true, data: new_replay });
})