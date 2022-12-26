import { Request, Response } from "express";
import { ErrorResponse } from "../../util/index";
import { asyncHandler } from "../../middleware/index";
import { send_Email } from "../../middleware/index";
import { Feed, LikeDislike } from "../../model/index";
// import { ObjectId } from "mongoose";
let ObjectId = require('mongoose').Types.ObjectId;



// @desc     Add Video dfsfsfsd
// @route    POST /api/v1/video/
// @access   public
export const addVideo = asyncHandler(async (req: any, res: Response, next: any) => {

    req.body.createdBy = req.user._id;
    req.body.type = 0;//type: video
    // console.log(req.user._id);

    // Checking url for video feed
    let feedStr = req.body.feedUrl.split("/")[req.body.feedUrl.split("/").length - 1];
    let feedType = feedStr.split(".")[feedStr.split(".").length - 1];
    if (feedType !== "mp4") {
        return next(new ErrorResponse(`Plase Give valid url for Video.`, 403));
    }

    // Checking thumbnail staring
    if (req.body.thumbnail) {
        let thumbnailStr = req.body.thumbnail.split("/")[req.body.thumbnail.split("/").length - 1];
        let thumbnailType = thumbnailStr.split(".")[thumbnailStr.split(".").length - 1];
        if (thumbnailType !== "png") {
            return next(new ErrorResponse(`Plase Give valid url for thumbnail.`, 403));
        }
        console.log(thumbnailType);
    }

    // console.log(feedType);

    let video = await Feed.create(req.body);

    if (!video) {
        return next(new ErrorResponse("video not Added successfully", 404));
    }

    res.status(201).json({ success: true, data: video });
})

// @desc     Update Video
// @route    POST /api/v1/video/:feedId
// @access   public
export const updateVideo = asyncHandler(async (req: any, res: Response, next: any) => {

    // check video exits or not 
    const feed = await Feed.findById(req.params.feedId);

    if (!feed) {
        return next(new ErrorResponse(`Feed id not exists`, 400));
    }

    if (feed.type !== 0) {
        return next(new ErrorResponse(`Please enter valid feed's id for Feed type`, 400));
    }

    if (!feed.isActive) {
        return next(new ErrorResponse(`This video is deleted`, 400));
    }

    if (feed.isBlock) {
        return next(new ErrorResponse(`This video is block`, 400));
    }


    req.body.createdBy = req.user._id;
    req.body.type = 0;//type: video
    // console.log(req.user._id);

    // Checking url for video feed
    let feedStr = req.body.feedUrl.split("/")[req.body.feedUrl.split("/").length - 1];
    let feedType = feedStr.split(".")[feedStr.split(".").length - 1];
    if (feedType !== "mp4") {
        return next(new ErrorResponse(`Plase Give valid url for Video.`, 403));
    }

    // Checking thumbnail staring
    if (req.body.thumbnail) {
        let thumbnailStr = req.body.thumbnail.split("/")[req.body.thumbnail.split("/").length - 1];
        let thumbnailType = thumbnailStr.split(".")[thumbnailStr.split(".").length - 1];
        if (thumbnailType !== "png") {
            return next(new ErrorResponse(`Plase Give valid url for thumbnail.`, 403));
        }
        console.log(thumbnailType);
    }

    // console.log(req.body);

    let video = await Feed.findByIdAndUpdate(req.body.feedId, req.body, {
        new: true,
        runValidators: true
    });

    // console.log(video);

    if (!video) {
        return next(new ErrorResponse("video not Updated successfully", 404));
    }

    res.status(201).json({ success: true, data: video });
})


