/**
 * @auther Urvish sojitra
 * @desription Server and REST API Config
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import { router } from "./src/routes/index";
import path from "path";
import cookieParser from 'cookie-parser';
import { connectDB } from "./src/config/index";
import { errorHandler } from "./src/middleware";
import compression from "compression";


// Root dir configuration 
// const rootDir = path.dirname(process.mainModule.filename);

dotenv.config({ path: "./src/config/config.env" });

// Connect to Database
connectDB();

const app = express();

// 43962864
// [Object: null prototype] {
//   file1: [
//     {
//       fieldname: 'file1',
//       originalname: 'Node.js FFMPEG Project to Generate Video Thumbnail as PNG Image at Certain Time in Express.mp4',
//       encoding: '7bit',
//       mimetype: 'video/mp4',
//       destination: 'public/uploads',
//       filename: 'file1-1664429899323.mp4',
//       path: 'public\\uploads\\file1-1664429899323.mp4',
//       size: 43962572
//     }
//   ]
// }



app.use(compression());

// Body parser
app.use(express.json());
//before long ago express not contain body parser now now it contain so we can use both the way express body-parser and external package too see bellow for external package
// app.use(bodyParser.urlencoded({extended:false}));
// x-www-form-urlencoded fro <form> submit data
// app.use(bodyParser.json())// application/json


app.use(cookieParser());

// To enable colors
colors.enable();

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Enable CORS
app.use(cors());

// Make public folder public for static image retrieval
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/v1", router);

const health = (req, res) => {
    return res.status(200).json({
        message: "Zois backend server is running",
    })
}

app.get('/', health);
app.get('/health', health);
app.get('/isServerUp', (req, res) => {
    res.send('Server is running ');
});

const bad_gateway = (req, res) => { return res.status(502).json({ status: 502, message: "Backend API Bad Gateway" }) }
app.use('*', bad_gateway);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server: any = app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}....`.yellow.bold);
})

// Handel unhandled promise Rejection -> As Instance when we enter wrong password into database and we haven't use any try catch there 
process.on("unhandledRejection", (err: any, Promise) => {
    console.log(`Unhandled Rejection Error : ${err.massage}`.red);
    console.log(`Unhandled Rejection Error : ${err}`.red);
    console.log(`Unhandled Rejection Error : ${err.stack}`.red);
    //Close server and Exit process
    server.close(() => { process.exit(1) });
})
