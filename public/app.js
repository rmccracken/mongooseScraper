  $('.scrape').on('click', () => {
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then((data) => {
      console.log(data);
        window.alert("Website Scraped");
    });
  });
 
  $(".save").on("click", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function(data) {
        window.location = "/"
    })
});

 
$(".delete").on("click", () => {
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done((data) => {
        window.location = "/saved"
    })
});

$(".saveNote").on("click", () => {
  let thisId = $(this).attr("data-id");
  if (!$("#noteText" + thisId).val()) {
      alert("please enter a note to save")
  }else {
    $.ajax({
          method: "POST",
          url: "/notes/save/" + thisId,
          data: {
            text: $("#noteText" + thisId).val()
          }
        }).done((data) => {
            $("#noteText" + thisId).val("");
            $(".modalNote").modal("hide");
            window.location = "/saved"
        });
  }
});

$(".deleteNote").on("click", () => {
  let noteId = $(this).attr("data-note-id");
  let articleId = $(this).attr("data-article-id");
  $.ajax({
      method: "DELETE",
      url: "/notes/delete/" + noteId + "/" + articleId
  }).done((data) => {
      $(".modalNote").modal("hide");
      window.location = "/saved"
  })
});

