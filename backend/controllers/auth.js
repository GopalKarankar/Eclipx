import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/Users.js';
import { createError } from '../error.js';
import dotenv from 'dotenv';
import  jwt  from 'jsonwebtoken';


// dotenv setup
dotenv.config();


export const signup = async (req, res, next) => {


    // console.log("Encrypted password is : ",hash);
    
    try{

        // Genereate hash value from user input password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);        
      
        // Insert user info, ppassword into database
        const newUser = new User({...req.body, password:hash});
        await newUser.save();

        // console.log("Encrypted password is : ",req.body);

        res.status(200).send({"msg":"User account created successfully."});

    }catch(err){
        // console.log(err);
        next(createError(404,"Username or email already exist !"));
    }

}


export const signin = async (req, res, next) => {


    // console.log("Encrypted password is : ",hash);
    
    try{

        const user = await User.findOne({name:req.body.name});

        if (!user) {
            return next(createError(404,"User not found"));            
        }

        const isCorrect = await bcrypt.compare( req.body.password, user.password );

        if (!isCorrect) {
            return next(createError(404,"Wrong password.."));                        
        }

        const token = await jwt.sign({id:user._id}, process.env.JWT_PRIVATE_KEY, {expiresIn:"30d"});
                
        const {password , ...excludePasswordInfo} = user._doc;

        res.cookie("access_token", token, {
            httpOnly:true,
             maxAge: 7 * 24 * 60 * 60 * 1000, 
                    sameSite:"none",
                    secure:true // 7 days in milliseconds
        }).status(200).json({excludePasswordInfo, msg:"User logged in successfully."});


    }catch(err){
        console.log(err);
        // next(createError(404,"somethings wrong !"));
    }

}



export const googleAuth = async (req, res, next) => {
  try {

            // Validate required fields
            if (!req.body.email) {
            return next(createError(400, "Email is required for Google authentication"));
            }

            // Check if the same email already exists
            const user = await User.findOne({ email: req.body.email });

          // If same user exists
          if (user) {

              // Create token to be joint with cookie with expiry (30 days)
              const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30d" });                      
              
              console.log(process.env.JWT_PRIVATE_KEY);

              // Exclude password from user info
              const {password , ...excludePasswordInfo} = user._doc;

              // Send "cookies that includes token" , along with "user info"   
              res.cookie("access_token", token, 
                {   httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds,
                    sameSite:"none",
                    secure:true
               }).status(200).json(excludePasswordInfo);
            
          } else {

              // Create new Google user (use "new" to create new info )
              const newUser = new User({ ...req.body, fromGoogle: true });

              console.log("newuser : ",newUser);

              // Save info to database
              const savedUser = await newUser.save();              

              const token = jwt.sign({ id: savedUser._id }, process.env.JWT_PRIVATE_KEY, { expiresIn: "30d" });
                              
              const {password , ...excludePasswordInfo} = savedUser._doc;

              res.cookie("access_token", token, { httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds,
                    sameSite:"none",
                    secure:true
               }).status(200).json(excludePasswordInfo);
 
          }
          

  } catch (error) {
    
        console.error("Google Auth Error:", error);
        next(createError(500, "Google authentication failed"));
  
    }

};
