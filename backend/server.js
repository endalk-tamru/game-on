import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import likePostRoutes from "./routes/likePostRoutes.js";
import commentPostRoutes from "./routes/commentPostRoutes.js";

const PORT = process.env.PORT || 5000;

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likePostRoutes);
app.use("/api/comments", commentPostRoutes);

app.get("/health", (req, res) => res.status(200).json({ message: "Okay!" }));

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
