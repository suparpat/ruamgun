// register modal component
Vue.component('modal', {
  // template: '#modal-template',
	props: ['modalData'],
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
			if(type.toLowerCase()=="share"){
				var url = decodeURIComponent(fb_url);
				url = url.substring(url.indexOf("=") + 1);
				url = url.substring(0, url.indexOf("&"));
				return url;
			}

			return fb_url;
		}
	},
	template:
	`<transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

		    <div slot="header" style="text-align:center;">
			    <div v-if="modalData.attachment">
					<!-- <div v-if="isVideo(getDataType(modalData))">
						<my-fb-vid :url="modalData.attachment.url"></my-fb-vid>
					</div> -->

					<!-- <div v-if="!isVideo(getDataType(modalData))"> -->
					<div>
						<a target="_blank" v-bind:href="formatUrl(modalData.attachment.url, getDataType(modalData))">
							<img v-bind:src="modalData.attachment.img_url" style="width:auto; height:auto;">
						</a>
					</div>
			    </div>
		    </div>
		    <div slot="body">
			    <p style="white-space: pre-line;">
				    {{modalData.message}}
			    </p>

		    </div>
		    <div slot="footer">
				{{modalData.created_time}}
				<button class="modal-default-button" @click="$emit('close')">OK</button>
		    </div>
        </div>
      </div>
    </div>
  </transition>`

})