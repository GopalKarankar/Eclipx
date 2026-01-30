import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/Users.js";


export const getMyVideos = async (req, res, next) => {
        
        try{
            const myVideos  = await Video.find({userId:req.user.id});

            res.status(200).json(myVideos);

        } catch (error) {
            console.log(error);
             return next(createError(404, "Here You can view only your account."));   
        }        

}


export const addVideo = async (req, res, next) => {

        const newVideo = new Video( { userId:req.user.id , ...req.body });

    try{

        const savedVideo = await newVideo.save();
        
        res.status(200).json(savedVideo);

    }catch(error){
        console.log(error);
        next(error);
    }
}
 

export const updateVideo = async (req, res, next) => {

    try{
        const video = await Video.findById(req.params.id);

            if(!video){
                next(createError(404,"Video not found."));
            }

            if (req.user.id === video.userId ) {
                
                    const updatedVideo = await Video.findByIdAndUpdate(req.params.id,{
                        $set:req.body
                    },
                    {
                        new:true
                    },
                );

                res.status(200).json(updatedVideo);
                
            }


    }catch(error){

        console.log(error);
        next(createError(403,"You can only update  your account."));

    }
    
}



export const deleteVideo = async (req, res, next) => {

console.log("Video id : ",req.params.id);

    try{
        const video = await Video.findById(req.params.id);

            if(!video){
                next(createError(404,"Video not found."));
            }

            if (req.user.id === video.userId ) {
                
                     await Video.findByIdAndDelete(req.params.id);
                
            }

            res.status(200).json("Video deleted.");

    }catch(error){

        console.log(error);
        next(createError(403,"Only you can  delete  your account."));

    }    

}



export const getVideo = async (req, res, next) => {
    
    try{        
        const video = await Video.findById(req.params.id);

        res.status(200).json(video);

    }catch(error){
        console.log(error);
        next(error);
    }

}



export const addView = async (req, res, next) => {
    
    try{        
         await Video.findByIdAndUpdate(req.params.id,{
            $inc:{views:1}
        });

        res.status(200).json("View has been increased.");

    }catch(error){
        console.log(error);
        next(error);
    }

}





export const random = async (req, res, next) => {
    
    try{        
        const videos = await Video.aggregate([{$sample:{size:40}}]);

        res.status(200).json(videos);

    }catch(error){
        console.log(error);
        next(error);
    }

}





export const trend = async (req, res, next) => {
    
    try{        

        const videos = await Video.find().sort({ views: -1 }).limit(10);

        res.status(200).json(videos);

    }catch(error){
        console.log(error);
        next(error);
    }

}




// View subscribed videos
export const sub = async (req, res, next) => {
    
    try{        
        
        const user = await User.findById(req.user.id);
        const subscribedChannels =  user.subscribedUsers;

        const list = await Promise.all(

            subscribedChannels.map((channelId)=>{  
                    return Video.find({userId:channelId});
            })

        );

        res.status(200).json(list.flat().sort((a,b) => b.createdAt- a.createdAt));

    }catch(error){
        console.log(error);
        next(error);
    }

}




// View saved videos
export const saved = async (req, res, next) => {
    
    try{        
        
        const user = await User.findById(req.user.id);
        const savedVideos =  user.savedVideos;

        const list = await Promise.all(

            savedVideos.map((videoId)=>{  
                    return Video.find({_id:videoId});
            })

        );

        res.status(200).json(list.flat().sort((a,b) => b.createdAt- a.createdAt));

    }catch(error){
        console.log(error);
        next(error);
    }

}




export const getByTag = async (req, res, next) => {

  const  tags = req.query.tags.split(",");
    
    try{        

        const videos = await Video.find({ tags: { $in: tags }}).limit(20);

        res.status(200).json(videos);

    }catch(error){
        console.log(error);
        next(error);
    }

}



export const search = async (req, res, next) => {
    
    const query = req.query.q;

    try{        

        const videos = await Video.find({title:{$regex:query, $options:"i"}}).limit(40);

        res.status(200).json(videos);

    }catch(error){
        console.log(error);
        next(error);
    }

}

