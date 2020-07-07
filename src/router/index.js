import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: () => import('@/views/Home.vue')
  // },
  {
    path: '/webgl1',
    name: 'webgl1',
    component: () => import('@/views/webgl1.vue')
  },
  {
    path:'/',
    name:'webgl2',
    component:() => import('@/views/webgl2.vue')
  }

]

const router = new VueRouter({
  mode:'history', //hash history
  base:'/',
  routes
})

export default router
