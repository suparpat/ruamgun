var Datastore = require('nedb');
var graph = require('fbgraph');
var database = require('./database');
var helpers = require('./helpers');
var running = 0;

function setup(app_id, app_secret, app_token){
	var my_access_token = app_id + "|" + app_secret;
	// var my_access_token = app_token;
	graph.setAccessToken(my_access_token);
};

function start(cronSchedule, daysSince){

	getPageInfo();
	run();

	//http://crontab.guru/
	var CronJob = require('cron').CronJob;
	var tz = "Asia/Bangkok";

	new CronJob(cronSchedule, run, null, true, tz);

	function run() {
		if(running == 0){
			console.log("[feed] " + new Date() + ": getting feed data");
			fetch(daysSince);
		}else{
			console.log("[feed] ALREADY RUNNING!!")
		}
	}

}


function getPageInfo(){
	var fields = ["about", "picture"];
	var fieldsQuery = "fields=" + fields.join(",");
	database.find("pages", {}, 'created_time', function(pages){
		pages.forEach(function(page){
			console.log("[feed] Getting page info for page: " + page.name)
			graph.get(page.name + "?" + fieldsQuery, function(err, res){
				// console.log(res);
				database.update("pages", {name: page.name},
				 {$set: {
				 	about: res.about,
				 	picture: res.picture.data.url
				 }}, function(numReplaced){
					// console.log(numReplaced)
				})
			})
		})
	})

}

// Item JSON format:
// {
// 	"message": m,
// 	"created_time": c,
// 	"id": id
// }
//https://developers.facebook.com/tools/explorer
//https://developers.facebook.com/tools/accesstoken/

function fetch(daysSince){
	try{
		database.find("pages", {}, 'created_time', function(pages){

			//Get each page's posts
			pages.forEach(function(page){
				running++;
				getPage(page.name, daysSince, function(feedData){
					if(feedData){

				//Check each post for duplicate. If no duplicate, insert to db
				feedData.forEach(function(item){
					database.find(page.name, {"id": item.id}, 'created_time', function(duplicate){
						if(duplicate.length == 0){
							console.log('[feed] inserting to ' + page.name, item.message?(item.message).substring(0, 120):"");
							var temp_item = createItem(item, page.name);
							database.insert(page.name, temp_item);
						}else{
							// console.log("[feed] duplicate " + item.id)
						}
					})					
				})
					running--

					}else{
						running--;
					}

				})	
			})

		})		
	}
	catch(e){
		console.log("ERROR: " + e);
	}

}

function createItem(d, pageName){
	var t = {};
	t.pageName = pageName;
	t.message = d.message;
	t.created_time = new Date(d.created_time);
	t.id = d.id;
	
	t.likes = d.likes.summary.total_count;
	t.comments = {};
	t.comments.count = d.comments.summary.total_count;
	t.comments.data = d.comments.data;
	// console.log(d)

	if(d.shares){
		t.shares = d.shares.count;		
	}

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

function getPage(pageId, daysSince, callback){
	// console.log('[feed] getting feed data from ' + pageId)
	var params = {};
	params.pageId = pageId;
	params.options = {
	    timeout:  5000
	  , pool:     { maxSockets:  Infinity }
	  , headers:  { connection:  "keep-alive" }
	};

	params.since = helpers.unixTimeSince(daysSince);
	params.limit = 100;
	params.fields = [
			"message",
			"created_time",
			"id",
			"attachments",
			"likes.limit(0).summary(true)",
			"comments.limit(5).summary(true){like_count,message}",
			"shares"
	 ]


	get(params, 1, [], function(res){
		console.log("Done querying page " + pageId);
		callback(res);
	})

	// graph
	//   .setOptions(options)
	//   .get(pageId + "/feed?" + query, function(err, res) {
	//   	if(err){
	//   		console.log(err)
	//   		cb([]);
	//   	}else{
	// 		if(res.paging && res.paging.next) {
	// 			graph.get(res.paging.next, function(err, res) {
	// 			// page 2
	// 			});
	// 		}
	// 	    cb(res);	  		
	//   	}
	//   });

}

function get(params, pageCount, output, cb){
	// console.log(running)
	var pageId = params.pageId;
	var options = params.options;

	var fields = params.fields;
	var since = params.since;
	var limit = params.limit;

	var url = params.url;

	if(pageCount == 1){
		var query = "fields=" + fields.join(",") + "&since=" + since + "&limit=" + limit;
		var firstCallUrl = pageId + "/feed?" + query;
		console.log("[feed] Querying page " + pageId);

		graph.setOptions(options)
			  .get(firstCallUrl, function(err, res) {
			  	if(err){
			  		console.log(err);
			  		cb(output);
			  	}else{
			  		iterate(res);
			  	}
		  });		
		}else{
			graph.setOptions(options)
				  .get(url, function(err, res) {
				  	if(err){
				  		console.log(err);
				  		cb(output);
				  	}else{
				  		iterate(res);
				  	}
				  });	
		}

		function iterate(res){
	  		output = output.concat(res.data);
			if(res.paging && res.paging.next) {
				pageCount = pageCount + 1;
				// console.log('[feed] pagination call for ' + pageId, pageCount);
				get({
					pageId: pageId,
					options: options,
					url: res.paging.next
				}, pageCount, output, cb);
			}else{
				cb(output);
			}
		}

}



module.exports = {
	setup: setup,
	start: start
}