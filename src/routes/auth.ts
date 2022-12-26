import { Router, Request, Response } from "express";
import { authController } from "../controllers";
import { validation } from "../middleware/index";
import { protect } from "../middleware/index";

const router = Router();

router.post("/signup", validation.signUp, authController.signUp);

router.post("/otpverification", validation.otpVerification, authController.otpVerification);

router.post("/login", validation.login, authController.login);

router.post("/logout", authController.logout);

router.get("/me", protect, authController.getMe);

router.put("/updatedetails", protect, validation.updateDetails, authController.updateDetails);

router.put("/updatepassword", protect, validation.updatePassword, authController.updatePassword);

router.post("/forgotpassword", validation.forgotPassword, authController.forgotPassword);

router.put("/resetpassword", validation.resetPassword, authController.resetPassword);

export const authRouter = router;