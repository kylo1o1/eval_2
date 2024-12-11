const { Router  }   =   require('express')
const { authenticate, authorize } = require('../middlewares/auths')
const { registerProduct, viewProducts, productImage, updateProduct, deleteProduct } = require('../controllers/productController')
const uploadProductImage = require('../middlewares/productMulter')
const productRoute =    Router()


productRoute.route('/addProduct').post(authenticate,authorize('admin','seller'),uploadProductImage.array('product_image'),registerProduct)
productRoute.route('/viewProducts').get(authenticate,viewProducts)
productRoute.route('/:prodid')
            .put(authenticate,authorize('admin','seller'),uploadProductImage.array('product_image'),updateProduct)
            .delete(authenticate,authorize('admin','sellet'),deleteProduct)

productRoute.route('/productImage/:prodid&:index').put(authenticate,authorize('admin','seller'),uploadProductImage.single('product_image'),productImage)

module.exports  = productRoute