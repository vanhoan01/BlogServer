const express = require("express");
const config = require("../config");
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const middleware = require("../middleware");

const router = express.Router();

router.route("/:username").get(middleware.checkToken, (req, res) => {
    User.findOne(
        {username: req.params.username},
        (err, result) => {
            if(err) return res.status(500).json({msg: err});
            res.json({
                data: result,
                username: req.params.username,
            });
        }
    );
});

router.route("/login").post((req, res) => {
    User.findOne(
        {username: req.body.username},
        (err, result) => {
            if(err) return res.status(500).json({msg: err});
            if(result===null){
                res.status(403).json("Either Username incorrect");
            }
            if(result.password == req.body.password)
            {
                let token = jwt.sign({username: req.body.username}, config.key, {
                    expiresIn: "24h"
                });
                res.json({
                    token: token,
                    "msg": "success"
                });
            }
            else{
                res.status(403).json("password is incorrect");
            }
        }
    );
});

router.route("/register").post((req, res) => {
    console.log("inside the register");
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
    });
    user
        .save()
        .then(() => {
            console.log("user registered");
            res.status(200).json("ok");
        }).catch((err) => {
            res.status(403).json({msg:err});
        });
});

router.route("/update/:username").patch(middleware.checkToken, (req, res) => {
    User.findOneAndUpdate(
        {username: req.params.username},
        {$set: {password: req.body.password}},
        (err, result) => {
            if(err) return res.status(500).json({msg: err});
            const msg = {
                msg: "password successfully updated",
                username: req.params.username,
            };
            return res.json(msg);
        }
    );
});

router.route("/delete/:username").delete(middleware.checkToken, (req, res) => {
    User.findOneAndDelete({username: req.params.username}, (err, result) => {
        if(err) return res.status(500).json({msg:err});
        const msg = {
            msg: "User deleted",
            username: req.params.username,
        };
        return res.json(msg);
    });
});

module.exports = router;