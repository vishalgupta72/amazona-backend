const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    brand: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    available: {
        type: Boolean,
        require: true,
        default: true
    },
    quantity: {
        type: Number,
        require: true
    },
    reviews: [{
        name: {
            type: String,
            require: true
        },
        date: {
            type: Date,
            default: Date.now,
            require: true
        },
        comment: {
            type: String,
            require: false
        },
        rating: {
            type: Number,
            require: true
        }
    }],
    seller: {
        type: ObjectId,
        ref: "UserModel"
    },
    category: {
        type: String,
        require: true,
        default: "accessories"
    }
})


mongoose.model("ProductModel", productSchema);
