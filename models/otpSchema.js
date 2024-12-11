const { default: mongoose } = require("mongoose");


const schema  = new mongoose.Schema({
    email:{
        type:String,
        require:[true,"Email is Required"]
    },
    otp:{
        type:String,
        required:[true,"otp is required"]
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:60

    }
})

const Otp = mongoose.model('otp',schema)

module.exports = Otp
