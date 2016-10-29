var Datastore = require('nedb');
var graph = require('fbgraph');
var database = require('./database');


function setup(app_id, app_secret, app_token){
	var my_access_token = app_id + "|" + app_secret;
	// var my_access_token = app_token;
	graph.setAccessToken(my_access_token);
};

function start(){
	//http://crontab.guru/

	var CronJob = require('cron').CronJob;
	var tz = "Asia/Bangkok";
	new CronJob('*/10 * * * * *', function() {
	  console.log("[feed] " + new Date() + ": getting feed data");
	  fetch();
	}, null, true, tz);

}


// Item JSON format:
// {
// 	"message": m,
// 	"created_time": c,
// 	"id": id
// }

function fetch(){
	try{
		database.find("pages", {}, function(pages){

			pages.forEach(function(page){
				get(page.name, function(feedData){
					if(feedData.data){
						feedData.data.forEach(function(item){
							database.find(page.name, {"id": item.id}, function(duplicate){
								if(duplicate.length == 0){
									console.log('[feed] inserting ' + item.id)
									database.insert(page.name, {
										message: item.message,
										created_time: item.created_time,
										id: item.id
									})									
								}else{
									// console.log("[feed] duplicate " + item.id)
								}
							})					
						})
					}
				})	
			})

		})		
	}
	catch(e){
		console.log("ERROR: " + e);
	}

}

function get(pageId, cb){
	// console.log('[feed] getting feed data from ' + pageId)
	var options = {
	    timeout:  5000
	  , pool:     { maxSockets:  Infinity }
	  , headers:  { connection:  "keep-alive" }
	};

	graph
	  .setOptions(options)
	  .get(pageId + "/feed", function(err, res) {
	  	if(err){
	  		console.log(err)
	  		cb([]);
	  	}else{
		    cb(res);	  		
	  	}
	  });

}


module.exports = {
	setup: setup,
	start: start
}
