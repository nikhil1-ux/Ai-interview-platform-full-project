import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use(cookieParser());
app.use("/api/v1/auth", authRoutes);

app.get("/",(req,res)=>{

  res.send("AI Interview Backend Running")
})

app.use(errorMiddleware);
const PORT = process.env.PORT || 8000 ;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})


