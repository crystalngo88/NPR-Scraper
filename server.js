var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 8080;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

//change path???//
mongoose.connect("mongodb://localhost/", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
    axios.get("http://www.npr.org").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".story-text").each(function (i, element) {
            // var result = {};

            // result.title = $(this).find('.title')[0];
            // result.link = $(this).find('a')[1];
            // result.teaser = $(this).find('.teaser');

            var title = $(element).find('.title')[0];
            var titleText = title.children[0].data;

            var link = $(element).find('a')[1];
            var href = '';
            if (link && link.attribs && link.attribs.href) {
                href = link.attribs.href;
            }

            var teasers = $(element).find('.teaser');
            var teaser = teasers[0];
            var teaserText = '';
            if (teaser && teaser.children && teaser.children[0]) {
                teaserText = teaser.children[0].data;
            }

            if (titleText && href && teaserText) {
                var result = {
                    title: titleText,
                    link: href,
                    teaser: teaserText,
                };
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log("dbArticles: ", dbArticle);
                    })
                    .catch(function (err) {
                        console.log('encountered error in db.Article.create');
                        return res.json(err);
                    });
                res.send("Scrape Complete");
            }
        });
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


// var title = $(element).find('.title')[0];
// var titleText = title.children[0].data;

// var link = $(element).find('a')[1];
// var href = '';
// if (link && link.attribs && link.attribs.href) {
//     href = link.attribs.href;
// }

// var teasers = $(element).find('.teaser');
// var teaser = teasers[0];
// var teaserText = '';
// if (teaser && teaser.children && teaser.children[0]) {
//     teaserText = teaser.children[0].data;
// }

// if (titleText && href && teaserText) {
//     dbscrapedData.insert({
//         title: titleText,
//         link: href,
//         teaser: teaserText,
//     },
//         function (err, inserted) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(inserted)
//             }
//         });
// }

// var mongojs = require("mongojs");
// var request = require("request");


// var databaseUrl = "scraper";
// var collections = ["scrapedData"];

// var db = mongojs(databaseUrl, collections);
// db.on("error", function (error) {
//     console.log("Database Error: ", error);
// });

// app.get("/", function (req, res) {
//     res.send("Hulloooooo");
// });

// app.get("/all", function (req, res) {
//     db.scrapedData.find({}, function (error, found) {
//         if (error) {
//             console.log(error)
//         } else {
//             res.json(found);
//         }
//     });
// });

// app.get("/scrape", function (req, res) {

//     console.log("\n********************************\n" + "Grabbing headlines from NPR.org" + "\n********************************\n");

//     request("https://www.npr.org/", function (error, response, html) {
//         var $ = cheerio.load(html);
//         var results = [];

//     });
//     res.send("Scrape Complete");
// });
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!")
});
// console.log(dbArticle);