const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProductModel = mongoose.model("ProductModel");
const protectedRoute = require("../middleware/protectedResource");


router.post("/create-product", protectedRoute, (req, res) => {
    const { name, image, brand, price, description, available, quantity, category } = req.body;

    if (!name || !image || !brand || !price || !description || !quantity) {
        return res.status(400).json({ status: "error", message: "All fields are required" });
    }

    const product = new ProductModel({
        name,
        image,
        brand,
        price,
        description,
        available: available !== undefined ? available : true,
        quantity,
        category: category || "accessories",
        seller: req.user._id
    });

    product.save()
        .then((newProduct) => {
            res.status(201).json({ entry: newProduct, message: "Product created successfully", status: "success" });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ status: "error", message: "Failed to create product" });
        });
});


module.exports = router;