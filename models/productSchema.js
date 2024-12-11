const { default: mongoose } = require("mongoose");


const schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter Products Name"]
    },
    category:{
        type:String,
        required:[true,"Enter Products category"]
    },
    description:{
        type:String,
        required:[true,"Enter Products description"]
    },
    price:{
        type:String,
        required:[true,"Enter Products price"]
    },
    quantity:{
        type:String,
        required:[true,"Enter Products Quantity"]
    },
    Images:{
        type:[String],
    },
    addedBy:{
        type:String,
        required: [true,"seller or Admin ID required"]
    },
    uid:{
        type:String,
        required: [true,"seller or Admin ID required"]   
    }
})

const Products = mongoose.model('Product',schema)

module.exports = Products