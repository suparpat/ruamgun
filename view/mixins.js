var myMixin = {
	methods:{
		getCats: function(){
			this.$http.get('/api/cats').then(function(pages) {
				pages.body.sort(this.sortAlphabeticalFunc())
				store.commit('setCats', pages.body);
				// this.getSelectedPageInfo();
			}, (response) => {
				//error
			})
		},		
		getPages: function(){
			return this.$http.get('/api/pages').then(function(pages) {
				// http://stackoverflow.com/questions/8900732/javascript-sort-objects-in-an-array-alphabetically-on-one-property-of-the-arra
				pages.body.sort(this.sortAlphabeticalFunc('name'));
				store.commit('setPages', pages.body);
				this.getSelectedPageInfo();
			}, (response) => {
				//error
			})
		},
		getPageLogo: function(pageName){
			if(store.state.pages.length > 0){
				var page = store.state.pages.find(function(element){
					return element.name == pageName;
				});
				return page.picture;				
			}else{
				return null;
			}

		},
		sortAlphabeticalFunc: function(attr){
			return function(a, b) {
				var textA;
				var textB;
				if(attr){
				    textA = a[attr].toUpperCase();
				    textB = b[attr].toUpperCase();				
				}else{
				    textA = a.toUpperCase();
				    textB = b.toUpperCase();						
				}
			    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
			}
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
		updateRoute: function(path, type, columns, sort){
			router.push({path: path, query: {
				type: type, 
				columns: columns,
				sort: sort
			}})
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