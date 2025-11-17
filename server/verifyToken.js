import jwt from 'jsonwebtoken';
import { createError } from './error.js';

// instead of going through auth.js(mega-verification) everytime,  we go though verifyToken(mini-verification) everytime

export const verifyToken =  (req, res, next) =>{
    
    try{
        
        const token = req.cookies.access_token;

        console.log(token);

        if (!token) {
             next(createError(401,"You are not authenticated"));
        }

        jwt.verify(token, process.env.JWT_PRIVATE_KEY ,  (err, decode)=>{

            if (err) {
                return next(createError(403,"Token is not valid"));                
            }

            // const {} =decode ;
            req.user = decode;
            // console.log(req.user);
            next();

        });

    }catch(err){
        console.log(err);
        next(err);
    }

}