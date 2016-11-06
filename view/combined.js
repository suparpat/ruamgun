
var combined = {
	data: function(){
		return {
			maxCols: 12
		}
	},
	template: `
		<div>
			<div style="margin: 10px 0px 10px 0px">
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
	watch:{
		'columns': function(){
			store.commit("setCatOutput", this.chop(store.state.catFeed))
		},
		'selectedCat': function(){
			store.commit('setCatFeed', []);
			store.commit("setCatOutput", []);
			this.getFeed();
			// this.getSelectedPageInfo()
		},
		'selectedSortBy': function(){
			store.commit('setCatFeed', []);
			store.commit("setCatOutput", []);
			this.getFeed();			
		}
	},
	methods: {
		updateSelectedCat: function(e){
			store.commit("updateSelectedCat", e.target.value)
		},
		updateColumns: function(e){
			store.commit("updateColumns", e.target.value)
		},
		updateSelectedSortBy: function(e){
			store.commit("updateSelectedSortBy", e.target.value);
		},
		init: function(){
			this.getCats();
			this.getFeed();
		},
		getFeed: function(){
			this.$http.get('/api/cat/' + store.state.selectedCat, {params: {sort: store.state.selectedSortBy}})
			.then(function(response) {
				store.commit('setCatFeed', response.body);
				store.state.catFeed.forEach(function(f) {
					if(f.attachment && this.isVideo(f.attachment.type)){
						f.attachment.url = 'fbvid.html?url='+f.attachment.url
					}
				}, this)
				store.commit('setCatOutput', this.chop(store.state.catFeed));
			}, function(response) {
				//error
			})
		},
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