//https://developers.facebook.com/apps/321808794866002/dashboard/

var database = require('./services/database');
var config = require('./services/config');
var feed = require('./services/feed');
var webServer = require('./services/web_server');

database.start(function(){
	feed.setup(
		config.facebook.app_id,
		config.facebook.app_secret,
		config.facebook.app_token);

	feed.start(config.cron.development, config.feeds.days_since);

	webServer.start(3000);

});

