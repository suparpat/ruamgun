
var item = {
	template: `
	<div>
	    <div v-if="modalData.attachment">
			<div style="text-align:center;">
				<a target="_blank" v-bind:href="formatUrl(modalData.attachment.url, getDataType(modalData))">
					<img v-bind:src="modalData.attachment.img_url" style="max-width:100%; height:auto;">
				</a>
			</div>
	    </div>
	    <p style="white-space: pre-line;">
		    {{modalData.message}}
	    </p>

		<a 
		v-if="modalData.attachment" 
		target="_blank" 
		v-bind:href="formatUrl(modalData.attachment.url, getDataType(modalData))">
			{{modalData.created_time}}
		</a>
		<p v-if="!modalData.attachment">{{modalData.created_time}}</p>
	</div>
	`
	,
	computed: {
		modalData(){
			return store.state.modalData;
		}
	},
	methods:{
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

		}
	}
}


// http://www.facebook.com/l.php?u=

// http%3A%2F%2Freut.rs%2F2eL9nQv&h=jAQHFolIA&s=1&enc=AZPXLhfgjQe

// g_LkRtDPP1SnpBByvIlp-oOQxuhfGeWuVS5pUeoNyRZqXUqzTs0QGRR9jTewCFWkMZdL4Z1zpCv1F