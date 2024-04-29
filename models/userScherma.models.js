import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minLenght:[3, "Name Must Content At least 3 characters"],
        maxLenght:[32, "Name Must Content max 32 characters"],
    },
    email:{
        type:String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid emaill !"],
    },
    phone:{
        type:Number,
        required: true,
    },
    avatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },

    },
    education:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
        minLenght:[6, "Password Must Content At least 3 characters"],
        maxLenght:[32, "Password Must Content max 32 characters"],
        select: false,
    },
    createdOn:{
        type:String,
        default: Date.now,

    }
});

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
});



userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getJWTToken =  function(){

    return jwt.sign({is: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES,
    });

};

export const User= mongoose.model("User", userSchema);