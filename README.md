# NPR-Scraper

# Things that work
When scraped, it is pulling the most recent 2 articles with the correct title, link, and teaser text. These are added to the database and are displayed on localhost:8080 with a limit of 10. Each time NPR is scraped, the articles are added to the db, but currently it is the same 2 articles over and over. 

When an article is clicked, a note feature shows up at the bottom where the user can write/store a note about the article

At a previous point in time, the code was able to scrape 41+ articles from NPR but something must have changed on NPR's side because now it isn't able to scrape more than 2 at a time. It's not clear to me what changed in my own code.

# Things that don't work
Scraped articles do not display on HTML page
Notes feature won't work as a modal nor show on the right side of the page, only shows at the bottom which is inefficient
Styling is not aesthetically pleasing
Cannot deploy to Heroku


