import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/main';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: (): Promise<typeof import('*.vue')> => {
        return import(/* webpackChunkName: "Home" */ './views/Home.vue');
      },
      meta: {
        toolbar: true,
        sidebar: true,
        backButton: false
      }
    },
    {
      path: '/library',
      name: 'Library',
      component: (): Promise<typeof import('*.vue')> => {
        return import(/* webpackChunkName: "Home" */ './views/Library.vue');
      },
      meta: {
        toolbar: true,
        sidebar: false,
        backButton: false
      }
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: (): Promise<typeof import('*.vue')> => {
        return import(/* webpackChunkName: "Home" */ './views/Favorites.vue');
      },
      meta: {
        toolbar: false,
        sidebar: false,
        backButton: true
      }
    },
    {
      path: '/updated-database',
      name: 'Updated',
      component: (): Promise<typeof import('*.vue')> => {
        return import(/* webpackChunkName: "Updated" */ './views/Updated.vue');
      },
      meta: {
        toolbar: true,
        sidebar: true,
        backButton: false
      }
    },
    {
      path: '/model/:database/:id',
      name: 'ModelPage',
      component: (): Promise<typeof import('*.vue')> => {
        return import(/* webpackChunkName: "Updated" */ './views/ModelPageDynamic.vue');
      },
      meta: {
        toolbar: false,
        sidebar: false,
        backButton: true
      }
    },
    {
      path: '/db/local/:database/:category?',
      name: 'LocalDatabase',
      component: (): Promise<typeof import('*.vue')> => {
        return import(/* webpackChunkName: "LocalDatabase" */ './views/Catalog/Local.vue');
      },
      meta: {
        localDB: true,
        toolbar: true,
        sidebar: true,
        backButton: false
      }
    },
    {
      path: '/db/remote/:database/:page?',
      name: 'RemoteDatabase',
      component: (): Promise<typeof import('*.vue')> => {
        return import(/* webpackChunkName: "LocalDatabase" */ './views/Catalog/Remote.vue');
      },
      meta: {
        localDB: false,
        toolbar: true,
        sidebar: true,
        backButton: false
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: (): Promise<typeof import('*.vue')> => {
        return import(/* webpackChunkName: "Settings" */ './views/Settings/Index.vue');
      },
      meta: {
        toolbar: false,
        sidebar: false,
        backButton: true
      }
    },
  ],
});


router.beforeEach((to, from, next) => {
  store.commit('setOfflineStatus', false);
  store.commit('setLoadingStatus', false);
  next();
});

router.afterEach((to, from) => {
  const content = document.querySelector('main.application__content');
  content?.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  store.commit('setLoadingStatus', true);
  Vue.nextTick(() => {
    if (to.name !== 'Home'
    && to.name !== 'Updated'
    && to.name !== 'Settings'
    ) {
      router.app.$root.$ipcInvoke('set-application-setting', {
        key: 'applicationWindow.lastOpened',
        value: to.path
      });
    }
  });
});

export default router;
