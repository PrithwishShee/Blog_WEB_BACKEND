import { response } from "express";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.middlewares.js";
import ErrorHandler from "../middlewares/errors.middlewares.js";
import { Blog } from "../models/blogSchema.models.js";
import cloudinary from "cloudinary";
// import blogSchema from "../models/blogSchema.models.js"

export const blogPost= catchAsyncErrors(async(req, res, next)=>{
    if(!req.files||Object.keys(req.files).length===0){
        return (new ErrorHandler("Blog Main image is mandatory", 400));
    }
    const {mainImage,paraOneImage,paraTwoImage,paraThreeImage}=req.files;
    if(!mainImage){
        return next(new ErrorHandler("Blog Main image is mandator",400));
    }
    const allowedFormats = ["image/png","image/jpeg","image/webp"];
    if(
        !allowedFormats.includes(mainImage.mimetype)||
        (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
        (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype)) ||
        (paraThreeImage && !allowedFormats.includes(paraThreeImage.mimetype))
    ){
        return next(new ErrorHandler("Invalid File type. Only jpeg, png, webp formats are allowed", 400));
    }
    const {title,intro,paraOneDescription,paraTwoDescription,paraThreeDescription, category, published}=req.body;

    const createdBy=req.user.id;
    const authorName=req.user.name;
    const authorAvatar=req.user.url;
    

    if(!title||!category||!intro){
        return next( new ErrorHandler("Title, Intro and category are required fields",400));
    }

    const uploadPromise=[
        cloudinary.uploader.upload(mainImage.tempFilePath),
        paraOneImage? cloudinary.uploader.upload(paraOneImage.tempFilePath): Promise.resolve(null),
        paraTwoImage? cloudinary.uploader.upload(paraTwoImage.tempFilePath): Promise.resolve(null),
        paraThreeImage? cloudinary.uploader.upload(paraThreeImage.tempFilePath): Promise.resolve(null),
    ];

    const [mainImageRes, paraOneImageRes, paraTwoImageRes, paraThreeImageRes]= await Promise.all(uploadPromise);
    if(!mainImageRes||mainImageRes.error||
        (paraOneImage&&(!paraOneImageRes || paraOneImageRes.error))||
        (paraTwoImage&&(!paraTwoImageRes || paraTwoImageRes.error))||
        (paraThreeImage&&(!paraThreeImageRes || paraThreeImageRes.error))
    ){
        return next(new ErrorHandler("Error occured while uploading one or more images!",500));
    }
    const blogData={
        title,intro,paraOneDescription,paraTwoDescription,paraThreeDescription, category,createdBy,authorAvatar,authorName,published,
        mainImage:{
            public_id: mainImageRes.public_id,
            url: mainImageRes.secure_url,
        },
    };
    if(paraOneImageRes){
        blogData.paraOneImage={
            public_id: paraOneImageRes.public_id,
            url: paraOneImageRes.secure_url,
        }
    }
    if(paraTwoImageRes){
        blogData.paraTwoImage={
            public_id: paraTwoImageRes.public_id,
            url: paraTwoImageRes.secure_url,
        }
    }
    if(paraThreeImage){
        blogData.paraThreeImage={
            public_id: paraThreeImageRes.public_id,
            url: paraThreeImageRes.secure_url,
        }
    }
    const blog=await Blog.create(blogData);
    res.status(200).json({
        success:true,
        message:"Blog Uploaded!",
        blog,
    });
});

export const deleteBlog=catchAsyncErrors(async(req, res, next)=>{
    const {id}=req.params;
    const blog =await Blog.findById(id);
    if(!blog){
        return next(new ErrorHandler("Blog not found!", 404));
    }
    await blog.deleteOne();
    response.status(200).json({
        success:true,
        message:"Blog successfully removed!!",
    });
});

