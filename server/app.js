import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";

const app = express();

// basic configuration
app.use(cookieParser());
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))

// cors configuration 
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}))

app.get('/',(req,res)=>{
    res.send("Hey Welcome to Campus-prep")
})

//rest routes here
app.use("/api/auth", authRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/materials", materialRoutes);

export default app;