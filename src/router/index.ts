import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
// import Danmu from '../views/danmu.vue'
// import Gift from '../views/gift.vue'
// import Command from '../views/command.vue'
// import User from '../views/user.vue'
import Setting from '../views/setting.vue'
import about from '../views/About.vue'
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	// {
	// 	path: "/",
	// 	name: "Danmu",
	// 	component: about,
	// },
	// {
	// 	path: '/gift',
	// 	name: 'Gift',
	// 	component: Gift
	// },
	// {
	// 	path: '/command',
	// 	name: 'Command',
	// 	component: Command
	// },
	// {
	// 	path: '/user',
	// 	name: 'User',
	// 	component: User
	// },
	// {
	// 	path: '/setting',
	// 	name: 'Setting',
	// 	component: Setting
	//   },
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
