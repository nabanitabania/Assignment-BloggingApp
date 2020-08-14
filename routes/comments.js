var express = require("express");
var router = express.Router();
var Blog = require("../models/blogs");
var Comment = require("../models/comments");
var middleware = require("../middleware/auth");

// comments routes

//NEW
router.get("/blogs/:id/comments/new",middleware.isLoggedIn, function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        if(err)
            console.log(err);
        else
            res.render("comments/new",{data:blog});
    });
});

// Create
router.post("/blogs/:id/comments",function(req,res){
    Blog.findById(req.params.id,function(err,data){
    
        if(err)
            console.log(err);
        else{
            Comment.create(req.body.comments,function(err,comment){
                if(err)
                    console.log(err);
                else
                {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    data.comments.push(comment);
                    data.save();
                    res.redirect("/blogs/"+data._id);
                }
            });
        }
    });
});
//EDIT
router.get("/blogs/:id/comments/:comment_id/edit",middleware.checkcom,(req,res)=>{
    Comment.findById(req.params.comment_id,function(err,comment){
        if(err)
            res.redirect("back");
        else
            res.render("comments/edit",{data_id:req.params.id,comment:comment});
    });

    
});
//UPDATE
router.put("/blogs/:id/comments/:comment_id",middleware.checkcom,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comments,function(err,upadte){
        if(err)
            res.redirect("back");
        else
            res.redirect("/blogs/"+req.params.id);
    });
});
//DELETE
router.delete("/blogs/:id/comments/:comment_id",middleware.checkcom,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
            res.redirect("back");
        else
            res.redirect("/blogs/"+req.params.id);
    });
});


module.exports = router;