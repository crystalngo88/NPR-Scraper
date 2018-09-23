var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
    console.log("Database Error: ", error);
});

app.get("/", function (req, res) {
    res.send("Hulloooooo");
});

app.get("/all", function (req, res) {
    db.scrapedData.find({}, function (error, found) {
        if (error) {
            console.log(error)
        } else {
            res.json(found);
        }
    });
});

app.get("/scrape", function (req, res) {

    console.log("\n********************************\n" + "Grabbing headlines from NPR.org" + "\n********************************\n");

    request("https://www.npr.org/", function (error, response, html) {
        var $ = cheerio.load(html);
        var results = [];

        $(".story-text").each(function (i, element) {
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
                dbscrapedData.insert({
                    title: titleText,
                    link: href,
                    teaser: teaserText,
                },
                    function (err, inserted) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(inserted)
                        }
                    });
            }
        });
    });
    res.send("Scrape Complete");
});
app.listen(3000, function () {
    console.log("App running on port 3000!")
})
// console.log(dbscrapedData);