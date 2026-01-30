import jwt from 'jsonwebtoken';
import { createError } from './error.js';

// instead of going through auth.js(mega-verification) everytime,  we go though verifyToken(mini-verification) everytime

export const verifyToken =  (req, res, next) =>{
    
    try{
        
        const token = req.cookies.access_token;

        console.log("Token : ",token);

        console.log("jwt private key : ",process.env.REACT_APP_JWT_PRIVATE_KEY)

        if (!token) {
             return next(createError(401,"You are not authenticated"));
        }

        jwt.verify(token, process.env.REACT_APP_JWT_PRIVATE_KEY ,  (err, decode)=>{

            if (err) {
                return next(createError(403,"Token is not valid"));                
            }

            // const {} =decode ;
            req.user = decode;
            // console.log(req.user);
            next();

        });

    }catch(err){
        console.log("error : ",err);
        next(err);
    }

}