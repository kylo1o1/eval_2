const { default: mongoose, Types, mongo } = require("mongoose");


const schema = new mongoose.Schema({
    fullname:{
        type:String,
        required:[true,"Please enter Your Fullname"]
    },
    email:{
        type:String,
        required:[true,"Please enter Your email"]
    },
    password:{
        type:String,
        required:[true,"Please enter Your password"]
    },
    profilePicture:{
        type:String,
    },
    role:{
        type:String,
        default:"user"
    }
})

const User = mongoose.model('user',schema)

module.exports = User