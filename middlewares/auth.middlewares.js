import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.middlewares.js";
import { User } from "../models/userScherma.models.js";
import ErrorHandler from "../middlewares/errors.middlewares.js"
import jwt from 'jsonwebtoken'

//AUTHENTICATION
export const isAuthenticated = catchAsyncErrors(async(req, res, next)=>{
    const{ token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("User is not authenticated", 400));
    }
    const decoded= await jwt.verify(token, process.env.JWT_SECRET_KEY);
   
    req.user = await User.findById(decoded.id);
    next();
});
