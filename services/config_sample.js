var options = {
	"env": "development",
	"facebook":{
		"app_id": "123456",
		"app_secret": "your_app_secret",
		"app_token": "your_token"
	}
	"cron":{
		"development": "*/30 * * * *",
		"production": "*/15 * * * *"
	},
	"feeds":{
		"mode": "latest",
		"latest": 100,
		"limit_per_query": 25,
		"days_since": 3
	},
	"database":{
		"compaction_interval_minutes": 30
	},
	"stats": {
		"max_page_timestamps": 3
	},
	"view": {
		"page_item_limit": 50
	}
}

module.exports = options