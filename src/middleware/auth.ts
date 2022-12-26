
import express, { Response, Request } from "express"
import jwt from "jsonwebtoken";
import { User } from "../model";
import { ErrorResponse } from "../util/index";

const protect = async (req: any, res: Response, next: Function) => {

    let token;

    //Set token from Bearer token in header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.headers.authorization) {
        token = req.headers.authorization;
    }
    //Set token from cookie
    else if (req.cookies.token) { //and use cookie-parser to get cookie data
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse(`Not authorize to access this route`, 401));
    }

    try {
        // Verify token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        // Find user with that id
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorResponse(`Not authorize to access this route`, 401));
        }

        // To check user has deleted or deactivated his account or not 
        if (!user.isActive) {
            return next(new ErrorResponse("User Account is deleted", 404));
        }

        // To check user has deleted or deactivated his account or not 
        if (user.isBlock) {
            return next(new ErrorResponse("Your account has been blocked!", 404));
        }

        req.user = user;

        next();

    } catch (err) {
        return next(new ErrorResponse(`Not authorize to access this route`, 401));
    }

}

export { protect }