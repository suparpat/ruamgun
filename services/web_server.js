var express = require('express');
var app = express();
var database = require('./database');

app.use('/', express.static('view'));
app.use('/db', express.static('db'));
app.use('/js', express.static('node_modules/vue/dist'));
app.use('/js', express.static('node_modules/vue-resource/dist'));
app.use('/js', express.static('node_modules/vue-router/dist'));
app.use('/js', express.static('node_modules/vuex/dist'));

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
	if(cat){
		database.find(cat, {}, req.query.sort, function(data){
			res.send(data);
		})
	}else{
		res.end("Please specify category")
	}

})


app.get('/api/pages', function(req, res){
	res.json(database.getPages());
});


app.get('/api/cats', function(req, res){
	res.json(database.getCats());
});


module.exports = {
	start: start
};