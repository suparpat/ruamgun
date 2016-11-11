
var separatePages = {
	data: function(){
		return {
			maxCols: 12
		}
	},
	template: `
		<div>
			<div style="margin: 10px 0px 10px 0px; text-align: center;">
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
			<span style="text-align: center;">
				<h4>{{pageInfo.name}}: {{pageInfo.about}}</h4>
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
	mounted:  function(){
		this.updateRoute('page', store.state.selectedPage, store.state.columns, store.state.selectedSortBy)
	},
	created: function(){
		if(store.state.output.length == 0){
			this.init();
		}
	},
	watch:{
	},
	methods: {
		init: function(){
			var typeQuery = this.$route.query.type;
			var columnsQuery = this.$route.query.columns;
			var sortQuery = this.$route.query.sort;

			if(typeQuery){
				store.commit("updateSelectedPage", typeQuery)
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

			if(store.state.pages.length == 0){
				this.getPages();
			}
			this.getFeed();
		},
		updateSelectedPage: function(e){
			store.commit("updateSelectedPage", e.target.value)
			store.commit('setFeed', []);
			store.commit("setOutput", []);
			this.getFeed();
			this.getSelectedPageInfo()
		},
		updateColumns: function(e){
			store.commit("updateColumns", e.target.value)
			store.commit("setOutput", this.chop(store.state.feed))
			this.updateRoute('page', store.state.selectedPage, store.state.columns, store.state.selectedSortBy)
		},
		updateSelectedSortBy: function(e){
			store.commit("updateSelectedSortBy", e.target.value);
			store.commit('setFeed', []);
			store.commit("setOutput", []);
			this.getFeed();
			this.getSelectedPageInfo()
		},

		getFeed: function(){
			this.updateRoute('page', store.state.selectedPage, store.state.columns, store.state.selectedSortBy)
			this.$http.get('/api/page/' + store.state.selectedPage, {params: {sort: store.state.selectedSortBy}})
			.then(function(response) {
				store.commit('setFeed', response.body);
				store.state.feed.forEach(function(f) {
					if(f.attachment && this.isVideo(f.attachment.type)){
						f.attachment.url = 'fbvid.html?url='+f.attachment.url
					}
					f.image_logo = this.getPageLogo(f.pageName);
				}, this)
				store.commit('setOutput', this.chop(store.state.feed));
			}, function(response) {
				//error
			})
		},

	}
}

