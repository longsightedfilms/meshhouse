import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/add-new-catalog',
      name: 'AddNewCatalog',
      component: () => import(/* webpackChunkName: "AddNewCatalog" */ './views/AddNewCatalog.vue')
    },
    {
      path: '/db/:database',
      name: 'DatabaseListItems',
      component: () => import(/* webpackChunkName: "DatabaseListItems" */ './views/Catalog/Main.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('setPageLoadStatus', true)
  next()
})

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    store.commit('setPageLoadStatus', false)
    router.app.$root.$settingsSet(['applicationWindow.lastOpened', to.path])
  })
})

export default router