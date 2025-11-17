import mongoose from 'mongoose';    
import Comment from '../models/Comment.js';
import Video from '../models/Video.js';
import { createError } from '../error.js';



export const addComment = async (req, res, next) => {

    
    const newComment = await Comment({ ...req.body, userId : req.user.id  });

    try{
        const savedComment = await newComment.save();

        res.status(200).json(savedComment);

    }catch(error){

        console.log(error);

    }

}



export const deleteComment = async (req, res, next) => {
    
    try{

        const comment = await Comment.findById(req.params.id);

        const video = await Video.findById(req.params.id);

        if (req.user.id === comment.userId || req.user.id === video.userId) {
            
            await Comment.findByIdAndDelete(comment.id);

            res.status(200).json("Comment deleted successfully");
        
        }else{
            return createError(403,"You can delete only your comment.")
        }

    }catch(error){

        console.log(error);

    }

}




export const getComments = async (req, res, next) => {
    
    try{
        
        const comments = await Comment.find({videoId:req.params.videoId}).sort({createdAt:-1});
        
        res.status(200).json(comments);

    }catch(error){

        console.log(error);

    }

}

export const editComment = async (req, res) => {
            
            
            try {

                const comment = await Comment.findById(req.params.commentId);

                if (!comment) {
                    next(createError(404,"Comment not found."));
                }

                if (req.user.id === comment.userId) {

                    console.log(req.user.id);
                    console.log(comment.userId);

                    const commentEdited = await Comment.findByIdAndUpdate(req.params.commentId,{

                                $set: req.body

                            },
                            {
                                new:true   
                            }
                        );


                    if (commentEdited) {
                        res.status(200).json("Comment edited successfully.");                    
                    }
                    
                } else {

                    next(createError(404,"Only you can delete your video."));
                    
                }


            } catch (error) {

                console.log(error);

            }

}

