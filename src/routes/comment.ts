import { Router, Request, Response } from "express";
import { userController } from "../controllers";
import { validation } from "../middleware/index";
import { protect } from "../middleware/index";

const router = Router();


// Comments routes

router.route("/video/:videoId")
    .get(protect, userController.commentByVideo);

router.route("/replay")
    .post(protect, userController.commentReplay);

router.route("/")
    .post(protect, validation.addComment, userController.addComment);

export const commentRouter = router;