import { Vue, Component } from 'vue-property-decorator';
// Tabs
import MainIndexTab from './Main/Index.vue';
import MainProgramsTab from './Main/Programs.vue';

import IntegrationsIndexTab from './Integrations/Index.vue';

import SyncIndexTab from './Sync/Index.vue';
import SyncRemoteTab from './Sync/Remote.vue';
import SyncDevicesTab from './Sync/Devices.vue';

import type { TranslateResult } from 'vue-i18n';

type integrationComponent = {
  title: string | TranslateResult;
  component: string;
}

type MenuSidebarElement = {
  title: string;
  submenus: SubmenuSidebarElement[];
}

type SubmenuSidebarElement = {
  title: string;
  component: string;
  icon?: {
    title: string;
    raster: boolean;
  };
}

@Component({
  components: {
    MainIndexTab,
    MainProgramsTab,
    IntegrationsIndexTab,
    SyncIndexTab,
    SyncRemoteTab,
    SyncDevicesTab
  },
})
export default class ModalSettings extends Vue {
  selected = 'MainIndexTab'

  settingsList: MenuSidebarElement[] = [
    {
      title: 'modals.settings.title',
      submenus: [
        {
          title: 'modals.settings.tabs.common.title',
          component: 'MainIndexTab',
          icon: {
            title: 'settings',
            raster: false
          }
        },
        {
          title: 'modals.settings.tabs.dcc.title',
          component: 'MainProgramsTab',
          icon: {
            title: 'start-menu',
            raster: true
          }
        }
      ]
    },
    {
      title: 'common.types.databases.remote',
      submenus: [
        {
          title: 'modals.settings.tabs.integrations.title',
          component: 'IntegrationsIndexTab'
        }
      ]
    },
    /*{
      title: 'Синхронизация и удаленный доступ',
      submenus: [
        {
          title: 'Синхронизация',
          component: 'SyncIndexTab',
          icon: {
            title: 'cloud-sync',
            raster: true
          }
        },
        {
          title: 'Доступ с другого устройства',
          component: 'SyncRemoteTab',
          icon: {
            title: 'remote-control',
            raster: true
          }
        },
        {
          title: 'Ваши устройства',
          component: 'SyncDevicesTab',
          icon: {
            title: 'multiple-devices',
            raster: true
          }
        }
      ]
    }*/
  ]

  backRoute(): void {
    this.$router.back();
  }

  handleClicks(event: any): void {
    let { target } = event;
    while (target && target.tagName !== 'A') {
      target = target.parentNode;
    }

    if (target && target.href) {
      event.preventDefault();
      this.$openItem(target.href);
    }
  }
}
