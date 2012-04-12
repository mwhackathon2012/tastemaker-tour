
//var twitterqueryurl = "http://search.twitter.com/search.json?q=victoria%20albert%20http";
var twitterqueryurl = "https://api.twitter.com/1/lists/statuses.json?slug=top-10-influencers-uk&owner_screen_name=mwhackathon&per_page=10&page=1&include_entities=true";

$(document).ready(function() {
	$.ajax( {url: twitterqueryurl, dataType: "jsonp", success: parseTweets });
});

function parseTweets(data)
{
  console.log('received tweets!', data);
	
  // clear old ones
  $('#tweets').html('');

  var context = "";
  
  // add new ones  
  $.each(data, function(key, val) {
	context += " " + val.text.replace(/[^a-z0-9-_.;:]/gim,' ');
    $('<li/>', { id: val.id, html: val.text.replace(/[^a-z0-9-_.;:]/gim,' ') }).appendTo('#tweets'); 
  });
  
  // now load images
  console.log("context: ", context);
  var termextractorurl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20search.termextract%20where%20context%3D%22" + context + "%22%20limit%2010&format=json";
  // or http://www.alchemyapi.com/api/demo.html
  $.ajax( {url: termextractorurl, dataType: "jsonp", success: loadImages });
}

function loadImages(data)
{
	console.log("received terms: ", data);
	
	var terms = data.query.results.Result;
	console.log(terms);
}




$('#tweets li').live('click', openTweet);

function openTweet(evt)
{
	var urlregex = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

	var el = $(this);
	var id = el.attr('id');
	var txt = el.html();
	console.log(id, txt);
	
	var url = urlregex.exec(txt);
	
	if (url == null)
	  return;
	
	url = url[0];
	console.log('found url: ', url);
	
	// now open in iframe
	$('#content iframe').attr('src', url);
}