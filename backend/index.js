import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();

// dotenv setup
dotenv.config();

// Connect with mongoDB database
const connect = () => {

    mongoose.connect(process.env.MONGOCONN)
    .then(()=>{
        console.log("Connected to mongodb.");
        }

    ).catch((err)=>{
            console.log(err);
            throw err;
        }
    );
    
}


// Allow requests from React frontend
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "https://eclipx-9saf.vercel.app",
      "https://eclipx-nine.vercel.app",
      "http://localhost:3000", // for local development
      "http://localhost:3001"
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      // Allow any vercel deployment of eclipx
      if (origin.includes("eclipx") && origin.includes("vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error('CORS not allowed'));
    }
    
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // allows cookies/auth headers
}));



// TO allow cookie parsing
app.use(cookieParser());

// To allow use of json from outside in express
app.use(express.json());


// Parent routes with sub-routes inside it
app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/videos/", videoRoutes);
app.use("/api/comments/", commentRoutes);


// Error receiving object middleware handling (this will receive err object from above middlewares)
app.use((err,req,res,next)=>{
   
    const status = err.status || 500;
    const message = err.message || "Something went wrong !";
    
    return res.status(status).json({
        success:false,
        status,
        message,
    });

});

// server setup with port
app.listen(8800,()=>{
    connect();
    console.log("server running at port 8800.");
})
