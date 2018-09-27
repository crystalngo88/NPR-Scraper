$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<b>" + "<p data-id='" + data[i]._id + "'>" + data[i].title + "</b>" + "<br />" + "<a href='" + data[i].link + "'>Link to Article</a>" + "<br />" + data[i].teaser + "</p>");
  }
});

$(document).on("click", "p", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log("dbArticles: ", dbArticle);
                    })

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// $.getJSON("/articles", function (data) {
//     res.JSON(data);
//     for (var i = 0; i < data.length; i++) {

//       var articleDiv = $('<div>');
//       articleDiv.attr('data-id', data[i]._id);
//       articleDiv.attr('class', 'card rounded card-body');

//       var articleTitle = $('<p>');
//       articleTitle.attr('class', 'card-text text-center text-wrap card-header');
//       articleTitle.attr('data-id', data[i]._id);
//       articleTitle.attr('id', data[i].title);
//       articleTitle.text(data[i].title);
//       articleDiv.append(articleTitle);

//       var articleLink = $("<a>");
//       articleLink.attr('href',data[i].link);
//       articleLink.attr('class','btn-danger');
//       articleLink.text("Click here to read article");
//       articleLink.css("font-size", "12px");

//       $(articleTitle).append(articleLink);


//       $("#articles").append(articleDiv);
//     }
//     $("#articleDiv").css("display", "block");
//   })


// function getResults(){
//     $("#results").empty();
//     $.getJSON("/all", function(data){
//         for (var i = 0; i < data.length; i++) {
//             $("#results").prepend("<p class = 'data-entry' data-id = " + data[i]._id + "><span class='dataTitle' data-id" + data[i]._id + ">" + data[i].name + "</span><span class = delete>X</span></p>");
//         }
//     });
// }

// getResults();

// $(document).on("click", "#make-new", function(){
//     $.ajax({
//         type: "POST",
//         dataType: "json",
//         url: "/submit", 
//         data: {
//             name: $("#name").val(),
//             comment: $("#comment").val(),
//             created: Date.now()
//         }
//     })
//     .then(function(data){
//         $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
//         data._id + ">" + data.name + "</span><span class=delete>X</span></p>");
//         $("#comment ").val("");
//       $("#name").val("");
//     });
// });
// $("#clear-all").on("click", function() {
//     // Make an AJAX GET request to delete the comments from the db
//     $.ajax({
//       type: "GET",
//       dataType: "json",
//       url: "/clearall",
//       // On a successful call, clear the #results section
//       success: function(response) {
//         $("#results").empty();
//       }
//     });
//   });
//   $(document).on("click", ".delete", function() {
//     // Save the p tag that encloses the button
//     var selected = $(this).parent();
//     // Make an AJAX GET request to delete the specific comment
//     // this uses the data-id of the p-tag, which is linked to the specific comment
//     $.ajax({
//       type: "GET",
//       url: "/delete/" + selected.attr("data-id"),

//       // On successful call
//       success: function(response) {
//         // Remove the p-tag from the DOM
//         selected.remove();
//         // Clear the comment and title inputs
//         $("#comment").val("");
//         $("#name").val("");
//         // Make sure the #action-button is submit (in case it's update)
//         $("#action-button").html("<button id='make-new'>Submit</button>");
//       }
//     });
//   });
//   $(document).on("click", ".dataTitle", function() {
//     // Grab the element
//     var selected = $(this);
//     // Make an ajax call to find the comment
//     // This uses the data-id of the p-tag, which is linked to the specific comment
//     $.ajax({
//       type: "GET",
//       url: "/find/" + selected.attr("data-id"),
//       success: function(data) {
//         // Fill the inputs with the data that the ajax call collected
//         $("#comment").val(data.comment);
//         $("#name").val(data.name);
//         // Make the #action-button an update button, so user can
//         // Update the comment s/he chooses
//         $("#action-button").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
//       }
//     });
//   });
//   $(document).on("click", "#updater", function() {
//     // Save the selected element
//     var selected = $(this);
//     // Make an AJAX POST request
//     // This uses the data-id of the update button,
//     // which is linked to the specific comment name
//     // that the user clicked before
//     $.ajax({
//       type: "POST",
//       url: "/update/" + selected.attr("data-id"),
//       dataType: "json",
//       data: {
//         name: $("#name").val(),
//         comment: $("#comment").val()
//       },
//       // On successful call
//       success: function(data) {
//         // Clear the inputs
//         $("#comment").val("");
//         $("#name").val("");
//         // Revert action button to submit
//         $("#action-button").html("<button id='make-new'>Submit</button>");
//         // Grab the results from the db again, to populate the DOM
//         getResults();
//       }
//     });
//   });
