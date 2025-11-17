import express from 'express';
import { addComment, deleteComment, editComment, getComments } from '../controllers/comment.js';
import { verifyToken } from '../verifyToken.js';


const router = express.Router();


router.post("/", verifyToken, addComment );

router.delete("/:id", verifyToken, deleteComment );

router.get("/:videoId", getComments );

router.put("/editcomment/:commentId", verifyToken,  editComment );

// router.delete("/:videoId", deleteComment);


export default router;