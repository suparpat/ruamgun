
var item = {
	template: `
	<div>
	    <div v-if="modalData && modalData.attachment">
			<div style="text-align:center;">
				<a target="_blank" :href="formatUrl(modalData.attachment.url, getDataType(modalData))">
					<img v-bind:src="modalData.attachment.img_url" style="max-width:100%; height:auto;">
				</a>
			</div>
	    </div>
	    <p style="white-space: pre-line; text-align: center;">
		    {{modalData.message}}
	    </p>

		<div style="text-align:center;">
			<img :src="modalData.image_logo" style="display:block; margin-left: auto; margin-right: auto;">
			<a v-if="modalData.attachment" target="_blank" :href="formatUrl(modalData.attachment.url, getDataType(modalData))">
				{{modalData.created_time}}
			</a>
			<br>
			<a :href="linkToFb(modalData.id)" target="_blank">Link to Facebook</a>
			<p v-if="!modalData.attachment">{{modalData.created_time}}</p>
		</div>
		<div v-if="modalData.comments">
			<h3 style="text-align: center;">Top Comments</h3>
			<ul>
				<li v-for="c in modalData.comments.data">({{c.like_count}} likes) {{c.message}}</li>
			</ul>
		</div>
	</div>
	`
	,
	mixins: [myMixin],
	computed: {
		modalData(){
			return store.state.modalData;
		}
	},
	created: function(){
		this.init();
	},
	methods:{
		init: function(){
			if(store.state.pages.length == 0){
				this.getPages().then(function(){
					this.getThisPage();
				})
			}else{
				this.getThisPage();
			}
		},
		isVideo: function(type){
			if(type.toLowerCase().indexOf('video') > -1){
				return true;
			}else{
				return false;
			}
		},
		getDataType: function(data){
			if(data.attachment){
				return data.attachment.type;
			}
			else{
				return "text";
			}
		},
		formatUrl: function(fb_url, type){
			// return fb_url;
			if(type.toLowerCase() == "share"){
				console.log(decodeURIComponent(fb_url))
				var url = decodeURIComponent(fb_url);
				url = url.substring(url.indexOf("=") + 1)
				url = url.substring(0, url.indexOf("&"));
				return url;
			}else{
				return fb_url;
			}

		},
		linkToFb: function(id){
			return "https://facebook.com/" + id;
		},
		getThisPage: function(){
			var pageParam = this.$route.params.page;
			var idParam = this.$route.params.id;
			this.$http.get('/api/' + pageParam + '/' + idParam).then(function(data) {
				var d = data.body[0];
				d.image_logo = this.getPageLogo(d.pageName);
				store.commit("setModalData", d);
			}, (response) => {
				//error
			})
		}
	}
}


// http://www.facebook.com/l.php?u=

// http%3A%2F%2Freut.rs%2F2eL9nQv&h=jAQHFolIA&s=1&enc=AZPXLhfgjQe

// g_LkRtDPP1SnpBByvIlp-oOQxuhfGeWuVS5pUeoNyRZqXUqzTs0QGRR9jTewCFWkMZdL4Z1zpCv1F