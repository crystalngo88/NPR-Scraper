function getResults(){
    $("#results").empty();
    $.getJSON("/all", function(data){
        for (var i = 0; i < data.length; i++) {
            $("#results").prepend("<p class = 'data-entry' data-id = " + data[i]._id + "><span class='dataTitle' data-id" + data[i]._id + ">" + data[i].name + "</span><span class = delete>X</span></p>");
        }
    });
}

getResults();

$(document).on("click", "#make-new", function(){
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/submit", 
        data: {
            name: $("#name").val(),
            comment: $("#comment").val(),
            created: Date.now()
        }
    })
    .then(function(data){
        $("#results").prepend("<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
        data._id + ">" + data.name + "</span><span class=delete>X</span></p>");
        $("#comment ").val("");
      $("#name").val("");
    });
});
$("#clear-all").on("click", function() {
    // Make an AJAX GET request to delete the comments from the db
    $.ajax({
      type: "GET",
      dataType: "json",
      url: "/clearall",
      // On a successful call, clear the #results section
      success: function(response) {
        $("#results").empty();
      }
    });
  });
  $(document).on("click", ".delete", function() {
    // Save the p tag that encloses the button
    var selected = $(this).parent();
    // Make an AJAX GET request to delete the specific comment
    // this uses the data-id of the p-tag, which is linked to the specific comment
    $.ajax({
      type: "GET",
      url: "/delete/" + selected.attr("data-id"),
  
      // On successful call
      success: function(response) {
        // Remove the p-tag from the DOM
        selected.remove();
        // Clear the comment and title inputs
        $("#comment").val("");
        $("#name").val("");
        // Make sure the #action-button is submit (in case it's update)
        $("#action-button").html("<button id='make-new'>Submit</button>");
      }
    });
  });
  $(document).on("click", ".dataTitle", function() {
    // Grab the element
    var selected = $(this);
    // Make an ajax call to find the comment
    // This uses the data-id of the p-tag, which is linked to the specific comment
    $.ajax({
      type: "GET",
      url: "/find/" + selected.attr("data-id"),
      success: function(data) {
        // Fill the inputs with the data that the ajax call collected
        $("#comment").val(data.comment);
        $("#name").val(data.name);
        // Make the #action-button an update button, so user can
        // Update the comment s/he chooses
        $("#action-button").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
      }
    });
  });
  $(document).on("click", "#updater", function() {
    // Save the selected element
    var selected = $(this);
    // Make an AJAX POST request
    // This uses the data-id of the update button,
    // which is linked to the specific comment name
    // that the user clicked before
    $.ajax({
      type: "POST",
      url: "/update/" + selected.attr("data-id"),
      dataType: "json",
      data: {
        name: $("#name").val(),
        comment: $("#comment").val()
      },
      // On successful call
      success: function(data) {
        // Clear the inputs
        $("#comment").val("");
        $("#name").val("");
        // Revert action button to submit
        $("#action-button").html("<button id='make-new'>Submit</button>");
        // Grab the results from the db again, to populate the DOM
        getResults();
      }
    });
  });
  