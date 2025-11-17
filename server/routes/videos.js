import express from 'express';
import { addVideo, addView, deleteVideo, getByTag, getMyVideos, getVideo, random, saved, search, sub, trend, updateVideo } from '../controllers/video.js';
import { verifyToken } from '../verifyToken.js';


const router = express.Router();


// Get My videos
router.get("/myvideos", verifyToken, getMyVideos );

// create a video
router.post("/", verifyToken, addVideo );

// Update a video
router.put("/updatevideo/:id", verifyToken, updateVideo );

// Delete a video
router.delete("/delete/:id", verifyToken, deleteVideo );

// get a video
router.get("/find/:id", getVideo );

// get add view to video
router.put("/view/:id", addView );

// get trending videos
router.get("/trend/", trend );

// get random videos
router.get("/random/", random );

// get subscribed videos
router.get("/sub/", verifyToken, sub );

// get saved videos
router.get("/saved/", verifyToken, saved );

// get by tags  
router.get("/tags", getByTag );

// get searched videos
router.get("/search",  search );



export default router;