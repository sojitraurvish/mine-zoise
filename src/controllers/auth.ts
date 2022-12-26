import { Request, Response } from "express";
import { ErrorResponse } from "../util/index";
import { User } from "../model/index";
import { asyncHandler } from "../middleware/index";
import { send_Email } from "../middleware/index";

// @desc     Sign Up
// @route    POST /api/v1/auth/signup
// @access   public
export const signUp = asyncHandler(async (req: any, res: Response, next: any) => {
    let { email, password, username, DOB, gender, location } = req.body as any;

    let user: any = await new User({
        email,
        password,
        username,
        DOB,
        gender,
        location
    });


    //Get reset Otp and check two user should not have same otp
    let flag = 1, resetOtp: any;
    while (flag == 1) {
        resetOtp = await user.getOtp();

        const otpExistsInDb: any = await User.find({ resetPasswordOtp: resetOtp });
        if (otpExistsInDb.resetPasswordOtp !== resetOtp) { flag = 0 }
    }


    await user.save({ validateBeforeSave: false });
    if (!user) {
        return next(`Try again`, 204);
    }

    //OTp String
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Your Otp is: \n \n ${resetOtp}`;

    try {

        await send_Email({
            email: user.email,
            subject: "Reset Password OTP",
            message
        })

        res.status(200).json({ success: true, data: "Email sent" });
    }
    catch (err) {
        console.log(err);
        // user.resetPasswordOtp = undefined;
        // user.resetPasswordExpire = undefined;

        // await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`Email could not be sent try again`, 500));
    }



    // sendTokenResponse(user, 200, res);
})

// @desc     Otp verification for sign up
// @route    POST /api/v1/auth/signup
// @access   public
export const otpVerification = asyncHandler(async (req: any, res: Response, next: any) => {


    // To check otp is wright or not
    let user = await User.findOne({
        resetPasswordOtp: req.body.otp
    });

    if (!user) {
        return next(new ErrorResponse(`Wrong Otp`, 403));
    }

    if (user.resetPasswordExpire < new Date(new Date().getTime())) {
        return next(new ErrorResponse(`Otp expire`, 404));
    }

    user.isOtpVerified = true;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });


    sendTokenResponse(user, 200, res);
})

// @desc     Login User
// @route    POST /api/v1/auth/login
// @access   public
export const login = asyncHandler(async (req: Request, res: Response, next: any) => {
    let { email, password } = req.body as any;

    const user: any = await User.findOne({ email: email }).select("+password");

    // check user email exits or not  
    if (!user) { return next(new ErrorResponse(`Invalid Email`, 401)); }

    // To check user has deleted or deactivated his account or not 
    if (!user.isActive) { return next(new ErrorResponse("User Account is deleted", 404)); }

    // To check user has deleted or deactivated his account or not 
    if (user.isBlock) { return next(new ErrorResponse("Your account has been blocked!", 403)); }

    const isMatch = await user.matchPassword(password);

    // check user email exits or not  
    if (!isMatch) { return next(new ErrorResponse(`Invalid Password`, 401)); }

    // Signup otp is verified or not
    if (!user.isOtpVerified) { return next(new ErrorResponse(`Otp not verified`, 404)) }

    sendTokenResponse(user, 200, res);
})


// @desc     Logout User / Clear cookie
// @route    POST /api/v1/auth/logout
// @access   public
export const logout = asyncHandler(async (req: any, res: Response, next: Function) => {

    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });

})

// @desc     Get My info
// @route    GET /api/v1/auth/getMe
// @access   private
export const getMe = asyncHandler(async (req: any, res: Response, next: Function) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })

})

// @desc     Get My info
// @route    GET /api/v1/auth/getMe
// @access   private
export const updateDetails = asyncHandler(async (req: any, res: Response, next: Function) => {

    let body = req.body;

    console.log(body);

    const user = await User.findByIdAndUpdate({ _id: req.user.id }, body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    })

})

// @desc     Forgot Password
// @route    PUT /api/v1/auth/updatepassword
// @access   private
export const updatePassword = asyncHandler(async (req: any, res: Response, next: Function) => {

    const user: any = await User.findById(req.user.id).select("+password");

    //Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse(`Password is incorrect`, 401));
    }

    user.password = req.body.newPassword;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);

})


// @desc     Update password
// @route    PUT /api/v1/auth/forgotpassword
// @access   public
export const forgotPassword = asyncHandler(async (req: any, res: Response, next: Function) => {

    const user: any = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorResponse(`There is no user with this email`, 404));
    }

    // To check user has deleted or deactivated his account or not 
    if (!user.isActive) { return next(new ErrorResponse("User Account is deleted", 404)); }

    // To check user has deleted or deactivated his account or not 
    if (user.isBlock) { return next(new ErrorResponse("Your account has been blocked!", 403)); }

    //Get reset Otp and check two user should not have same otp
    let flag = 1, resetOtp;
    while (flag == 1) {
        resetOtp = await user.getOtp();

        const otpExistsInDb = await User.find({ resetPasswordOtp: resetOtp });
        if (otpExistsInDb !== resetOtp) { flag = 0 }
    }

    await user.save({ validateBeforeSave: false });

    //OTp String

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Your Otp is: \n \n ${resetOtp}`;

    try {
        await send_Email({
            email: user.email,
            subject: "Reset Password OTP",
            message
        })
        return res.status(200).json({ success: true, data: "Email sent" });
    }
    catch (err) {
        console.log(err);
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`Email could not be sent`, 500));
    }


})

// @desc     Reset password
// @route    PUT /api/v1/auth/resetpassword
// @access   public
export const resetPassword = asyncHandler(async (req: any, res: Response, next: Function) => {

    // To check otp is wright or not
    let user = await User.findOne({
        resetPasswordOtp: req.body.resetOtp
    });

    if (!user) {
        return next(new ErrorResponse(`Wrong Otp`, 403));
    }

    if (user.resetPasswordExpire < new Date(new Date().getTime())) {
        return next(new ErrorResponse(`Otp expire`, 404));
    }

    user.password = req.body.password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);

})


// Get token from model,create cookie and send response
export const sendTokenResponse = asyncHandler(async (user: any, statusCode: any, res: any) => {

    // Create token
    const token = user.getSignedJwtToken();


    const options: any = {
        expires: new Date(Date.now() as number + (parseInt(process.env.JWT_COOKIE_EXPIRE as string)) * 24 * 24 * 60 * 1000),
        httpOnly: true//we want cookie should be access only through client side script
    }

    if (process.env.NODE_ENV === "production") {
        options.secure = true;//we want cookie when request type should be https
    }

    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            token
        })

})