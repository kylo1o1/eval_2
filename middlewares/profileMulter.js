const multer = require("multer");

const storage = multer.diskStorage({
    destination:(res, file,cb)=>{
        cb(null , './Uploads/pfps' )
    },
    filename:(res,file,cb)=>{
        
        const uq = Math.round(Math.random() * 1E9)
        
        cb(null, file.fieldname + "_"   + uq + "_" + file.originalname   )

    }
})

const pfpMulter = multer({storage})

module.exports = pfpMulter