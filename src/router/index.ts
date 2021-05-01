import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import About from '../views/About.vue'
import Danmu from '../views/danmu.vue'
import Gift from '../views/gift.vue'
import Command from '../views/command.vue'
import User from '../views/user.vue'
import Setting from '../views/setting.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Danmu',
    component: Danmu,
    meta: {
      keepAlive:true
    }
  },
  // {
  //   path: '/danmu',
  //   name: 'Danmu',
  //   component: Danmu,
  //   meta: {
  //     keepAlive:true
  //   }
  // },
  {
    path: '/gift',
    name: 'Gift',
    component: Gift
  },
  {
    path: '/command',
    name: 'Command',
    component: Command
  },
  {
    path: '/user',
    name: 'User',
    component: User
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  }
]

const router = new VueRouter({
  routes
})

export default router
