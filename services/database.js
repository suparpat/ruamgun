// https://github.com/louischatriot/nedb/wiki
var Datastore = require('nedb');
var db = {};
var pages = [];
var cats = [];
function start(cb){
	db.pages = new Datastore({ filename: 'db/pages', autoload: true });

	db.pages.find({}, function(err, docs){
		pages = docs;
		for(var i = 0; i < pages.length; i++){
			var pageName = pages[i].name;
			if(pageName){
				console.log('[database] creating/loading database ' + pageName)
				db[pageName] = new Datastore({ filename: 'db/fb_pages/' + pageName, autoload: true });				
			}
		}

		if(pages.length > 0){
			//get unique categories
			cats = pages.map(function(e){
				return e.cat;
			}).filter(function(element, index, array){
				return array.indexOf(element) == index;
			});

			cats.forEach(function(c){
				console.log('[database] creating/loading database ' + c);
				db[c] = new Datastore({ filename: 'db/combined/' + c, autoload: true});
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

function insert(dbName, data){
	db[dbName].insert(data);
	var pageCat = getPageCat(dbName);
	if(pageCat){
		db[pageCat].insert(data);
	}
}

function update(dbName, query, update, cb){
	db[dbName].update(query, update, {}, function(err, numReplaced){
		cb(numReplaced);
	})
}

function find(dbName, expression, sort, cb){
	var sortExp = {};
	sortExp[sort] = -1;

	db[dbName]
	.find(expression)
	.sort(sortExp)
	.limit(50)
	.exec(function(err, docs){
		cb(docs, err);
	})
}

function getPages(){
	return pages;
}

function getCats(){
	return cats;
}


module.exports = {
	start: start,
	insert: insert,
	find: find,
	update: update,
	getPages: getPages,
	getCats: getCats
}