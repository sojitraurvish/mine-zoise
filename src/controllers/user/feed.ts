import { Request, Response } from "express";
import { ErrorResponse } from "../../util/index";
import { asyncHandler } from "../../middleware/index";
import { send_Email } from "../../middleware/index";
import { Feed, LikeDislike } from "../../model/index";

// @desc     Add Video
// @route    POST /api/v1/video/
// @access   public
export const addFeed = asyncHandler(async (req: any, res: Response, next: any) => {
    // console.log("ht");

    req.body.createdBy = req.user._id;
    req.body.type = 1;//type: Feed
    // console.log(req.user._id);

    // Checking url for video feed
    let feedStr = req.body.feedUrl.split("/")[req.body.feedUrl.split("/").length - 1];
    let feedType = feedStr.split(".")[feedStr.split(".").length - 1];

    if (feedType !== "jpg" && feedType !== "jpeg" && feedType !== "png") {
        return next(new ErrorResponse(`Plase Give valid url for Feed.`, 403));
    }

    // console.log(feedType);

    let feed = await Feed.create(req.body);

    if (!feed) {
        return next(new ErrorResponse("video not Added successfully", 404));
    }

    res.status(201).json({ success: true, data: feed });
})

// @desc     getFeeds
// @route    GET /api/v1/video/
// @access   public
export const getFeeds = asyncHandler(async (req: any, res: Response, next: any) => {

    const count = await Feed.count();
    // Get a random entry
    var random = Math.floor(Math.random() * count);

    const user = await Feed.find({ isActive: true, isBlock: false, type: 1 }).limit(10).populate({
        path: "createdBy",
        select: "username"
    });

    if (!user) {
        return next(new ErrorResponse("Feed not found", 404));
    }

    res.status(200).json({
        success: true,
        data: user
    })
});

// @desc     Like video (add remove)
// @route    POST /api/v1/video/:feedId/like
// @access   private
export const likeDislikeFeed = asyncHandler(async (req: any, res: Response, next: any) => {

    req.body.likeDislike = req.body.likeDislikeFlag; // 0 = dislike || 1 = like 

    if (req.body.likeDislikeFlag !== 1) {
        return next(new ErrorResponse(`Please send valid data for likeDislikeFlag`, 403));
    }

    req.body.feedId = req.params.feedId;
    req.body.createdBy = req.user._id;

    // console.log(req.body.feedId);
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

    let like;

    like = await LikeDislike.findOne({ feedId: req.body.feedId, createdBy: req.body.createdBy });


    if (like) {

        if (req.body.likeDislike === 1) {
            if (like.likeDislike === 1) {
                await like.remove();
                return res.status(200).json({ success: true, data: {} });
            }
            if (like.likeDislike === 0) {
                like.likeDislike = 1;
                await like.save();
                return res.status(200).json({ success: true, data: like });
            }
        }

        // if (req.body.likeDislike === 0) {
        //     if (like.likeDislike === 0) {
        //         await like.remove();
        //         return res.status(200).json({ success: true, data: {} });
        //     }
        //     if (like.likeDislike === 1) {
        //         like.likeDislike = 0;
        //         await like.save();
        //         return res.status(200).json({ success: true, data: like });
        //     }
        // }
    }

    like = await LikeDislike.create(req.body);

    if (!like) {
        return next(new ErrorResponse("video not liked successfully", 404));
    }

    res.status(200).json({
        success: true,
        data: like
    })
})
