var Datastore = require('nedb');
var db = {};


function start(){
	db.pages = new Datastore({ filename: 'db/pages', autoload: true });

	db.pages.find({}, function(err, docs){
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
	db[dbName].find(expression, function(err, docs){
		cb(docs);
	})
}

module.exports = {
	start: start,
	insert: insert,
	find: find
}