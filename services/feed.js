var Datastore = require('nedb');
var graph = require('fbgraph');
var database = require('./database');


function setup(app_id, app_secret, app_token){
	var my_access_token = app_id + "|" + app_secret;
	// var my_access_token = app_token;
	graph.setAccessToken(my_access_token);
};

function start(cronSchedule){
	//http://crontab.guru/

	var CronJob = require('cron').CronJob;
	var tz = "Asia/Bangkok";
	new CronJob(cronSchedule, function() {
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
//https://developers.facebook.com/tools/explorer
//https://developers.facebook.com/tools/accesstoken/

function fetch(){
	try{
		database.find("pages", {}, function(pages){

			//Get each page's posts
			pages.forEach(function(page){
				get(page.name, function(feedData){
					if(feedData.data){

				//Check each post for duplicate. If no duplicate, insert to db
				feedData.data.forEach(function(item){
					database.find(page.name, {"id": item.id}, function(duplicate){
						if(duplicate.length == 0){
							console.log('[feed] inserting ' + item.id, page.name, item.message?(item.message).substring(0, 120):"");
							var temp_item = createItem(item);
							database.insert(page.name, temp_item);
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

function createItem(d){
	var t = {};
	t.message = d.message;
	t.created_time = d.created_time;
	t.id = d.id;
	if(d.attachments){
		var attachment = d.attachments.data[0];
		// if(attachment){
			t.attachment = {};
			t.attachment.type = attachment.type;
			t.attachment.title = attachment.title;
			t.attachment.url = attachment.url;
			if(attachment.media){
				t.attachment.img_url = attachment.media.image.src;			
			}
		// }		
	}



	return t;
}

function get(pageId, cb){
	// console.log('[feed] getting feed data from ' + pageId)
	var options = {
	    timeout:  5000
	  , pool:     { maxSockets:  Infinity }
	  , headers:  { connection:  "keep-alive" }
	};

	var fields = ["message", "created_time", "id", "attachments"]

	var fieldsQuery = "fields=" + fields.join(",");
	graph
	  .setOptions(options)
	  .get(pageId + "/feed?" + fieldsQuery, function(err, res) {
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