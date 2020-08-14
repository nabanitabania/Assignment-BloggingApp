var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var middleware = require("../middleware/auth");
const cryptoRandomString = require('crypto-random-string');

//INDEX
router.get("/blogs",function(req,res){

    Blog.find({},function(err,allBlogs){ //finding from the data base and showing up in the page
        if(err)
            console.log(err);
        else
            res.render("blogs/blog",{data:allBlogs, user:req.user});
    });
});

router.get("/blogs/shared/:string",function(req,res){
    Blog.findOne({share: req.params.string},function(err,blog){
        if(err)
            console.log(err);
        else
        {
            console.log(blog);
            res.render("blogs/show",{data:blog});
        }
            
    })
})

//CREATE
router.post("/blogs",middleware.isLoggedIn,function(req,res){
    var name = req.body.title;
    var url = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var share = cryptoRandomString({length: 50});
    var newCamp = {title:name,image:url,description:desc,share:share,author:author};
    Blog.create(newCamp,function(err,newlycreate){
        if(err)
            console.log(err);
        else
        {
            res.redirect("/blogs");
        }

    });

});

//NEW
router.get("/blogs/new",middleware.isLoggedIn,function(req,res){
    res.render("blogs/new");
});

//SHOW
router.get("/blogs/:id",function(req,res){

    Blog.findById(req.params.id).populate("comments").exec(function(err,blog){
        if(err)
            console.log(err);
        res.render("blogs/show",{data:blog});
    });

});

//EDIT
router.get("/blogs/:id/edit",middleware.check,function(req,res){

    Blog.findById(req.params.id,function(err,blog){
        res.render("blogs/edit",{blog:blog});
    });
});

//UPDATE
router.put("/blogs/:id",middleware.check,function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,camp){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/"+req.params.id);
    });
});

//DELETE
router.delete("/blogs/:id",middleware.check,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,camp){
        res.redirect("/blogs");
    });
});

module.exports = router;
