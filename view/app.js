
// https://vuejs.org/guide/
// https://github.com/vuejs/awesome-vue
// https://github.com/sorrycc/awesome-javascript

var app = new Vue({
	el: '#app',
	data: {
		title: 'รวมกัน',
		feed: [],
		columns: 5,
		output: [],
		pages: [],
		selectedPage: "Reuters",
		maxCols: 12,
		showModal: false,
		modalData: {}
	},
	watch:{
		'columns': function(){
			this.output = this.chop(this.feed)
		},
		'selectedPage': function(){
			this.getFeed();
		}
	},
	methods: {
		init: function(){
			this.getPages();
			this.getFeed();
		},
		getFeed: function(){
			this.$http.get('/api/feed/' + this.selectedPage).then((response) => {
				this.feed = response.body;
				this.feed.forEach((f) => {
					if(f.created_time){
						f.created_time = this.formatDate(f.created_time);
					}
					// if(f.message){
					// 	f.message = f.message.replace(/(?:\r\n|\r|\n)/g, '<br />');
					// }
				})
				this.output = this.chop(this.feed);
			}, (response) => {
				//error
			})
		},
		getPages: function(){
			this.$http.get('/api/pages').then((pages) => {
				this.pages = pages.body;
			}, (response) => {
				//error
			})
		},
		chop: function(feed){
			//array of arrays
			var output = [];
			var cols = parseInt(this.columns);

			for(var i = 0; i < feed.length; i = i + cols){
				var slice = feed.slice(i, i + cols);
				output.push(slice);
			}

			return output;
		},
		truncate: function(text){
			if(text && text.length > 100){
				return text.substring(0, 150) + "...";
			}else{
				return text;
			}
		},
		triggerModal: function(data){
			this.modalData = data;
			this.showModal = true;
		},
		formatDate: function(date){
			var date = new Date(date);
			var minute = date.getMinutes();
			var day;
			switch(date.getDay()){
				case 0:
					day = "Sun";
					break;
				case 1:
					day = "Mon";
					break;
				case 2:
					day = "Tues";
					break;
				case 3:
					day = "Wed";
					break;
				case 4:
					day = "Thurs";
					break;
				case 5:
					day = "Fri";
					break;
				case 6:
					day = "Sat";
					break;
			}
			var formattedDate = day + ", " +
								date.getDate() + "/" + 
								(date.getMonth()+1) + "/" + 
								date.getFullYear() + 
								", " + date.getHours() + ":" + 
								(String(minute)[1] ? minute : "0" + minute);
			return formattedDate;
		}
	}
})

app.init();