// @desc     Sign Up
// @route    POST /api/v1/video/
// @access   public
export const getVideos = asyncHandler(async (req: any, res: Response, next: any) => {

    const count = await Feed.count();
    // Get a random entry
    var random = Math.floor(Math.random() * count);


    const user = await Feed.aggregate([
        { $match: { type: 0, isActive: true, isBlock: false } },
        { $limit: 10 },
        {
            $lookup: {
                from: "likedislikes",
                let: { videoId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$feedId", "$$videoId"] }
                                ]
                            }
                        }
                    }
                ],
                as: "likedBy"
            }
        },
        {
            $lookup: {
                from: "users",
                let: { createdBy: "$createdBy" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$createdBy"] }
                                ]
                            }
                        }
                    },
                    { $project: { username: 1 } }
                ],
                as: "user"
            }
        },
        {
            $addFields: {
                isLike:
                {
                    $cond:
                    {
                        if: {
                            $and: [
                                { $in: [ObjectId(req.user._id), "$likedBy.createdBy"] },
                                { $in: [1, "$likedBy.likeDislike"] }
                            ]
                        }
                        , then: true
                        , else: false
                    }
                },
                isDislike:
                {
                    $cond:
                    {
                        if: {
                            $and: [
                                { $in: [ObjectId(req.user._id), "$likedBy.createdBy"] },
                                { $in: [0, "$likedBy.likeDislike"] }
                            ]
                        }
                        , then: true
                        , else: false
                    }
                }
            }
        },
        { $project: { createdBy: 0, createdAt: 0, updatedAt: 0, __v: 0, isActive: 0, isBlock: 0, likedBy: 0, suburb: 0, state: 0, city: 0, country: 0, latitude: 0, longitude: 0, listViewUser: 0, setting: 0, dislikedBy: 0, tag: 0 } },
    ]);

    if (!user) {
        return next(new ErrorResponse("Video not found", 404));
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc     Like video (add remove)
// @route    POST /api/v1/video/:feedId/like
// @access   private
export const likeDislikeVideo = asyncHandler(async (req: any, res: Response, next: any) => {

    req.body.likeDislike = parseInt(req.body.likeDislikeFlag); // 0 = dislike || 1 = like 
    req.body.feedId = req.params.feedId;
    req.body.createdBy = req.user._id;

    // console.log(req.body.feedId);
    // check video exits or not 
    const feed = await Feed.findById(req.body.feedId);

    if (!feed) {
        return next(new ErrorResponse(`Video not exists`, 400));
    }

    if (!feed.isActive) {
        return next(new ErrorResponse(`Video is deleted`, 400));
    }

    if (feed.isBlock) {
        return next(new ErrorResponse(`Video is block`, 400));
    }

    let like;

    like = await LikeDislike.findOne({ feedId: req.body.feedId, createdBy: req.body.createdBy });


    if (like) {
        // Remove like
        if (req.body.likeDislike === 1) {
            if (like.likeDislike === 1) {
                await like.remove();
                await Feed.findByIdAndUpdate(req.body.feedId, { $inc: { totalLike: -1 } })
                return res.status(200).json({ success: true, data: {} });
            }
            if (like.likeDislike === 0) {
                like.likeDislike = 1;
                await like.save();
                return res.status(200).json({ success: true, data: like });
            }
        }

        if (req.body.likeDislike === 0) {
            if (like.likeDislike === 0) {
                await like.remove();
                return res.status(200).json({ success: true, data: {} });
            }
            if (like.likeDislike === 1) {
                like.likeDislike = 0;
                await like.save();
                return res.status(200).json({ success: true, data: like });
            }
        }
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

// @desc     Share video (increment in video count)
// @route    POST /api/v1/video/share/:feedId
// @access   private
export const shareVideo = asyncHandler(async (req: any, res: Response, next: any) => {
    req.body.feedId = req.params.feedId;

    // console.log(req.body.feedId);
    // check video exits or not 
    let feed = await Feed.findById(req.body.feedId);

    if (!feed) {
        return next(new ErrorResponse(`Feed id not exists`, 400));
    }

    if (!feed.isActive) {
        return next(new ErrorResponse(`Feed not Found exists`, 400));
    }

    if (feed.isBlock) {
        return next(new ErrorResponse(`Feed is block`, 400));
    }

    if (feed.type !== 0) {
        return next(new ErrorResponse(`Please enter valid feed's id for Feed type`, 400));
    }

    feed = await Feed.findOneAndUpdate({ _id: req.body.feedId }, { $inc: { totalShare: 1 } });

    res.status(200).json({
        success: true,
        data: feed
    })
})
// @desc     view video (increment in video view count)
// @route    POST /api/v1/video/view/:feedId
// @access   private
export const viewVideo = asyncHandler(async (req: any, res: Response, next: any) => {
    req.body.feedId = req.params.feedId;

    // console.log(req.body.feedId);
    // check video exits or not 
    let feed = await Feed.findById(req.body.feedId);

    if (!feed) {
        return next(new ErrorResponse(`Feed id not exists`, 400));
    }

    if (!feed.isActive) {
        return next(new ErrorResponse(`Feed not Found exists`, 400));
    }

    if (feed.isBlock) {
        return next(new ErrorResponse(`Feed is block`, 400));
    }

    if (feed.type !== 0) {
        return next(new ErrorResponse(`Please enter valid feed's id for Feed type`, 400));
    }

    feed = await Feed.findOneAndUpdate({ _id: req.body.feedId }, { $inc: { totalView: 1 }, $addToSet: { listOfViewedUser: req.user._id } });

    res.status(200).json({
        success: true,
        data: feed
    })
})

// // @desc     Like video (add remove)
// // @route    POST /api/v1/video/:feedId/like
// // @access   private
// export const likeVideo = asyncHandler(async (req: any, res: Response, next: any) => {

//     req.body.likeDislike = 1; // 0 = dislike || 1 = like
//     req.body.feedId = req.params.feedId;
//     req.body.createdBy = req.user._id;

//     // console.log(req.body.feedId);
//     // check video exits or not
//     const feed = await Feed.findById(req.body.feedId);

//     if (!feed) {
//         return next(new ErrorResponse(`Feed id not exists`, 400));
//     }

//     if (!feed.isActive) {
//         return next(new ErrorResponse(`Feed not Found exists`, 400));
//     }

//     if (feed.isBlock) {
//         return next(new ErrorResponse(`Feed is block`, 400));
//     }

//     let like;

//     like = await LikeDislike.findOne({ feedId: req.body.feedId, createdBy: req.body.createdBy });

//     if (like) {
//         // Remove like
//         if (like.likeDislike === 1) {
//             await like.remove();
//             return res.status(200).json({ success: true, data: {} });
//         }

//         if (like.likeDislike === 0) {
//             like.likeDislike = 1;
//             await like.save();
//             return res.status(200).json({ success: true, data: like });
//         }
//     }

//     like = await LikeDislike.create(req.body);

//     if (!like) {
//         return next(new ErrorResponse("video not liked successfully", 404));
//     }

//     res.status(200).json({
//         success: true,
//         data: like
//     })
// })


// // @desc     DisLike video (add remove)
// // @route    POST /api/v1/video/:feedId/dislike
// // @access   private
// export const dislikeVideo = asyncHandler(async (req: any, res: Response, next: any) => {

//     req.body.likeDislike = 0; // 0 = dislike || 1 = like
//     req.body.feedId = req.params.feedId;
//     req.body.createdBy = req.user._id;

//     // check video exits or not
//     const feed = await Feed.findById(req.body.feedId);

//     if (!feed) {
//         return next(new ErrorResponse(`Feed id not exists`, 400));
//     }

//     let like;

//     like = await LikeDislike.findOne({ feedId: req.body.feedId, createdBy: req.body.createdBy });

//     if (like) {

//         // Remove dislike
//         if (like.likeDislike === 0) {
//             await like.remove();
//             return res.status(200).json({ success: true, data: {} });
//         }

//         if (like.likeDislike === 1) {
//             like.likeDislike = 0;
//             await like.save();
//             return res.status(200).json({ success: true, data: like });
//         }
//     }

//     like = await LikeDislike.create(req.body);

//     if (!like) {
//         return next(new ErrorResponse("video not liked successfully", 404));
//     }

//     res.status(200).json({
//         success: true,
//         data: like
//     })
// })