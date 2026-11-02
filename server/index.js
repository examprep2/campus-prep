import dotenv from 'dotenv';
import  connectDB  from './config/db.js';
import app from './app.js'


dotenv.config({
    path:"./.env"
}); 

const port = process.env.PORT || 5000

// Data base connection 
connectDB() // when the db is connected then only we listen.
.then(()=>{
    app.listen(port,()=>{
    console.log("Listening at http://localhost:5000")
})
})
.catch((err)=>{
    console.error("Mongo connection error",err);
    process.exit(1)
})

