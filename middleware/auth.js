var Blog = require("../models/blogs");
var Comment = require("../models/comments");
var middlewarObj = {};

middlewarObj.check = function(req,res,next){
    if(req.isAuthenticated())
    {
        Blog.findById(req.params.id,function(err,camp){
            if(camp.author.id.equals(req.user._id))
                next();
            else
                res.redirect("back");
        });
    }
    else
    {
        res.redirect("back");
    }
}

middlewarObj.checkcom = function(req,res,next){
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id,function(err,comment){
            if(comment.author.id.equals(req.user._id))
                next();
            else
                res.redirect("back");
        });
    }
    else
    {
        res.redirect("back");
    }
}

middlewarObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewarObj;