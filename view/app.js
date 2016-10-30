
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
					if(f.attachment && this.isVideo(f.attachment.type)){
						f.attachment.url = 'fbvid.html?url='+f.attachment.url
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
		isVideo: function(type){
			if(type.toLowerCase().indexOf('video') > -1){
				return true;
			}else{
				return false;
			}
		},
		triggerModal: function(data){
			this.modalData = data;
			this.showModal = true;
		}
	}
})

app.init();
