const User = require("../models/userSchema")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const Otp = require("../models/otpSchema")
const sendMail = require("../lib/otpMail")
const emailOtp = require("../lib/otpMail")
const { genToken } = require("../util/tokens")
const fs = require('fs')


exports.register = async (req,res) => {
    const { fullname,   email,  password  } = req.body
    if( !fullname ||    !email ||   !password){
        return res.status(400).json({
            success:false,
            message:"All Fields Are required"
        })
    }

    try {
        
        const hash_password = await bcrypt.hash(password,10)

        

        const user_ = await User.create({
            fullname,
            email,
            password:hash_password,
            profilePicture:req.file.path || null
        })

        return res.status(201).json({
            success:true,
            message:"Account Registered"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || "Internal Error"
        })
    }
}

exports.sendOtp = async (req,res) => {
    const { email, password  } = req.body

    if(!email ||    !password){
        return res.status(400).json({
            success:false,
            message:"Enter all Fields"
        })
    }

    try {
        
        const _user = await User.findOne({email})

        if(!_user){
            return res.status(404).json({
                success:false,
                message:"No Account Found"
            })
        }

        const isMatch = bcrypt.compare(password,_user.password)

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid Email or Password"
            })
        }

        const otp = crypto.randomInt(1000,9999).toString()

        await Otp.findOneAndUpdate({email},
            {otp,createdAt:Date.now()},
            {upsert:true}
        )


        emailOtp(email,otp)
        return res.status(200).json({
            success:true,
            message:"An Otp has been sent to your email"
        })


    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })
    }
}

exports.verifyOtp = async (req,res) => {
    
    const {email,   otp} = req.body

    if(!email ||    !otp){
        return res.status(400).json({
            success:false,
            message:"Please enter email and otp"
        })
    }

    try {
        
        const record = await Otp.findOne({email})

        if(!record){
            return res.status(404).json({
                success:false,
                message:"OTP expired"
            })
        }

        if(record.otp !== otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }
        
        const _user = await User.findOne({email})

        const ns = {
            id  :  _user._id ,
            fullname    :   _user.fullname,
            email   :   _user.email,
            role    :   _user.role,
            pfp     :   _user.profilePicture
        }
        req.user = ns
        
        genToken(req,res)

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })       
    }
}

exports.viewProfile = async (req,res) => {
    
    const {uid} = req.params
    if(!uid) {
        return res.status(404).json({
            success:false,
            message:"User not found id"
        })
    }

    try {
        
        const user =  await User.findById(uid,)
        
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const user_ ={
            id : user._id,
            fullname : user.fullname,
            email   : user.email,
            role    :   user.role,
            pfp     : user.profilePicture
        }

        return res.status(200).json({
            success:true,
            user_
        })



    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })   
    }
}

exports.updateProfile = async (req,res) => {
    const {fullname , email} = req.body
    const {  uid  } = req.params
    
    
    try {
        
        const _user = await User.findById(uid)

        if(!_user) {
            return res.status(404).json({
                success:false,
                message:"No user found"
            })
        }

        if(fullname) _user.fullname = fullname;
        if(email) _user.email = email;

        if(req.file){
            const _path = _user.profilePicture
            const {path} = req.file

            if(fs.existsSync(_path)){
                fs.unlinkSync(_path)
                _user.profilePicture = path
            }
        }

        await _user.save()

        return res.status(200).json({
            success:true,
            message:"Profile Updated !"
        })


    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })
    }

}

exports.deleteProfile = async (req,res) => {
    
    const {uid} = req.params

    try {
        
        const _user = await User.findById(uid)

        if(!_user){
            return res.status(404).json({
                success:false,
                message:"No Account found"
            })
        }

        if(fs.existsSync(_user.profilePicture)){
            fs.unlinkSync(_user.profilePicture)
        }

        await User.findByIdAndDelete(uid)

        return res.status(200).json({
            success:true,
            message:"Profile Deleted"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || "Internal Error"
        })        
    }
}


exports.admin_viewAllUsers = async (req,res) => {
    
    try {
        

        const users = await User.find({role:'user',}).select('-password')

        if(!users){
            return res.status(404).json({
                success:false,
                message:"No users Found"
            })
        }

        return res.status(200).json({
            success:false,
            users
        })

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })        
    }


}


// return res.status(500).json({
//     success:false,
//     message:error.message || "Internal Error"
// })