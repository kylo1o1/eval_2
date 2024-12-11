const { createTransport } = require("nodemailer");
const env = require('dotenv')
env.config()


const transport = createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EMAIL_PASSWORD
    }
})

const emailOtp = (email,otp)=> new Promise((resolve, reject) => {
    transport.sendMail({
        from:process.env.EMAIL,
        to:`${email}`,
        subject:"OTP Verification Process",
        text:`YOUR OTP IS ${otp}`
    },(err,response)=>{
        if(err){
            reject(err)
        }
        resolve(response)
    })
})
module.exports = emailOtp