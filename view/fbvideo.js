Vue.component('my-fb-vid', {
	// <!-- https://developers.facebook.com/docs/plugins/embedded-video-player -->
	template:'<div class="fb-video" :data-href="url" data-show-text="true" data-allowfullscreen="true"></div>',
	props: ['url'],
	// watch:{
	// 	url: function(){
	// 		console.log('change!')
	// 	}
	// }
})

