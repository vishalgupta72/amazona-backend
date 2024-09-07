const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
const protectedRoute = require("../middleware/protectedResource");
var bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config')


//  user signup
router.post("/signup", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !password || !email) {
        return res.status(400).json({ message: "One or more mandatory field are empty", status: "error" });
    }

    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (userInDB) {
                console.log(userInDB);
                return res.status(500).json({ message: "User with this email already registered", status: "error" });
            }
            bcryptjs.hash(password, 16)
                .then((hashedPassword) => {
                    const user = new UserModel({ firstName, lastName, email, password: hashedPassword });
                    user.save()
                        .then((newUser) => {
                            res.status(201).json({ message: "User signed up Successgfully", status: "success" });
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
        })
        .catch((err) => {
            console.log(err)
        })

})





//  user signin
router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ message: "One or more mandatory field are empty", status: "error" });
    }

    UserModel.findOne({ email: email })
        .then((userInDB) => {
            if (!userInDB) {
                return res.status(401).json({ message: "Invalid Creadentials", status: "error" });
            }
            bcryptjs.compare(password, userInDB.password)
                .then((didMatch) => {
                    if (didMatch) {
                        const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
                        const userInfo = { "_id": userInDB._id, "email": userInDB.email, "firstName": userInDB.firstName };

                        res.status(200).json({ token: jwtToken, user: userInfo, message: "User logged in Successgfully", status: "success" });
                    } else {
                        return res.status(401).json({ message: "Invalid Creadentials", status: "error" });
                    }
                })
        })
        .catch((err) => {
            console.log(err)
        })
})
router.get("/user", protectedRoute, (req, res) => {
    return res.status(200).json({ user: req.user });
})




module.exports = router;