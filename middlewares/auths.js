
const jwt  =   require('jsonwebtoken')

exports.authenticate = async (req,res,next) => {
    const {token} = req.cookies
    if(!token){
        return res.status(400).json({
            success:false,
            message:"Session expired"
        })
    }

    try {
        
        jwt.verify(token,process.env.SECRET_KEY,(error,decode)=>{
            if(error){
                return res.status(400).json({
                    success:false,
                    message:error.message 
                })
            }
            req.id = decode.id
            req.role = decode.role
            next()
        })


    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })
    }
}

exports.authorize =  (...authRoles) => {
  
        return (req,res,next)=>{
        
            const {role} = req
      
                if(!authRoles.includes(role) ){
                    return res.status(403).json({
                        success:false,
                        message:"unauthorized Access"
                    })
                }
                next()
                
            
        }
    
}