const app = require("./app");
const env = require('dotenv');
const { dbConnect } = require("./connection");

env.config()
dbConnect()

app.use((err,req,res,next)=>{
    res.status(500).json({
        error:err.message 
    })
})

app.listen(process.env.PORT,()=>{
    console.log('Server Running ....')
})