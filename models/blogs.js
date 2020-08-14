var mongoose = require("mongoose");
               require('mongoose-type-url');
 
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   description: String,
   created_at    : { type: Date, required: true, default: Date.now },
   share : String,
   author: {
      id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
  },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Blog", blogSchema);



