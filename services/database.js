// https://github.com/louischatriot/nedb/wiki
var Datastore = require('nedb');
var db = {};
var pages = [];

function start(){
	db.pages = new Datastore({ filename: 'db/pages', autoload: true });

	db.pages.find({}, function(err, docs){
		pages = docs;
		for(var i = 0; i < docs.length; i++){
			var pageName = docs[i].name;
			if(pageName){
				console.log('[database] creating/loading database ' + pageName)
				db[pageName] = new Datastore({ filename: 'db/fb_pages/' + pageName, autoload: true });				
			}
		}
	})
}



function insert(dbName, data){
	db[dbName].insert(data);
}

function find(dbName, expression, cb){

	db[dbName].find(expression).sort({ created_time: -1}).limit(50).exec(function(err, docs){
		cb(docs);
	})
}

function getPages(){
	return pages;
}


module.exports = {
	start: start,
	insert: insert,
	find: find,
	getPages: getPages
}