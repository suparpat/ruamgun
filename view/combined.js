
var combined = {
	data: function(){
		return {
			maxCols: 12
		}
	},
	template: `
		<div>
			<div style="margin: 10px 0px 10px 0px; text-align:center;">
				<select :value="columns" @input="updateColumns">
					<option v-for="n in maxCols">{{n}}</option>
				</select>
				<select :value="selectedCat" @input="updateSelectedCat">
					<option v-for="c in cats">{{c}}</option>
				</select>
				<select :value="selectedSortBy" @input="updateSelectedSortBy">
					<option v-for="sb in sortBy">{{sb}}</option>
				</select>
			</div>
			<my-table :output="catOutput"></my-table>
		</div>
	`,
	mixins: [myMixin],
	computed: {
		catFeed(){
			return store.state.catFeed;
		},
		catOutput(){
			return store.state.catOutput;
		},
		showModal(){
			return store.state.showModal;
		},
		modalData(){
			return store.state.modalData;
		},
		selectedCat(){
			return store.state.selectedCat;
		},
		columns(){
			return store.state.columns;
		},
		pageInfo(){
			return store.state.pageInfo;
		},

	},
	created: function(){
		if(store.state.catOutput.length == 0){
			this.init();
		}
	},
	mounted:  function(){
		this.updateRoute('combined', store.state.selectedCat, store.state.columns, store.state.selectedSortBy)
	},
	watch:{
		'pages': function(){
			this.setOutput();
		}
	},
	methods: {
		init: function(){
			var typeQuery = this.$route.query.type;
			var columnsQuery = this.$route.query.columns;
			var sortQuery = this.$route.query.sort;

			if(typeQuery){
				store.commit("updateSelectedCat", typeQuery)
			}
			if(columnsQuery){
				store.commit("updateColumns", columnsQuery);
			}else{
				this.dynamicColumnsPerDevice();
			}
			if(sortQuery){
				store.commit("updateSelectedSortBy", sortQuery);
			}

			this.updateRoute('combined', store.state.selectedCat, store.state.columns, store.state.selectedSortBy)
			
			if(store.state.categories.length == 0){
				this.getCats();
			}
			if(store.state.pages.length == 0){
				this.getPages();
			}
			this.getFeed();
		},

		updateSelectedCat: function(e){
			store.commit("updateSelectedCat", e.target.value);
			store.commit('setCatFeed', []);
			store.commit("setCatOutput", []);
			this.getFeed();
		},
		updateColumns: function(e){
			this.updateRoute('combined', store.state.selectedCat, e.target.value, store.state.selectedSortBy)
			store.commit("updateColumns", e.target.value)
			store.commit("setCatOutput", this.chop(store.state.catFeed))
		},
		updateSelectedSortBy: function(e){
			store.commit("updateSelectedSortBy", e.target.value);
			store.commit('setCatFeed', []);
			store.commit("setCatOutput", []);
			this.getFeed();
		},

		getFeed: function(){
			this.updateRoute('combined', store.state.selectedCat, store.state.columns, store.state.selectedSortBy)
			this.$http.get('/api/cat/' + store.state.selectedCat, {params: {sort: store.state.selectedSortBy}})
			.then(function(response) {
				store.commit('setCatFeed', response.body);
				this.setOutput();
			}, function(response) {
				//error
			})
		},
		setOutput: function(){
			store.state.catFeed.forEach(function(f) {
				if(f.attachment && this.isVideo(f.attachment.type)){
					f.attachment.url = 'fbvid.html?url='+f.attachment.url
				}
				f.image_logo = this.getPageLogo(f.pageName);
			}, this);
			store.commit('setCatOutput', this.chop(store.state.catFeed));
		}
		// getSelectedPageInfo(){
		// 	var p = store.state.pages.find(function(element){
		// 		return element.name == store.state.selectedPage
		// 	})

		// 	var pageInfo = {};
		// 	pageInfo.name = p.name;
		// 	pageInfo.about = p.about;
		// 	pageInfo.picture = p.picture;

		// 	store.commit("setPageInfo", pageInfo)
		// }
	}
}