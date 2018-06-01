var database = require('../services/database');

database.start();


var pageByCats = {
	"Thai_News": ["khaosod", "sanooknews", "bangkokpost", "MatichonOnline", "BBCThai", "Prachatai", "msnthailand"],
	"Thai_Tech_News": ["TechTalkThaiCareersAndKnowledge", "blognone", "techsauce.co", "thaiopensource"],
	"Thai_Blogs": ["DocumentaryClubTH", "thematterco", "themomentumco", "in.one.zaroop", "pantipedia", "infographic.thailand", "hoftu", "Lovecumentary", "soimilkbangkok", "quoteV2"],
	"Thai_Persons": ["wannasingh", "supassraclub", "winlyovarin", "204024313004149"],	
	"Thai_Fun": ["Rhudeebyannteam"],
	"International_News": ["bbcnews", "Reuters", "vicenews", "TheEconomist", "wired", "time", "TheIndependentOnline", "theguardian", "wsj", "bloombergbusiness", "financialtimes", "MSN.News"],
	"International_Tech_News": ["techinasia", "extremetechdotcom", "TechRadar", "verge", "techcrunch", "MacRumors", "TrustedReviews"],
	"International_Tech_News_Technical": ["hnbot"],
	"International_Blogs": ["waitbutwhy", "medium", "reddit", "explosm", "ExistentialComics", "IFeakingLoveScience"],
	"International_Fun": ["imgur", "9gag", "fml"],
	"World": ["natgeo", "Discovery", "NASA"],
	"Lifestyle": ["LondonDrugs", "NewYorkerCartoons", "MSNLifestyle"],
	"Financial": ["Seekingalpha", "bloombergbusiness", "themotleyfool", "Investopedia", "worldeconomicforum", "marketwatch", "financialtimes", "wsj", "bloombergmarkets"]
}

for(var cat in pageByCats){
	// console.log(cat, pageByCats[cat])
	pageByCats[cat].forEach(function(page){
		var current_cat = cat;
		database.find("pages", {"name": page}, 'created_time', null, function(duplicate){
			if(duplicate.length == 0){
				console.log('inserting page ' + page, current_cat);
				database.insert("pages", {"name": page, "cat": current_cat});			
			}else{
				console.log('duplicate: ' + page)
			}
		})		
	})
}

