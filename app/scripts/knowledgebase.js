function fetchLibraryList(event) {
	event.preventDefault();
	$.get("https://httpbin.org/get", window.results, function(data) { //AJAX
		var data = { articles: window.results };
		var $output = $(".article-results");
		var articleTemplate = $("#article-tmpl").html();
		var html = Mustache.render(articleTemplate, data);
		$output.empty().append(html);
		$(document).trigger("resultsRendered"); //Nikica
		$(".img-links").hide();
  	}, "json")
};

$(document).ready(function() {
	$("#searchform").on("submit", fetchLibraryList);
	$(".search-btn").on("click", fetchLibraryList);
});

$(document).on("resultsRendered", function(event) { //Nikica
	$('.article-results .article').click(function(ev) {
		console.log($(this));
		var articleId = $(this).data("article-id");  
		$("#modal-results").modal(); //zove modal na link naslova 
		//var modalTemplate = $("#modal-tmpl").html();
		var MyElement = document.getElementById("modal-tmpl");
		document.getElementById("")
		$().getElementById("modal-tmpl");

	});
});

//radi generalno za Modal -> izbaci sve iz window.results u Modal (Antonio)
//$('#modal-results').on("shown.bs.modal", function(ev) {
//      var data = { articles: window.results[0] };
//		var $output = $("#modal-data");
//		var modalTemplate = $("#modal-tmpl").html();
//		var html = Mustache.render(modalTemplate, data);
//		$output.empty().append(html);
//});

window.results = [{
  id: 1,
  title: "Procjena dobrobiti zaštičenih područja u RH",
  summary: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam obcaecati ex odit neque veniam fuga id perspiciatis,explicabo sit tempore sint animi sapiente eos velit a nisi eligendi? Cumque, eaque.",
  size: 145,
  date: "2007-05-11",
  author: "Mile Miličević",
  url: "http://knowledgebase.wwf.hr/articles/124125"
}, {
  id: 2,
  title: "Projekt Parkovi Dinarskog luka",
  summary: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere",
  size: 154,
  date: "2007-05-11",
  author: "Mile Morić",
  url: "http://knowledgebase.wwf.hr/articles/124125"
}, {
  id: 3,
  title: "Radna mjesta i zaštita prirode",
  summary: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam obcaecati ex odit neque veniam fuga id perspiciatis, explicabo sit tempore sint animi sapiente eos velit a nisi eligendi? Cumque, eaque.",
  size: 124,
  date: "2007-05-11",
  author: "Mile Matić",
  url: "http://knowledgebase.wwf.hr/articles/124125"
}, {
  id: 4,
  title: "Preporuka za korištenje rezultata PA-BATa",
  summary: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam obcaecati ex odit neque veniam fuga id perspiciatis, explicabo sit tempore sint animi sapiente eos velit a nisi eligendi? Cumque, eaque.",
  size: 197,
  date: "2007-05-11",
  author: "Mile Mirković",
  url: "http://knowledgebase.wwf.hr/articles/124125"
}]