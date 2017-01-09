function fetchLibraryList(event) {
	event.preventDefault();
	$.get("https://httpbin.org/get", window.results, function(data) { //AJAX
		var data = { articles: window.results };
		var $output = $(".article-results");
		var articleTemplate = $("#articles-tmpl").html();
		var html = Mustache.render(articleTemplate, data);
		$output.empty().append(html);
		$(document).trigger("resultsRendered"); //Nikica
		$(".img-links").hide();
  	}, "json");
}
$(document).ready(function() {
	$("#searchform").on("submit", fetchLibraryList);
	$(".search-btn").on("click", fetchLibraryList);
});

$(document).on("resultsRendered", function(event) { //Nikica
	$(".article-results a").click(function(event) {
		var articleId = $(this).closest("li").data("article-id");
		console.log("zapeceni id", articleId);
		$("#modal-results").modal(); //zove modal na link naslova
		var found_article = window.results.find(function(article) {
			return article.id == articleId; 
		});

		console.log(found_article);
		var $output = $("#modal-data");
		var modalTemplate = $("#modal-tmpl").html();
		var html = Mustache.render(modalTemplate, found_article);
		$output.empty().append(html);

    var $outputTitle = $(".modal-title");
    var modalTitle = $("#modal-title").html();
    var html = Mustache.render(modalTitle, found_article);
    $outputTitle.empty().append(html);
	});
});

window.results = [{
  id: 346456,
  title: "Procjena dobrobiti zaštičenih područja u RH",
  summary: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam obcaecati ex odit neque veniam fuga id perspiciatis,explicabo sit tempore sint animi sapiente eos velit a nisi eligendi? Cumque, eaque.",
  size: 145,
  date: "2007-05-11",
  author: "Mile Miličević",
  url: "http://knowledgebase.wwf.hr/articles/124125"
}, {
  id: 234256,
  title: "Projekt Parkovi Dinarskog luka",
  summary: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
  size: 154,
  date: "2007-05-11",
  author: "Mile Morić",
  url: "http://knowledgebase.wwf.hr/articles/124125"
}, {
  id: 868321,
  title: "Radna mjesta i zaštita prirode",
  summary: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam obcaecati ex odit neque veniam fuga id perspiciatis, explicabo sit tempore sint animi sapiente eos velit a nisi eligendi? Cumque, eaque. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere",
  size: 124,
  date: "2007-05-11",
  author: "Mile Matić",
  url: "http://knowledgebase.wwf.hr/articles/124125"
}, {
  id: 114798,
  title: "Preporuka za korištenje rezultata PA-BATa",
  summary: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam obcaecati ex odit neque veniam fuga id perspiciatis, explicabo sit tempore sint animi sapiente eos velit a nisi eligendi? Cumque, eaque.",
  size: 197,
  date: "2007-05-11",
  author: "Mile Mirković",
  url: "http://knowledgebase.wwf.hr/articles/124125"
}];
