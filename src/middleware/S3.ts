import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import AWS from 'aws-sdk'
import { Request, Response } from "express";
import multerS3 from "multer-s3";
import multer_s3_transform from "multer-s3-transform";
import { apiResponse } from "../util";
import sharp from "sharp";
const uuid = require("uuid").v4;
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config/config.env" })

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME


let s3 = new AWS.S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION

});

// let s3Client = new S3Client({
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//     region: process.env.AWS_REGION

// });

// export const uploadS3 = multer({
//     storage: multerS3({
//         s3: s3Client,
//         bucket: AWS_BUCKET_NAME,
//         acl: 'public-read',
//         metadata: function (req, file, cb) {
//             console.log(file);
//             cb(null, { fieldName: file.fieldname });
//         },
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, Date.now().toString())
//         }
//     })
// })

// console.log("fsdfsd" + process.cwd());

export const compress_image = multer({
    storage: multer_s3_transform({
        s3: s3,
        bucket: AWS_BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        shouldTransform: function (req, file, cb) {
            console.log(file);
            cb(null, { fieldName: file.fieldname })
        },
        transforms: [{
            id: 'thumbnail',
            key: function (req, file, cb) {
                console.log(file);
                req.body.location = `${req.user._id}/${req.params.file}/${uuid()}${path.parse(file.originalname).ext}`
                cb(null, req.body.location)
            },
            transform: function (req, file, cb) {
                console.log(file);
                cb(null, sharp().withMetadata().jpeg({ quality: 50 }))
            }
        }]
    })
})

export const image_compress_response = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            status: 200,
            message: "image successfully uploaded",
            data: { image: req.body.location, size: req.body.size }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, "Internal server error", {}, error));
    }
}


