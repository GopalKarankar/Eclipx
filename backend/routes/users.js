import express from 'express';
import { deleteUser, dislike, getUser, like, saveVideo, subscribe, unsaveVideo, unSubscribe, update } from '../controllers/user.js';
import { verifyToken } from '../verifyToken.js';


// Set a router variable
const router = express.Router();

// update user
router.put("/:id", verifyToken, update);

// delete user
router.delete("/:id", verifyToken, deleteUser);

// get a user by id
router.get("/find/:id",  getUser);

// Subscribe a user
router.put("/sub/:id", verifyToken, subscribe);

// Unsubscribe a user
router.put("/unsub/:id",verifyToken, unSubscribe);

// Like a video
router.put("/like/:videoId",verifyToken, like);

// dislike a video
router.put("/dislike/:videoId",verifyToken, dislike);

// Save video
router.put("/savevideo/:videoId",verifyToken, saveVideo);

// Unsave video
router.put("/unsavevideo/:videoId",verifyToken, unsaveVideo);


export default router;