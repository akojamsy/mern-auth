import express from "express";
import dotenv from "dotenv";
dotenv.config();
import userRoute from "../backend/routes/userRoute.js";
import { errorHandler, NotFound } from "./middleware/errorMiddleware.js";
import dbConnection from "./config/db.js";
import cookieParser from "cookie-parser";

dbConnection();
const port = process.env.PORT || 5000;

// built in middleware/library
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app routes
app.use("/api/users", userRoute);

// custom middleware
app.use(NotFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
