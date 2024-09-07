const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    cart: {
        products: [{
            type: ObjectId,
            ref: "ProductModel",
            require: true
        }],
        subTotal: {
            type: Number,
            require: true
        }
    },
    total: {
        type: Number,
        require: true
    },
    tax: {
        type: Number,
        require: true
    },
    customer: {
        type: ObjectId,
        ref: "UserModel"
    },
    shippingDetails: {
        fullName: {
            type: String,
            require: true
        },
        address: {
            type: String,
            require: true
        },
        city: {
            type: String,
            require: true
        },
        pincode: {
            type: Number,
            require: true
        },
        phone: {
            type: Number,
            require: true
        },
        country: {
            type: String,
            require: true
        }

    },
    paymentMode: {
        type: String,
        require: true
    },
    paid: {
        type: Boolean,
        require: true,
        default: false
    },
    date: {
        type: Date,
        require: true,
        default: Date.now
    },
    delivered: {
        type: Boolean,
        require: true,
        default: false
    },
    checkout: {
        type: Boolean,
        require: true,
        default: false
    }
})


mongoose.model("OrderModel", orderSchema);