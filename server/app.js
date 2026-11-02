import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser"

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


export default app;