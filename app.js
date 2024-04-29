import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {dbConnection} from './database/dbConnection.database.js';
import { errorMiddleware } from "./middlewares/errors.middlewares.js";
import userRouter from "../Backend/routes/userRouter.routes.js";
import fileUpload from "express-fileupload";
import blogRouter from "./routes/blogRouter.routes.js";
const app = express();
dotenv.config({path:'./config/config.env'});

app.use(
    cors({
        origin:["http://localhost:4000"],
        method:["GET", "PUT", "DELETE", "POST"],
        Credentials:true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(fileUpload({
    useTempFiles:true,

    tempFileDir:"/tmp/",
}));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/blog", blogRouter);

dbConnection();


app.use(errorMiddleware);


export default app;