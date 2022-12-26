import { Router, Request, Response } from "express";
import { userController } from "../controllers";
import { validation, compress_image, image_compress_response } from "../middleware/index";
import { protect } from "../middleware/index";


const router = Router();


// router.post("/:file", protect, validation.file_type, compress_image.single("image"), image_compress_response);
router.post("/:file", protect, validation.file_type, compress_image.single("image"), image_compress_response);

// router.get("/me", protect, authController.getMe);

// router.put("/updatedetails", protect, validation.updateDetails, authController.updateDetails);

export const uploadRouter = router;