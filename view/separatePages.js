
var separatePages = {
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
				<select :value="selectedPage" @input="updateSelectedPage">
					<option v-for="p in pages">{{p.name}}</option>
				</select>
				<select :value="selectedSortBy" @input="updateSelectedSortBy">
					<option v-for="sb in sortBy">{{sb}}</option>
				</select>
			</div>
			<span>
				<h4 style="display: inline-block; vertical-align:bottom;">{{pageInfo.name}}: {{pageInfo.about}}</h4>
			</span>
			<div style="clear: both;"></div>			
			<my-table :output="output"></my-table>
		</div>
	`,
	mixins: [myMixin],
	computed: {
		feed(){
			return store.state.feed;
		},
		output(){
			return store.state.output;
		},
		showModal(){
			return store.state.showModal;
		},
		modalData(){
			return store.state.modalData;
		},
		selectedPage(){
			return store.state.selectedPage;
		},
		columns(){
			return store.state.columns;
		},
		pageInfo(){
			return store.state.pageInfo;
		}
	},
	created: function(){
		if(store.state.output.length == 0){
			this.init();
		}
	},
	watch:{
		'columns': function(){
			store.commit("setOutput", this.chop(store.state.feed))
		},
		'selectedPage': function(){
			store.commit('setFeed', []);
			store.commit("setOutput", []);
			this.getFeed();
			this.getSelectedPageInfo()
		},
		'selectedSortBy': function(){
			store.commit('setFeed', []);
			store.commit("setOutput", []);
			this.getFeed();
			this.getSelectedPageInfo()
		}
	},
	methods: {
		updateSelectedPage: function(e){
			store.commit("updateSelectedPage", e.target.value)
		},
		updateColumns: function(e){
			store.commit("updateColumns", e.target.value)
		},
		updateSelectedSortBy: function(e){
			store.commit("updateSelectedSortBy", e.target.value);
		},
		init: function(){
			if(store.state.pages.length == 0){
				this.getPages();
			}
			this.getFeed();
		},
		getFeed: function(){
			this.$http.get('/api/page/' + store.state.selectedPage, {params: {sort: store.state.selectedSortBy}})
			.then(function(response) {
				store.commit('setFeed', response.body);
				store.state.feed.forEach(function(f) {
					if(f.attachment && this.isVideo(f.attachment.type)){
						f.attachment.url = 'fbvid.html?url='+f.attachment.url
					}
				}, this)
				store.commit('setOutput', this.chop(store.state.feed));
			}, function(response) {
				//error
			})
		},

	}
}

