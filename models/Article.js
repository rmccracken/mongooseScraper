var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
 
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  
  link: {
    type: String,
    required: true
  },
 
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});


var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
