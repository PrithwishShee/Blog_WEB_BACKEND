import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.middlewares.js";
import ErrorHandler, { errorMiddleware } from "../middlewares/errors.middlewares.js";
import { User } from "../models/userScherma.models.js";
import { sendToken } from "../utils/jwToken.utils.js";
import cloudinary from 'cloudinary'



export const register = catchAsyncErrors(async(req, res, next)=>{

    if(!req.files|| Object.keys(req.files).length === 0){
        return next(new ErrorHandler("User Avatar Required", 400));
    }
    const{avatar}=req.files;
    const allowedFormats=["image/png","image/jpeg","image/webp"]
    if(!allowedFormats.includes(avatar.mimetype)){
        return next(
            new ErrorHandler(
                "invalid file tye. Please provide your avatar in png, jpeg or webp formmat.", 
                400
            )
        );
    }


    const{name, email, password, phone, education}= req.body;
    if(!name || !email || !password || !phone || !education||!avatar){
        return next(new ErrorHandler("Please fill full details!", 400));
    }
    let user = await User.findOne({email});
    if (user){
        return next(new ErrorHandler("User already exists", 400));
    }


    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error: ", cloudinaryResponse.error || "Unknown Cloudinary Error!!");
    };


    user=await User.create({
        name,
        email, 
        password, 
        phone, 
        education,
        avatar:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    sendToken(user, 200, "User registered successfully", res);
    
});

export const login = catchAsyncErrors(async(req, res, next)=>{
    const {email, password}=req.body;
    if(!email || !password ){
        return next(new ErrorHandler("Please fill full form !",400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("invalid email or password", 400));
    }
    const  isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next (new ErrorHandler("Invalid password", 400));
    }
    sendToken(user, 200, "User Logged in successfully", res);

});
export const logout= catchAsyncErrors((req, res, next)=>{
    res.status(200).cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    .json({
        success: true,
        message: "user logged out !",
    })
});

export const getMyProfile= catchAsyncErrors((req, res, next)=>{
    const user=req.user;
    res.status(200).json({
        succes:true,
        user,
    });
});
export const getAllUsers= catchAsyncErrors(async(req, res, next)=>{
    const Alluser= await User.find({User});
    res.status(200).json({
        succes:true,
        Alluser,
    });
});
