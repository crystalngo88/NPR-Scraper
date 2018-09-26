var cheerio = require("cheerio");
var request = require("request");

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

        // console.log('outside titleText', titleText)
        // console.log('outside href', href)
        // console.log('outside teaserText', teaserText)

        if (titleText && href && teaserText) {
            results.push({
                title: titleText,
                link: href,
                teaser: teaserText,
            })
        }

    });
    console.log(results);
})