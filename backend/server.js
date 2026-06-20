import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);

app.get("/",(req,res)=>{

  res.send("AI Interview Backend Running")
})

app.use(errorMiddleware);
const PORT = process.env.PORT || 8000 ;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})


