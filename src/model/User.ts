import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please add Email"],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please add valid Email"
        ]
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user",
        required: true
    },
    username: {
        type: String,
        required: [true, "Please add username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        minlength: 6,
        select: false //when we get user this field not going show password 
    },
    resetPasswordOtp: String,
    resetPasswordExpire: Date,
    isOtpVerified: {
        type: Boolean,
        default: false

    },
    DOB: {
        type: String,
        required: [true, "Please enter DOB"],
        match: [
            /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
            "Please add valid Date of Birth in this formate dd/mm/yyyy, dd-mm-yyyy or dd.mm.yyyy."
        ]
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: [true, "Please enter gender"]
    },
    location: {
        type: String,
        required: [true, 'Please enter location']
    },
    isActive: { type: Boolean, default: true },
    isBlock: { type: Boolean, default: false }
    // country: { type: String, default: null },
    // state: { type: String, default: null },
    // city: { type: String, default: null },
    // suburb: { type: String, default: null },
    // latitude: { type: Number, default: 0 },
    // longitude: { type: Number, default: 0 },

}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    //if i am saving data without password like in forget password so password will not be there and that's why this function give error so i am checking that password is exists or modified then and only decrypt it otherwise ...
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    // console.log(salt);
    this.password = await bcrypt.hash(this.password, salt);
    // console.log(this.password);
});

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({
        id: this._id.toString()
    },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    )
}

// Match entered password to the hashed password into database
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Get resetpassword otp
UserSchema.methods.getOtp = async function () {
    const resetOtp = Math.floor(100000 + Math.random() * 900000);

    this.resetPasswordOtp = resetOtp;
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetOtp;
};


export const User = mongoose.model("User", UserSchema);