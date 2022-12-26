import { Router, Request, Response } from "express";
import { userController } from "../controllers";
import { validation } from "../middleware/index";
import { protect } from "../middleware/index";

const router = Router();

// Video routes
router.route("/")
    .get(userController.getFeeds)
    .post(protect, validation.addFeed, userController.addFeed);

router.route("/:feedId/likeDislike")
    .post(protect, validation.likeDislikeFeed, userController.likeDislikeFeed);


export const feedRouter = router;