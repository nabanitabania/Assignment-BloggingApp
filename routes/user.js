var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


//INDEX
router.get("/",function(req,res){
    res.redirect("/blogs");
});

//Auth routes-========
//sign up===============
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err)
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/blogs");
        });
            
    });
});

//login===================
router.get("/login",function(req,res){
    res.render("login");
});

router.post("/login",passport.authenticate("local",
{
    successRedirect: "/blogs",
    failureRedirect: "/login"
}),function(req,res){

});

//logout===============
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/blogs");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;