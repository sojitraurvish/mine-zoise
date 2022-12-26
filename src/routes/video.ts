import { Router, Request, Response } from "express";
import { userController } from "../controllers";
import { validation } from "../middleware/index";
import { protect } from "../middleware/index";

const router = Router();


// Video routes
router.route("/")
    .get(protect, userController.getVideos)
    .post(protect, validation.addVideoFeed, userController.addVideo);

router.route("/:feedId")
    .put(protect, validation.addVideoFeed, userController.updateVideo);

router.route("/:feedId/likeDislike")
    .post(protect, validation.likeDislikeVideo, userController.likeDislikeVideo);

// router.route("/:feedId/like")
//     .post(protect, userController.likeVideo);

// router.route("/:feedId/dislike")
//     .post(protect, userController.dislikeVideo);

router.route("/share/:feedId")
    .get(protect, userController.shareVideo);

router.route("/view/:feedId")
    .get(protect, userController.viewVideo);


export const videoRouter = router;