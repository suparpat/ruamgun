var Datastore = require('nedb');
var graph = require('fbgraph');
var database = require('./database');
var helpers = require('./helpers');
var config = require('./config');

var running = 0;
var options = {
	    timeout:  7000
	  , pool:     { maxSockets:  5 }
	  , headers:  { connection:  "keep-alive" }
	};

function setup(){
	var my_access_token = config.facebook.app_id + "|" + config.facebook.app_secret;
	// var my_access_token = config.facebook.app_token;
	graph.setAccessToken(my_access_token);
};

function start(){

	getPageInfo();
	run();

	//http://crontab.guru/
	var CronJob = require('cron').CronJob;
	var tz = "Asia/Bangkok";

	if(config.env == "development"){
		new CronJob(config.cron.development, run, null, true, tz);
	}else{
		new CronJob(config.cron.production, run, null, true, tz);
	}

	function run() {
		if(running == 0){
			console.log("[feed] " + new Date() + ": getting feed data");
			fetch(config.feeds);
		}else{
			console.log("[feed] ALREADY RUNNING!!")
		}
	}

}


function getPageInfo(){
	var fields = ["about", "picture"];
	var fieldsQuery = "fields=" + fields.join(",");
	database.find("pages", {}, 'created_time', function(pages, err){
		var pageLength = pages.length;
		recurse(0, pageLength)
		function recurse(currentPage, pageLength){
			var page = pages[currentPage];
			console.log("[feed] Getting page info for page: " + page.name)
			graph.setOptions(options).get(page.name + "?" + fieldsQuery, function(err, res){
				if(!err){
					// console.log(res);
					database.update("pages", {name: page.name},
					 {$set: {
					 	about: res.about,
					 	picture: res.picture.data.url
					 }}, function(numReplaced){
						// console.log(numReplaced)
					})		
				}else{
					console.log('[feed] ERROR: ' + JSON.stringify(err));
				}

				currentPage = currentPage + 1;
				if(currentPage < pageLength){
					recurse(currentPage, pageLength);
				}

			})		
		}
		// pages.forEach(function(page){
		// 	console.log("[feed] Getting page info for page: " + page.name)
		// 	graph.setOptions(options).get(page.name + "?" + fieldsQuery, function(err, res){
		// 		if(!err){
		// 			// console.log(res);
		// 			database.update("pages", {name: page.name},
		// 			 {$set: {
		// 			 	about: res.about,
		// 			 	picture: res.picture.data.url
		// 			 }}, function(numReplaced){
		// 				// console.log(numReplaced)
		// 			})		
		// 		}else{
		// 			console.log('[feed] ERROR: ' + JSON.stringify(err));
		// 		}

		// 	})
		// })
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

function fetch(feedConfig){
	// try{
		database.find("pages", {}, 'created_time', function(pages){

			recurse(0, pages.length)

			function recurse(current_page, count_pages){
				var thisPage = pages[current_page];
				running++;
				getPage(thisPage.name, feedConfig, function(feedData){
					var feedLength = feedData.length;
					console.log("Done querying page " + thisPage.name, "length: " + feedLength);
					if(feedLength > 0){
						database.upsert("stats", {page: thisPage.name}, {$push: {updated_at: {$each: [Date.now()], $slice: config.stats.max_page_timestamps}}}, function(numReplaced){

						})
						// database.insert("stats", {
						// 	page: thisPage.name,
						// 	updated_at: Date.now()
						// })
						//Check each post for duplicate. If no duplicate, insert to db
						console.log('[feed] inserting to ' + thisPage.name);
						feedData.forEach(function(item){
							// database.find(thisPage.name, {"id": item.id}, 'created_time', function(duplicate){
							// 	if(duplicate.length == 0){
									var temp_item = createItem(item, thisPage.name);
									// database.insert(thisPage.name, temp_item);
									database.upsert(thisPage.name, {id: temp_item.id}, temp_item, function(numReplaced){

									})
								// }else{
									// console.log("[feed] duplicate " + item.id)
								// }
							// })					
						})
				
						running--;
						current_page = current_page + 1;
						// console.log("CHECK RECURSING", current_page, count_pages, current_page < count_pages)
						if(current_page < count_pages){
							recurse(current_page, count_pages);
						}
					}else{
						running--;
						current_page = current_page + 1;
						// console.log("LENGTH 0, CHECK RECURSING", current_page, count_pages)
						if(current_page < count_pages){
							recurse(current_page, count_pages);
						}
					}

				})	
			}

			//Get each page's posts
		// 	pages.forEach(function(page){
		// 		running++;
		// 		getPage(page.name, feedConfig, function(feedData){
		// 			if(feedData){

		// 		//Check each post for duplicate. If no duplicate, insert to db
		// 		feedData.forEach(function(item){
		// 			database.find(page.name, {"id": item.id}, 'created_time', function(duplicate){
		// 				if(duplicate.length == 0){
		// 					console.log('[feed] inserting to ' + page.name);
		// 					var temp_item = createItem(item, page.name);
		// 					database.insert(page.name, temp_item);
		// 				}else{
		// 					// console.log("[feed] duplicate " + item.id)
		// 				}
		// 			})					
		// 		})
		// 			running--

		// 			}else{
		// 				running--;
		// 			}

		// 		})	
		// 	})

		})		
	// }
	// catch(e){
	// 	console.log("ERROR: " + e);
	// }

}

function createItem(d, pageName){
	var t = {};
	t.pageName = pageName;
	t.message = d.message;
	t.created_time = new Date(d.created_time);
	t.id = d.id;
	if(d.likes){
		t.likes = d.likes.summary.total_count;
	}
	t.comments = {};
	if(d.comments){
		t.comments.count = d.comments.summary.total_count;
		t.comments.data = d.comments.data;		
	}

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

function getPage(pageId, feedConfig, callback){
	// console.log('[feed] getting feed data from ' + pageId)
	var params = {};
	params.pageId = pageId;
	// params.options = {
	//     timeout:  5000
	//   , pool:     { maxSockets:  Infinity }
	//   , headers:  { connection:  "keep-alive" }
	// };

	if(feedConfig.mode=="days_since"){
		params.since = helpers.unixTimeSince(daysSince);
	}
	else if(feedConfig.mode=="latest"){
		params.latest = feedConfig.latest;
	}
	else{
		var msg = "[feed] INVALID FEED MODE";
		console.log(msg);
		throw msg;
	}
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
	// var options = params.options;

	var fields = params.fields;
	var since = params.since;
	var limit = params.limit;
	var latest = params.latest;

	var url = params.url;

	if(pageCount == 1){
		var query = "fields=" + fields.join(",");

		if(since){
			query = query + "&since=" + since;
		}
		if(limit){
			query= query + "&limit=" + limit;
		}

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
			if(!checkFinish(res)) {
				pageCount = pageCount + 1;
				// console.log('[feed] pagination call for ' + pageId, pageCount);
				params['pageId'] = pageId;
				params['url'] = res.paging.next
				get(params, pageCount, output, cb);
			}else{
				cb(output);
			}
		}

		function checkFinish(res){
			if(latest){
				if(res.paging && res.paging.next && ((pageCount * limit) < latest)){
					return false;
				}
			}
			else if(since){
				if(res.paging && res.paging.next){
					return false;
				}
			}
			else{
				var msg = "[feed] ERROR CHECKING FINISH" + ", latest: " + latest + ", since: " + since;
				console.log(msg);
				throw msg;
			}

			return true;
		}

}



module.exports = {
	setup: setup,
	start: start
}