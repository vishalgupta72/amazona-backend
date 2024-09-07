const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const CartModel = mongoose.model("CartModel");
const OrderModel = mongoose.model("OrderModel");
const ProductModel = mongoose.model("ProductModel");
const protectedRoute = require("../middleware/protectedResource");

// product search handler
router.get("/search", (req, res) => {
    const query = req.query.s;
    console.log(query);
    ProductModel.find({ name: { $regex: query, $options: "i" } })
        .populate("name", "_id name")
        .limit(5)
        .then((dbEntrys) => {
            res.status(200).json({ entrys: dbEntrys })
        })
        .catch((error) => {
            console.log(error);
        })
})


router.get("/products", (req, res) => {
    ProductModel.find()
        .then((dbEntrys) => {
            res.status(200).json({ entrys: dbEntrys })
        })
        .catch((error) => {
            console.log(error);
        })
})

router.get("/products/:id", (req, res) => {
    const { id } = req.params;
    ProductModel.findOne({ _id: id })
        .then((dbEntrys) => {
            res.status(200).json({ entry: dbEntrys })
        })
        .catch((error) => {
            console.log(error);
        })
})
router.post("/add-review/:id", protectedRoute, (req, res) => {
    const { id } = req.params;

    const { comment, rating } = req.body;
    if (!comment || !rating) {
        res.status(200).json({ status: "error", message: "missing fields" });
        return;
    }

    ProductModel.findOne({ _id: id })
        .then((product) => {
            if (!product.reviews)
                product.reviews = []

            product.reviews.push({ comment, rating, name: req.user.firstName + " " + req.user.lastName })

            product.save()
            res.status(201).json({ entrys: product.reviews })
        })
        .catch((error) => {
            console.log(error);
        })
})

router.get("/orders", protectedRoute, (req, res) => {

    OrderModel.find(req.user.accountType === "admin" ? {} : { customer: req.user._id })
        .then((dbEntrys) => {
            res.status(200).json({ entrys: dbEntrys })
        })
        .catch((error) => {
            console.log(error);
        })
})

router.get("/orders/:id", protectedRoute, (req, res) => {
    const { id } = req.params;
    OrderModel.findOne(req.user.accountType === "admin" ? { _id: id } : { _id: id, customer: req.user._id })
        .populate("cart.products")
        .populate("customer")
        .then((dbEntrys) => {
            res.status(200).json({ entry: dbEntrys })
        })
        .catch((error) => {
            console.log(error);
        })
    })
    
    router.get("/pay-order/:id", protectedRoute, (req, res) => {
        const { id } = req.params;
        OrderModel.findOne(req.user.accountType === "admin" ? { _id: id } : { _id: id, customer: req.user._id })
        .populate("customer")
        .populate("cart.products")
        .then((dbEntrys) => {
            dbEntrys.paid = true;
            dbEntrys.save()
            res.status(201).json({ entry: dbEntrys, message: "Paid", status: "success" })
        })
        .catch((error) => {
            console.log(error);
        })
})



// create an order entry
router.post("/add-order/", protectedRoute, async (req, res) => {

    const { order } = req.body;

    const orderObj = new OrderModel();

    Object.keys(order).forEach(key => {
        orderObj[key] = order[key]
    })

    orderObj.customer = req.user._id

    orderObj.save()
        .then((newEntry) => {
            res.status(201).json({ entry: newEntry, message: "order created", status: "success" });
        })
        .catch((error) => {
            console.log(error);
        })
})

module.exports = router;