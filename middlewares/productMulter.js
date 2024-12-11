const multer = require("multer");
const { diskStorage } = require("multer");

const storage = diskStorage({
    destination:(res,file,cb)=>{
        cb(null,    './Uploads/product_Images')
    },
    filename:(res,file,cb)=>{

        const uq = Math.round(Math.random() * 1E9)

        cb(null, file.fieldname + "_" + uq + "_" + file.originalname)

    }
})

const uploadProductImage = multer({storage})

module.exports = uploadProductImage