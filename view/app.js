// https://vuejs.org/guide/
// https://github.com/vuejs/awesome-vue
// https://github.com/sorrycc/awesome-javascript



var routes = [
	{ path: '/combined', component: combined },
	{ path: '/page', component: separatePages },
	{ path: '/sources', component: sourcePage },
	{ path: '/:id', component: item },

]

var router = new VueRouter({
  routes // short for routes: routes
})

// const app = new Vue({
//   router
// }).$mount('#app')
var app = new Vue({
	router
}).$mount('#app')
