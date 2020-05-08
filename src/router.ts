import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: (): Promise<any> =>
        import(/* webpackChunkName: "about" */ './views/Home.vue'),
    },
    {
      path: '/db/:database',
      name: 'DatabaseListItems',
      component: (): Promise<any> =>
        import(
          /* webpackChunkName: "DatabaseListItems" */ './views/Catalog/Main.vue'
        ),
    },
  ],
})

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    router.app.$root.$settingsSet('applicationWindow.lastOpened', to.path)
  })
})

export default router
