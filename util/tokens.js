const jwt = require("jsonwebtoken")

exports.genToken = async (req,res) => {
    const {id,role} = req.user

    try {
        const op ={
            id,
            role,
            time:Date.now()
        }

        const token = jwt.sign(op,process.env.SECRET_KEY,{expiresIn:'30m'})

        if(!token){
            return res.status(500).json({
                success:false,
                message:"Login Failed"
            })
        }

        return res.status(200).cookie('token',token).json({
            success:true,
            message:"Login Successfull"
        })

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })
    }
}