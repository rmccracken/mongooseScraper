const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const request = require("request");
const cheerio = require("cheerio");

const db = require("./models");

const PORT = process.env.PORT || 3000;

const app = express();


app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");



mongoose.Promise = Promise;
mongoose.connect( process.env.MONGODB_URI || "mongodb://localhost/richBizDB", {

});


app.get("/", function(req, res) {
  res.render("index");
});

app.post("/scrape", function(req, res) {

  request("https://richmondbizsense.com/category/news/", function(error, response, html) {

    var $ = cheerio.load(html);

    
    let scrapedArticles = {};
  
    $("article.cf").each(function(i, element) {
      var result = {};

      result.title = $(element).children("header").children("h3").text();
  
      result.link = $(element).children("header").children("h3").children("a").attr("href");
  
      result.summary = $(element).children("section").children("p").text();
        
      scrapedArticles[i] = result;
      
    });

    let articleObject = {
      articles: scrapedArticles
    };
    res.render("index", articleObject);
  console.log(articleObject);
  });
}); 

app.get("/saved", function(req, res) {

  db.Article.find({}, function(err, doc) {

    if (err) {
      console.log(error);
    }
    else {
      let article = {
        articles: doc
      };

      res.render("saved", article);
    }
  });
});

app.post("/save", function(req, res) {
 
  var newArticleObject = {};

  newArticleObject.title = req.body.title;
  newArticleObject.link = req.body.link;
  newArticleObject.summary = req.body.summary;
  console.log(newArticleObject);
  var entry = new db.Article(newArticleObject);


  entry.save(function(err, res) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(res);
    }
  });

  res.redirect("/saved");

});

app.get("/delete/:id", function(req, res) {

  db.Article.findOneAndRemove({"_id": req.params.id}, function (err, offer) {

    res.redirect("/saved");
  });
});

app.get("/notes/:id", function(req, res) {

  db.Note.findOneAndRemove({"_id": req.params.id}, function (err, doc) {
 
    res.send(doc);
  });
});

app.get("/articles/:id", function(req, res) {

  db.Article.findOne({"_id": req.params.id})

  .populate('notes')

  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {

      res.json(doc);
    }
  });
});

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {

  // Create a new note and pass the req.body to the entry
  var newNote = new db.Note(req.body);
  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    } 
    else {
      // Use the article id to find it and then push note
      db.Article.findOneAndUpdate({ "_id": req.params.id }, {$push: {notes: doc._id}}, {new: true, upsert: true})

      .populate('notes')

      .exec(function (err, doc) {
        if (err) {
          console.log("Can't find article.");
        } else {
          res.send(doc);
        }
      });
    }
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
