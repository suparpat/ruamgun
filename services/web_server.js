var express = require('express');
var moment = require('moment');
var history = require('connect-history-api-fallback');
var app = express();

app.use(history());
var database = require('./database');

app.use('/', express.static('view'));
app.use('/db', express.static('db'));
app.use('/js', express.static('node_modules/vue/dist'));
app.use('/js', express.static('node_modules/vue-resource/dist'));
app.use('/js', express.static('node_modules/vue-router/dist'));
app.use('/js', express.static('node_modules/vuex/dist'));
app.use('/js', express.static('node_modules/moment'));

function start(port){
	app.listen(port, function(){
		console.log("[web] listening on port " + port);
	});	
}


app.get('/api/page/:page', function(req, res){
	var page = req.params.page
	if(page){
		database.find(page, {}, req.query.sort, function(data){
			res.send(data);
		})
	}else{
		res.end("Please specify page")
	}

})


app.get('/api/cat/:cat', function(req, res){
	var cat = req.params.cat;
	// console.log(cat, req.query.sort)
	if(cat){
		database.find(cat, {}, req.query.sort, function(data){
			res.send(data);
		})
	}else{
		res.end("Please specify category")
	}

})


app.get('/api/pages', function(req, res){
	database.find("pages", {}, "created_time", function(returnedPages, err){
		database.find("stats", {}, null, function(stats){
			returnedPages = returnedPages.map(function(p){
				var pageStats = stats.find(function(s){
					return p.name == s.page;
				});
				pageStats.updated_at.reverse();
				pageStats = pageStats.updated_at.map(function(ps){
					return moment(ps).format('MMMM Do YYYY, h:mm:ss a');
					// return moment(ps).fromNow();
				});
				p.stats = pageStats;
				return p;
			})
			res.json(returnedPages);
		})
	})
	// res.json(database.getPages());
});


app.get('/api/cats', function(req, res){
	res.json(database.getCats());
});

app.get('/api/:page/:id', function(req, res){
	database.find(req.params.page, {'id': req.params.id}, 'created_time', function(data){
		res.json(data);
	})
})

app.get('/api/stats', function(req, res){
	database.find("stats", {}, null, function(data){
		res.json(data);
	})
})

module.exports = {
	start: start
};