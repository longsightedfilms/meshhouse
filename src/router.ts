import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/main'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: (): Promise<typeof import('*.vue')> =>
        import(/* webpackChunkName: "Home" */ './views/Home.vue'),
    },
    {
      path: '/updated-database',
      name: 'Updated',
      component: (): Promise<typeof import('*.vue')> =>
        import(/* webpackChunkName: "Updated" */ './views/Updated.vue'),
    },
    {
      path: '/db/local/:database/:category?',
      name: 'LocalDatabase',
      component: (): Promise<typeof import('*.vue')> =>
        import(
          /* webpackChunkName: "LocalDatabase" */ './views/Catalog/Local.vue'
        ),
      meta: {
        localDB: true
      }
    },
    {
      path: '/db/remote/:database/:category?',
      name: 'RemoteDatabase',
      component: (): Promise<typeof import('*.vue')> =>
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
  store.commit('setLoadingStatus', false)
  next()
})

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    store.commit('setLoadingStatus', true)
    if (to.name !== 'Home' && to.name !== 'Updated') {
      router.app.$root.$settingsSet('applicationWindow.lastOpened', to.path)
    }
  })
})

export default router
