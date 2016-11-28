// https://github.com/louischatriot/nedb/wiki
var Datastore = require('nedb');
var db = {};
var pages = [];
var cats = [];
var config = require('./config.json');

function start(cb){
	var compactionInterval = 1000 * 60 * config.database.compaction_interval_minutes;

	db.pages = new Datastore({ filename: 'db/pages', autoload: true });
	db.stats = new Datastore({ filename: 'db/stats', autoload: true });

	db.pages.persistence.setAutocompactionInterval(compactionInterval);
	db.stats.persistence.setAutocompactionInterval(compactionInterval);

	db.pages.find({}, function(err, docs){
		var pageNames = docs.map(function(p){return p.name;}).join(", ");
		console.log("\n=====");
		console.log('[database] creating/loading ' + docs.length + ' databases ');
		console.log(pageNames);
		console.log("=====\n");
		pages = docs;
		for(var i = 0; i < pages.length; i++){
			var pageName = pages[i].name;
			if(pageName){
				// console.log('[database] creating/loading database ' + pageName)
				db[pageName] = new Datastore({ filename: 'db/fb_pages/' + pageName, autoload: true });	
				// db[pageName].persistence.setAutocompactionInterval(compactionInterval);			
			}
		}

		if(pages.length > 0){
			//get unique categories
			cats = pages.map(function(e){
				return e.cat;
			}).filter(function(element, index, array){
				return array.indexOf(element) == index;
			});

			var catNames = cats.join(", ");
			console.log("\n=====");
			console.log('[database] creating/loading ' + cats.length + ' databases ');
			console.log(catNames);
			console.log("=====\n");
			cats.forEach(function(c){
				// console.log('[database] creating/loading database ' + c);
				db[c] = new Datastore({ filename: 'db/combined/' + c, autoload: true});
				// db[c].persistence.setAutocompactionInterval(compactionInterval);			
			})			
		}



		if(cb){
			cb();
		}
	})
}

function getPageCat(page){
	var o = pages.find(function(p){
		return p.name == page;
	});

	if(o){
		return o.cat;
	}else{
		return null;
	}
}

function insert(dbName, data, cb){
	db[dbName].insert(data,function(pageErr){
		var pageCat = getPageCat(dbName);
		if(pageCat){
			db[pageCat].insert(data, function(pageCatErr){
				cb(pageErr, pageCatErr)
			});
		}		
	});

}

function upsert(dbName, query, update, cb){
	db[dbName].update(query, update, {upsert: true}, function(err, numReplaced, affectedDocuments, upsert){
		cb(numReplaced);
	})
	var pageCat = getPageCat(dbName);
	if(pageCat){
		db[pageCat].update(query, update, {upsert: true}, function(err, numReplaced){
			cb(numReplaced);
		})
	}
}

function update(dbName, query, update, cb){
	db[dbName].update(query, update, {}, function(err, numReplaced){
		cb(numReplaced);
	})
}

function find(dbName, expression, sort, limit, cb){
	var sortExp = {};
	sortExp[sort] = -1;
	if(db[dbName]){
		var query = db[dbName];
		query = query.find(expression)

		if(sortExp){
			query = query.sort(sortExp)
		}
		if(limit){
			query = query.limit(limit)	
		}
		query.exec(function(err, docs){
			cb(docs, err);
		})		
	}else{
		cb([], "Database not found!");
	}

}

function remove(dbName, query, cb){
	db[dbName].remove(query, {multi: true}, function(err, pageNumRemoved){
		var pageCat = getPageCat(dbName);
		if(pageCat){
			db[pageCat].remove({pageName: dbName}, {multi: true}, function(err, pageCatNumRemoved){
				cb(err, pageNumRemoved, pageCatNumRemoved)
			})
		}
	});
}

function getPages(){
	return pages;
}

function getCats(){
	return cats;
}

function compact(dbName){
	db[dbName].persistence.compactDataFile();
}

module.exports = {
	start: start,
	insert: insert,
	find: find,
	update: update,
	getPages: getPages,
	getCats: getCats,
	upsert: upsert,
	remove: remove,
	compact: compact,
	getPageCat: getPageCat
}