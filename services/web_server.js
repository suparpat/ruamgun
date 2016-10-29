var express = require('express');
var app = express();
var database = require('./database');

app.use('/', express.static('view'));
app.use('/db', express.static('db'));
app.use('/js', express.static('node_modules/vue/dist'));
app.use('/js', express.static('node_modules/vue-resource/dist'));

function start(){
	app.listen(80, function(){
		console.log("[web] listening on port 80");
	});	
}


app.get('/api/feed', function(req, res){
	database.find('Reuters', {}, function(data){
		res.send(data);
	})
})

module.exports = {
	start: start
};