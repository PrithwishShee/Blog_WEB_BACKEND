import express from "express";
import { blogPost, deleteBlog, getALlBlogs, getMyBlogs, getSingleBlog, updateBlog } from "../controller/blogController.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const router = express.Router()

router.post('/post',isAuthenticated, blogPost);
router.delete('/delete/:id',isAuthenticated, deleteBlog);
router.get("/all", getALlBlogs);
router.get("/singleblog/:id",isAuthenticated, getSingleBlog);
router.get("/myblogs",isAuthenticated, getMyBlogs);
router.get("/update/:id",isAuthenticated, updateBlog);
export default router;