export const getALlBlogs=catchAsyncErrors(async(req,res, next)=>{
    const allBlogs=await Blog.find({published: true});
    res.status(200).json({
        success:true,
        allBlogs,
    });
});

export const getSingleBlog=catchAsyncErrors(async(req, res, next)=>{
    const{id}=req.params;
    const blog=await Blog.findById(id);
    if(!blog){
        return next(new ErrorHandler("Blog not found!", 404));
    }
    res.status(200).json({
        success:true,
        blog,
    });
});

export const getMyBlogs = catchAsyncErrors(async(req, res, next)=>{
    const createdBy=req.user.__id;
    const blogs=await Blog.find({createdBy});
    res.status(200).json({
        success:true,
        blogs,
    });
});


export const updateBlog= catchAsyncErrors(async(req, res, next)=>{
    const {id}=req.params;
    let blog=await Blog.findById(id);
    if(!blog){
        return next(new ErrorHandler("Blog Not Found",400));
    }
    const newBlogData={
        title:req.body.title,
        intro:req.body.intro,
        category:req.body.category,
        paraOneDescription:req.body.paraOneDescription,
        paraTwoDescription:req.body.paraTwoDescription,
        paraThreeDescription:req.body.paraThreeDescription,
        published: req.body.published,
    };
    if(req.files){
        const {mainImage,paraOneImage, paraTwoImage, paraThreeImage}=req.files;
        const allowedFormats = ["image/png","image/jpeg","image/webp"];
        if((mainImage&&!allowedFormats.includes(mainImage.mimetype))||
        (paraOneImage&&!allowedFormats.includes(paraOneImage.mimetype))||
        (paraTwoImage&&!allowedFormats.includes(paraTwoImage.mimetype))||
        (paraThreeImage&&!allowedFormats.includes(paraThreeImage.mimetype)) 
        ){
            return next(new ErrorHandler("Invalid File Format",400));
        }
        if(req.files &&mainImage){
            const blogMainImageId=blog.mainImage.public_id;
            await cloudinary.uploader.destroy(blogMainImageId);
            const newBlogMainImage= await cloudinary.uploader.upload(
                mainImage.tempFilePath
            );
            newBlogData.mainImage={
                public_id: newBlogMainImage.public_id,
                url: newBlogMainImage.secure_url,
            };
        }


        if(req.files && paraOneImage){
            if(blog.paraOneImage){
                const blogParaOneImageid= blog.paraOneImage.public_id;
                await cloudinary.uploader.destroy(blogParaOneImageid);
            }
            const newBlogParaOneImage = await cloudinary.uploader.upload(
                paraOneImage.tempFilePath
            );
            newBlogData.paraOneImage={
                public_id: newBlogParaOneImage.public_id,
                url: newBlogParaOneImage.secure_url,
            };
        }


        if(req.files && paraTwoImage){
            if(blog.paraTwoImage){
                const blogParaTwoImageid= blog.paraTwoImage.public_id;
                await cloudinary.uploader.destroy(blogParaTwoImageid);
            }
            const newBlogParaTwoImage = await cloudinary.uploader.upload(
                paraTwoImage.tempFilePath
            );
            newBlogData.paraTwoImage={
                public_id: newBlogParaTwoImage.public_id,
                url: newBlogParaTwoImage.secure_url,
            };
        }


        if(req.files && paraThreeImage){
            if(blog.paraThreeImage){
                const blogParaThreeImageid= blog.paraOneImage.public_id;
                await cloudinary.uploader.destroy(blogParaThreeImageid);
            }
            const newBlogParaThreeImage = await cloudinary.uploader.upload(
                paraThreeImage.tempFilePath
            );
            newBlogData.paraThreeImage={
                public_id: newBlogParaThreeImage.public_id,
                url: newBlogParaThreeImage.secure_url,
            };
        }
    }
    blog=await Blog.findByIdAndUpdate(id, newBlogData,{
        new: true,
        runValidators:true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Blog Updated!",
        blog,
    });
});

