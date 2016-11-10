
// routing example
// https://jsfiddle.net/pauloc/31p8gpzy/8/

Vue.component('my-table', {
	template: `
		<table style="width:100%; table-layout: fixed; word-break: break-word;">
			<tr v-for="row in output">
				<td v-for="data in row" style="text-align: center; vertical-align: top">
					<span style="display: block; padding-bottom: 4px">
						<img style="height: 40px; float:left; margin-right: 5px;" :src="data.image_logo">
						<h4 style="margin:0px; float: left;">{{data.pageName}} <span v-if="data.attachment">[{{data.attachment.type}}]</span></h4>
						<br><p style="margin:0px; float:left;">{{data.created_time | moment}}</p>
					</span>
					<div style="clear: both;"></div>
					<router-link :to="{path: data.pageName+'/'+data.id, params: {id: data.id}}" style="text-decoration:none; color: black;">
						<div>
							<!-- http://www.w3schools.com/css/css_rwd_images.asp -->
							<div v-if="data.attachment">
									<img v-bind:src="data.attachment.img_url" style="width:100%; height:auto;">
								<p>{{truncate(data.message)}}</p>
							</div>
							<div v-if="!data.attachment">
								<h2>{{truncate(data.message)}}</h2>
							</div>
						</div>
						<span>
							likes: {{data.likes}}
							shares: {{data.shares}}
							comments: {{data.comments.count}}
						</span>
					</router-link>
				</td>
			</tr>
		</table>
	`,
	// data: function(){
		// return {
		// 	output: store.state.output
		// }
	// },
	props: ['output'],
	// watch: 'store.state.pages': function(){

	// },
	methods: {
		truncate: function(text){
			if(text && text.length > 500){
				return text.substring(0, 500) + "...";
			}else{
				return text;
			}
		},
		// triggerModal: function(data){
		// 	store.commit("setModalData", data);
		// },
		getImage: function(pageName){
			if(store.state.pages.length > 0){
				var page = store.state.pages.find(function(element){
					return element.name == pageName;
				});
				return page.picture;				
			}else{
				return null;
			}

		},
		moment: function(){
			return moment();
		}
	},
	filters: {
		moment: function (date) {
			// return moment(date).format('MMMM Do YYYY, h:mm:ss a');
			return moment(date).fromNow();
		}
	}
})