// https://vuejs.org/guide/
// https://github.com/vuejs/awesome-vue
// https://github.com/sorrycc/awesome-javascript

const store = new Vuex.Store({
  state: {
	title: 'รวมกัน',
	feed: [],
	output: [],
	pages: [],
	showModal: false,
	modalData: {}
  },
  mutations: {
    increment (state) {
      state.count++
    },
    setFeed(state, input){
    	state.feed = input;
    },
    setOutput(state, input){
    	state.output = input;
    },
    setPages(state, input){
    	state.pages = input;
    },
    setModalData(state, input){
    	state.modalData = input;
    }
  }
})

const index = {
	data: function(){
		return {
	// 		title: 'รวมกัน',
	// 		feed: [],
			columns: 5,
	// 		output: [],
	// 		pages: [],
			selectedPage: "Reuters",
			maxCols: 12
	// 		showModal: false,
	// 		modalData: {}
		}
	},
	template: `
		<div>
			<h1>{{title}}</h1>
			<select v-model="columns">
				<option v-for="n in maxCols">{{n}}</option>
			</select>
			<select v-model="selectedPage">
				<option v-for="p in pages">{{p.name}}</option>
			</select>

			<modal v-if="showModal" :modal-data="modalData" @close="showModal = false"></modal>

			<table style="width:100%; table-layout: fixed; word-break: break-word;">
				<tr v-for="row in output">
					<td v-for="data in row" style="text-align: center; vertical-align: top">
						<div @click="triggerModal(data)">
							<p>{{data.created_time}} <span v-if="data.attachment">[{{data.attachment.type}}]</span></p>
							<!-- http://www.w3schools.com/css/css_rwd_images.asp -->
							<div v-if="data.attachment">
								<router-link @click="triggerModal(data)" :to="{path: 'item', query: {id: data.id}}">
									<img v-bind:src="data.attachment.img_url" style="width:100%; height:auto;">
								</router-link>
								<p>{{truncate(data.message)}}</p>
							</div>
							<div v-if="!data.attachment">
								<router-link @click="triggerModal(data)" :to="{path: 'item', query: {id: data.id}}">
									<h2>{{truncate(data.message)}}</h2>
								</router-link>
							</div>
						</div>
					</td>
				</tr>
			</table>
		</div>
	`,
	computed: {
		title(){
			return store.state.title;
		},
		feed(){
			return store.state.feed;
		},
		output(){
			return store.state.output;
		},
		pages(){
			return store.state.pages;
		},
		showModal(){
			return store.state.showModal;
		},
		modalData(){
			return store.state.modalData;
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
			this.getFeed();
		}
	},
	methods: {
		init: function(){
			this.getPages();
			this.getFeed();
		},
		getFeed: function(){
			this.$http.get('/api/feed/' + this.selectedPage).then((response) => {
				store.commit('setFeed', response.body);
				store.state.feed.forEach((f) => {
					if(f.attachment && this.isVideo(f.attachment.type)){
						f.attachment.url = 'fbvid.html?url='+f.attachment.url
					}
					// if(f.message){
					// 	f.message = f.message.replace(/(?:\r\n|\r|\n)/g, '<br />');
					// }
				})
				store.commit('setOutput', this.chop(store.state.feed));
			}, (response) => {
				//error
			})
		},
		getPages: function(){
			this.$http.get('/api/pages').then((pages) => {
				store.commit('setPages', pages.body);
			}, (response) => {
				//error
			})
		},
		chop: function(feed){
			//array of arrays
			var output = [];
			var cols = parseInt(this.columns);

			for(var i = 0; i < feed.length; i = i + cols){
				var slice = feed.slice(i, i + cols);
				output.push(slice);
			}

			return output;
		},
		truncate: function(text){
			if(text && text.length > 500){
				return text.substring(0, 500) + "...";
			}else{
				return text;
			}
		},
		isVideo: function(type){
			if(type.toLowerCase().indexOf('video') > -1){
				return true;
			}else{
				return false;
			}
		},
		triggerModal: function(data){
			store.commit("setModalData", data);
			// this.modalData = data;
			this.showModal = true;
		}
	}
}

const item = {
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
			if(type.toLowerCase()=="share"){
				var url = decodeURIComponent(fb_url);
				url = url.substring(url.indexOf("=") + 1);
				url = url.substring(0, url.indexOf("&"));
				return url;
			}

			return fb_url;
		}
	}
}

const routes = [
  { path: '/', component: index },
  { path: '/:id', component: item }
]

const router = new VueRouter({
  routes // short for routes: routes
})

// const app = new Vue({
//   router
// }).$mount('#app')
const app = new Vue({
	router
}).$mount('#app')
