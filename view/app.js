
// https://vuejs.org/guide/
// https://github.com/vuejs/awesome-vue
// https://github.com/sorrycc/awesome-javascript

var app = new Vue({
	el: '#app',
	data: {
		title: 'รวมกัน',
		feed: [],
		columns: 5,
		output: []
	},
	watch:{
		'columns': function(){
			this.output = this.chop(this.feed)
		}
	},
	methods: {
		get: function(){
			this.$http.get('/api/feed').then((response) => {
				this.feed = response.body;
				this.output = this.chop(this.feed);
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
		formatUrl: function(fb_url, type){
			if(type.toLowerCase()=="share"){
				var url = decodeURIComponent(fb_url);
				url = url.substring(url.indexOf("=") + 1);
				url = url.substring(0, url.indexOf("&"));
				return url;
			}

			return fb_url;
		},
		getDataType: function(data){
			if(data.attachment){
				return data.attachment.type;
			}
			else{
				return "text";
			}
		},
		isVideo: function(type){
			if(type.toLowerCase().indexOf('video') > -1){
				return true;
			}else{
				return false;
			}
		},
		truncate: function(text){
			if(text.length>100){
				return text.substring(0, 150) + "...";
			}else{
				return text;
			}
		}
	}
})

app.get();