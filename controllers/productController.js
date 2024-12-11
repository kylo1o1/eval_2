const Products = require("../models/productSchema")
const User = require("../models/userSchema")
const fs = require('fs')

exports.registerProduct = async (req,res) => {

    const { name,   category,   description,    price , quantity} = req.body

    const {id} = req

    if( !name ||    !category ||    !description ||     !price){
        return res.status(400).json({
            success:false,
            message:"Please Enter Products Details"
        })
    }

    try {
        

        const user_name = await User.findById(id)
    

        const product_ = await Products.create({
            name,
            category,
            description,
            price,
            quantity,
            addedBy:user_name.fullname,
            uid:id
            
        })

        product_.Images = req.files.map((e)=>{
            return e.path
        })
        
        await product_.save()

        return res.status(201).json({
            success:true,
            message:"Product Added  !"
        })

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })
    }

}

exports.viewProducts = async (req,res) => {
    
    try {
       
        const products = await Products.find().select("-uid")

        if(!products){
            return res.status(404).json({
                success:false,
                message:"No Products Found"
            })
        }

        return res.status(200).json({
            success:true,
            products
        })

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:error.message || "Internal Error"
            })
    }
}

exports.updateProduct = async (req,res) => {
    
    const {prodid} = req.params
    const {name , category, description,    price,  quantity } = req.body


    
    try {
    
        const _product = await Products.findById(prodid )

        if(!_product){
            return res.status(404).json({
                success:false,
                message:"Product not Found"
            })
        }

        if( req.role === 'seller' && req.id !== _product.uid){
            return res.status(403).json({
                success:false,
                message:"unauthorized Access"
            })
        }

        if(name) _product.name = name
        if(category) _product.category = category
        if(description) _product.description = description
        if(price) _product.price = price
        if(quantity) _product.quantity = quantity

        if(req.files){
            req.files.forEach(file => {
                _product.Images.push(file.path)
            });
        }

        _product.save()

        return res.status(200).json({
            success:true,
            message:"Product Updated !!"
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || "internal error"
        })
    }

}


exports.    productImage = async (req,res) => {
    const {prodid , index} = req.params
    try {
        
        const _product = await Products.findById(prodid)
        

        if(!_product){
            return res.status(200).json({
                success:false,
                message:"Product not found"
            })
        }

        if(req.role === 'seller' && req.id === _product.uid  ){
            return res.status(403).json({
                success:false,
                message:"Unauthorized Access"
            })
        }

            if(fs.existsSync(_product.Images[index])){
                fs.unlinkSync(_product.Images[index])
                if(req.file){
                    _product.Images[index] = req?.file?.path
                }else{
                    _product.Images.splice(index,1)
                }
        }

        _product.save()

        return res.status(200).json({
            success:true,
            message:"Product Image Updated"
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || "internal Error"
        })
    }
}

exports.deleteProduct = async (req,res) => {
    
    const {prodid} = req.params
    
    

    try {
    
         const _product = await Products.findById(prodid)
         if(!_product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            })
         }   

         if(req.role === 'seller' && req.id !== _product.uid){
            return res.status(403).json({
                success:false,
                message:"Unauthorized Access"
            })
         }

         if(_product.Images){
            _product.Images.forEach(path => {
                if(fs.existsSync(path)){
                    fs.unlinkSync(path)
                }
            });
         }

         await Products.findByIdAndDelete(prodid)

         return res.status(200).json({
            success:true,
            message:"Product Deleted !!"
         })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message || "internal Error"
        })
    }
}