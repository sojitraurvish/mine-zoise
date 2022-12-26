import { Request, Response } from "express";
import { ErrorResponse } from "../../util/index";
import { User } from "../../model/index";
import { asyncHandler } from "../../middleware/index";


// import { getVideoDurationInSeconds } from 'get-video-duration';
// @desc     Sign Up
// @route    POST /api/v1/auth/signup
// @access   public
export const uploadVideo = asyncHandler(async (req: any, res: Response, next: any) => {

    console.log(req.file);

    // res.status(201).json({
    //     success: true,
    //     data: 
    // })

})