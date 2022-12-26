import mongoose from "mongoose";

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        // useNewUrlParser:true,_v=0
        // userCreateIndex:true, index auto genrate
        // useFindAndModify:false,
        //useUnifiedTopology: true
    });

    console.log(`MongoDB Connected ${conn.connection.host}`.cyan.underline.bold);
}

export { connectDB };