//https://developers.facebook.com/apps/321808794866002/dashboard/

var database = require('./services/database');
var feed = require('./services/feed');
var webServer = require('./services/web_server');

database.start(function(){
	feed.setup();
	feed.start();

	webServer.start(3000);

});

