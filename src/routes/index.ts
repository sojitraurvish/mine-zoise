import { Router, Request, Response } from "express";

import { authRouter } from './auth';
import { uploadRouter } from './upload';
import { videoRouter } from './video';
import { feedRouter } from './feed';
import { commentRouter } from './comment';

const router = Router();

router.use("/auth", authRouter);

router.use("/uploadVideo", uploadRouter);

router.use("/video", videoRouter);

router.use("/feed", feedRouter);

router.use("/comment", commentRouter);


export { router };