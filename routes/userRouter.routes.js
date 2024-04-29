import { getAllUsers, getMyProfile, login, logout, register } from "../controller/userController.controllers.js";
import express, { Router } from 'express';
import { isAuthenticated } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.get("/test",(req,res)=>{
    console.log("test")
    })

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated,logout);
router.get("/MyProfile", isAuthenticated,getMyProfile);
router.get("/allusers", getAllUsers);


export default router;