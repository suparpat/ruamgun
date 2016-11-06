var database = require('../services/database');

database.start();

var cats = [
"International_News",
"Thai_Tech_News",
"Thai_News",
"Thai_Blogs",
"International_Tech_News"
]

var pages = [
	{
		name: "DocumentaryClubTH", cat: checkCat("Thai_Blogs")
	}, 
	{
		name: "bbcnews", cat: checkCat("International_News")
	}, 
	{
		name: "thematterco", cat: checkCat("Thai_Blogs")
	}, 
	{
		name: "TechTalkThaiCareersAndKnowledge", cat: checkCat("Thai_Tech_News")
	}, 
	{
		name: "Rhudeebyannteam", cat: checkCat("Thai_Blogs")
	}, 
	{
		name: "in.one.zaroop", cat: checkCat("Thai_Blogs")
	},
	{
		name: "Reuters", cat: checkCat("International_News")
	},
	{
		name: "thatsjrit", cat: checkCat("Thai_Blogs")
	},
	{
		name: "pantipedia", cat: checkCat("Thai_Blogs")
	},
	{
		name: "techinasia", cat: checkCat("International_Tech_News")
	},
	{
		name: "infographic.thailand", cat: checkCat("Thai_Blogs")
	},
	{
		name: "blognone", cat: checkCat("Thai_Tech_News")
	},
	{
		name: "sanooknews", cat: checkCat("Thai_News")
	},
	{
		name: "TheEconomist", cat: checkCat("International_News")
	},
	{
		name: "khaosod", cat: checkCat("Thai_News")
	}
];

function checkCat(input){
	for(var i = 0; i < cats.length; i++){
		if(cats[i] == input){
			return cats[i];
		}
	}
}
pages.forEach(function(page){
	database.find("pages", {"name": page.name}, function(duplicate){
		if(duplicate.length == 0){
			console.log('inserting page ' + page);
			database.insert("pages", {"name": page.name, "cat": page.cat});			
		}else{
			console.log('duplicate: ' + page)
		}
	})	
})
