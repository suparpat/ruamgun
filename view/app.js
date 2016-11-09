// https://vuejs.org/guide/
// https://github.com/vuejs/awesome-vue
// https://github.com/sorrycc/awesome-javascript



var routes = [
	{ path: '/', redirect: '/combined' },
	{ path: '/combined', component: combined },
	{ path: '/page', component: separatePages },
	{ path: '/sources', component: sourcePage },
	{ path: '/item/:id', component: item },
    { path: '*', component: notFoundPage }

]
var scrollBehavior = function(to, from, savedPosition) {
	// console.log('scroll', savedPosition)
	if (savedPosition) {
		return savedPosition
	} else {
		return { x: 0, y: 0 }
	}
};

var router = new VueRouter({
	mode: 'history',
	routes: routes,
	scrollBehavior
})

// const app = new Vue({
//   router
// }).$mount('#app')
var app = new Vue({
	router
}).$mount('#app')
