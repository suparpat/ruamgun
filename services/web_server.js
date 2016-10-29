var express = require('express');
var app = express();
var database = require('./database');

app.use(express.static('view'));

function start(){
	app.listen(80, function(){
		console.log("[web] listening on port 80");
	});	
}


app.get('/feed', function(req, res){
	database.find(function(data){
		res.send(data);
	})
})

app.get('db', function(req, res){

})

module.exports = {
	start: start
};