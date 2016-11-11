var database = require('../services/database');

database.start();


var pageByCats = {
	"Thai_News": ["khaosod", "sanooknews", "bangkokpost", "MatichonOnline", "BBCThai"],
	"Thai_Tech_News": ["TechTalkThaiCareersAndKnowledge", "blognone", "oraveevivi", "techsauce.co"],
	"Thai_Blogs": ["DocumentaryClubTH", "thematterco", "themomentumco", "in.one.zaroop", "thatsjrit", "pantipedia", "infographic.thailand", "hoftu", "Lovecumentary", "soimilkbangkok", "quoteV2"],
	"Thai_Fun": ["Rhudeebyannteam", "9gaginthai"],
	"International_News": ["bbcnews", "Reuters", "vicenews", "TheEconomist", "wired", "time", "TheIndependentOnline", "theguardian", "wsj", "bloombergbusiness", "financialtimes"],
	"International_Tech_News": ["techinasia", "extremetechdotcom", "TechRadar", "verge", "techcrunch", "MacRumors", "TrustedReviews"],
	"International_Blogs": ["waitbutwhy", "medium", "reddit", "explosm", "ExistentialComics"],
	"International_Fun": ["imgur", "9gag", "fml"],
	"World": ["natgeo", "Discovery", "NASA"]
}

for(var cat in pageByCats){
	// console.log(cat, pageByCats[cat])
	pageByCats[cat].forEach(function(page){
		var current_cat = cat;
		database.find("pages", {"name": page}, 'created_time', function(duplicate){
			if(duplicate.length == 0){
				console.log('inserting page ' + page, current_cat);
				database.insert("pages", {"name": page, "cat": current_cat});			
			}else{
				console.log('duplicate: ' + page)
			}
		})		
	})
}
