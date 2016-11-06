
var sourcePage = {
	template: `
		<div>
			<table style="margin-left: auto; margin-right: auto;">
				<tr v-for="c in cats">
					<td>{{c}}</td>
					<td>
						<ul>
							<li v-for="p in filterPage(pages, c)" style="margin-bottom:10px">
								<a :href="generateUrl(p.name)">
									<img :src="p.picture" style="vertical-align: middle;">
								</a>
								{{p.name}}
							</li>
						</ul>
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
		},
		filterPage: function(pages, cat){
			return pages.filter(function(p){
				return p.cat == cat;
			})
		}
	}
}

