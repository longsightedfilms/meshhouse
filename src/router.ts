import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: (): Promise<any> =>
        import(/* webpackChunkName: "Home" */ './views/Home.vue'),
    },
    {
      path: '/updated-database',
      name: 'Updated',
      component: (): Promise<any> =>
        import(/* webpackChunkName: "Updated" */ './views/Updated.vue'),
    },
    {
      path: '/db/local/:database',
      name: 'LocalDatabase',
      component: (): Promise<any> =>
        import(
          /* webpackChunkName: "LocalDatabase" */ './views/Catalog/Local.vue'
        ),
      meta: {
        localDB: true
      }
    },
    {
      path: '/db/remote/:database',
      name: 'RemoteDatabase',
      component: (): Promise<any> =>
        import(
          /* webpackChunkName: "LocalDatabase" */ './views/Catalog/Remote.vue'
        ),
      meta: {
        localDB: false
      }
    },
  ],
})

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    if (to.name !== 'Home' && to.name !== 'Updated') {
      router.app.$root.$settingsSet('applicationWindow.lastOpened', to.path)
    }
  })
})

export default router
