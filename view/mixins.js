var myMixin = {
	methods:{
		getCats: function(){
			this.$http.get('/api/cats').then(function(pages) {
				store.commit('setCats', pages.body);
				// this.getSelectedPageInfo();
			}, (response) => {
				//error
			})
		},		
		getPages: function(){
			this.$http.get('/api/pages').then(function(pages) {
				store.commit('setPages', pages.body);
				this.getSelectedPageInfo();
			}, (response) => {
				//error
			})
		},
		getSelectedPageInfo(){
			var p = store.state.pages.find(function(element){
				return element.name == store.state.selectedPage
			})

			var pageInfo = {};
			pageInfo.name = p.name;
			pageInfo.about = p.about;
			pageInfo.picture = p.picture;

			store.commit("setPageInfo", pageInfo)
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
		isVideo: function(type){
			if(type.toLowerCase().indexOf('video') > -1){
				return true;
			}else{
				return false;
			}
		},
	},
	computed: {
		cats(){
			return store.state.categories;
		},
		pages(){
			return store.state.pages;
		},
		sortBy(){
			return store.state.sortBy;
		},
		selectedSortBy(){
			return store.state.selectedSortBy;
		},
	}
}