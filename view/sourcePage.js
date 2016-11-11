
var sourcePage = {
	template: `
		<div>
			<table style="margin-left: auto; margin-right: auto;">
				<tr v-for="c in cats">
					<td>{{c}}</td>
					<td>
						<span v-for="p in filterPage(pages, c)" style="margin-bottom:10px">
							<a :href="generateUrl(p.name)">
								<img :src="p.picture" style="vertical-align: middle;">
							</a>
							{{p.name}}
							<p v-for="stat in p.stats">- {{stat}}</p>

						</span>
					</td>
				</tr>
			</table>

		</div>
	`,
	data: function(){
		return {
			url: "https://facebook.com/"
		}
	},
	mixins: [myMixin],
	watch: {

	},
	computed: {
		pageInfo(){
			return store.state.pageInfo;
		},
	},
	created: function(){
		this.init();
	},
	methods: {
		generateUrl: function(name){
			return this.url + name
		},
		init: function(){
			if(store.state.categories.length == 0){
				this.getCats();
			}
			if(store.state.pages.length == 0){
				this.getPages();
			}
			// this.$http.get('/api/stats').then(function(stats) {
			// 	var temp = store.state.pages;
			// 	temp.forEach(function(p){
			// 		var s = stats.body.find(function(s){
			// 			return s.page == p.name;
			// 		})
			// 		p.stats = s.updated_at.map(function(unixTime){
			// 			return moment(unixTime).fromNow();
			// 		})
			// 	})
			// 	store.commit('setPages', temp);
			// 	console.log(store.state.pages)
			// }, (response) => {
			// 	//error
			// })
		},
		filterPage: function(pages, cat){
			return pages.filter(function(p){
				return p.cat == cat;
			})
		}
	}
}

