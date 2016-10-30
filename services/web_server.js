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


app.get('/api/feed/:page', function(req, res){
	var page = req.params.page
	if(page){
		database.find(page, {}, function(data){
			res.send(data);
		})
	}else{
		res.end("Please specify page")
	}

})

app.get('/api/pages', function(req, res){
	res.json(database.getPages());
})

module.exports = {
	start: start
};