import mongoose from "mongoose";
import { createError } from "../error.js";
import User from "../models/Users.js";
import Video from "../models/Video.js";


export const update = async (req, res, next) =>{

    // here, "req.params.id" is link opened in another page and "req.user.id" is current logged in user reprensented through verifyToken.js
    if (req.params.id === req.user.id) {

        try{
            
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{
                new:true,
            });

            const { password, ...excludePasswordUserInfo} = updatedUser._doc;

            console.log("password : ", excludePasswordUserInfo);
            res.status(200).json(excludePasswordUserInfo);

            next();

        }catch(err){
            next(err);
        }   

    } else {
        return next(createError(404, "You can update only your account."));
    }

}



export const deleteUser = async (req, res, next) =>{

    // here, "req.params.id" is link opened in another page and "req.user.id" is current logged in user reprensented through verifyToken.js
    if (req.params.id === req.user.id) {

        try{
            
            await User.findByIdAndDelete(req.params.id);

            res.status(200).json("User has been deleted.");

            next();

        }catch(err){
            consolr.log(err);
            next(err);
        }   

    } else {

        return next(createError(404, "You can delete only your account."));
        
    }
    
}



export const getUser = async (req, res, next) =>{
 

        try{
            
                const user = await User.findById(req.params.id);

                if (!user) {
                    next(err);
                }
                
                const{password, ...excludePasswordUserInfo} = user._doc;

                res.status(200).json(excludePasswordUserInfo);


        }catch(err){
            consolr.log(err);
            next(err);
        }           

}



export const subscribe = async (req, res, next) =>{

    console.log(req);

        try{

            await User.findByIdAndUpdate(req.user.id,{
                $addToSet:{ subscribedUsers : req.params.id }
            });                    

            
            await User.findByIdAndUpdate(req.params.id,{
                $inc:{ subscribers:1}
            });

            res.status(200).json("Subscribtion successful.");

        }catch(err){
            consolr.log(err);
            // next(err);
        }   

}


export const unSubscribe = async (req, res, next) =>{

    console.log(req);

        try{

            await User.findByIdAndUpdate(req.user.id,{
                $pull:{ subscribedUsers : req.params.id }
            });                    

            await User.findByIdAndUpdate(req.params.id,{
                $inc:{ subscribers: -1}
            });

            res.status(200).json("Unsubscribtion successful.");

        }catch(err){
            consolr.log(err);
            next(err);
        }   

    
}



export const like = async (req, res, next) =>{

    console.log(req);

        const id = req.user.id;
        const videoId = req.params.videoId;

    try{

        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{likes:id},
            $pull:{dislikes:id}
        });

        res.status(200).json("Liked a video.");

    }catch(error){
            consolr.log(err);
            next(err);
    }
}



export const dislike = async (req, res, next) =>{

    console.log(req);

        const id = req.user.id;
        const videoId = req.params.videoId;
 
    try{

        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{dislikes:id},
            $pull:{likes:id}
        });

        res.status(200).json("Disliked a video.");

    }catch(error){
            consolr.log(err);
            next(err);
    }
    
}


// save video
export const saveVideo = async (req, res, next) => {

    console.log(req);

    try {

            console.log("video id : ",req.params.videoId);

            await User.findByIdAndUpdate(req.user.id,{
                $addToSet:{ savedVideos: req.params.videoId }
            });                    

            
            await Video.findByIdAndUpdate(req.params.videoId,{
                $addToSet:{ isSavedByUsers: req.user.id}
            });

        res.status(200).json("video saved");

    } catch (error) {
        console.log(error);
        next(error);
    }
}



// Unsave videos
export const unsaveVideo = async (req, res, next) => {

    console.log(req);

    try {

            // add video id in user schema
            await User.findByIdAndUpdate(req.user.id,{
                $pull:{ savedVideos: req.params.videoId }
            });                    


            // add user id in video schema
            await Video.findByIdAndUpdate(req.params.videoId,{
                $pull:{ isSavedByUsers: req.user.id}
            });

        res.status(200).json("Video Unsaved.");

    } catch (error) {
        console.log(error);
        next(error);
    }
}


