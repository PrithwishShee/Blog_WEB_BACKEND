import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        minLenght:[10, "Your blog Must Content At least 10 characters"],
        maxLenght:[100, "Your blog shouldn't Content more than 100 characters"],
    },
    mainImage:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
    },
    intro:{
        type:String,
        required: true,
        minLenght:[200, "Your intro Must Content At least 200 characters"],
       
    },
    paraOneImage:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
    },
    paraOneDescription:{
        type:String,
        required: true,
        minLenght:[100, "Your 1st paragraph Must Content At least 100 characters"],
    },



    paraTwoImage:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
    },
    paraTwoDescription:{
        type:String,
        required: true,
        minLenght:[100, "Your 1st paragraph Must Content At least 100 characters"],
    },



    paraThreeImage:{
        public_id:{
            type: String,
            required: true,
        },
        url:{
            type: String,
            required: true,
        },
    },
    paraThreeDescription:{
        type:String,
        required: true,
        minLenght:[100, "Your 1st paragraph Must Content At least 100 characters"],
    },

    category:{
        type:String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },

    authorName:{
        type:String,
        required: true,
    },

    authorAvatar:{
        type:String,
        required: true,
    },
    published:{
        type: Boolean,
        default: false,
    },

});

export const Blog = mongoose.model("Blog", blogSchema);