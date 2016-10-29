var database = require('../services/database');

database.start();

var pages = [
"DocumentaryClubTH", 
"bbcnews", 
"thematterco", 
"TechTalkThaiCareersAndKnowledge", 
"Rhudeebyannteam", 
"in.one.zaroop",
"Reuters",
"thatsjrit",
"pantipedia",
"techinasia",
"infographic.thailand",
"blognone",
"sanooknews",
"TheEconomist"
];

pages.forEach(function(page){
	database.find("pages",{"name": page}, function(duplicate){
		if(duplicate.length == 0){
			console.log('inserting page ' + page);
			database.insert("pages", {"name": page});			
		}else{
			console.log('duplicate: ' + page)
		}
	})	
})
