<template>
  <div class="modal modal--settings">
    <aside class="modal_tabs">
      <label>{{ $t('modals.settings.title') }}</label>
      <div>
        <button
          class="button"
          :class="selected === 'MainSettings' ? 'active' : ''"
          @click="selected = 'MainSettings'"
        >
          {{ $t('modals.settings.tabs.common.title') }}
        </button>
        <button
          class="button"
          :class="selected === 'ProgramSettings' ? 'active' : ''"
          @click="selected = 'ProgramSettings'"
        >
          {{ $t('modals.settings.tabs.dcc.title') }}
        </button>
      </div>
      <label>{{ $t('common.types.databases.remote') }}</label>
      <div>
        <button
          v-for="item in integrationsList"
          :key="item.component"
          class="button"
          :class="selected === item.component ? 'active' : ''"
          @click="selected = item.component"
        >
          {{ $t(item.title) }}
        </button>
      </div>
    </aside>
    <main>
      <div class="modal_content">
        <component :is="selected" />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
// Tabs
import MainSettings from './Settings/MainSettings.vue';
import ProgramSettings from './Settings/ProgramSettings.vue';
import IntegrationsSettings from './Settings/IntegrationsSettings.vue';

import type { TranslateResult } from 'vue-i18n';

type integrationComponent = {
  title: string | TranslateResult;
  component: string;
}

@Component({
  components: {
    MainSettings,
    ProgramSettings,
    IntegrationsSettings
  },
})
export default class ModalSettings extends Vue {
  selected = 'MainSettings'

  integrationsList: integrationComponent[] = [
    {
      title: 'modals.settings.tabs.integrations.title',
      component: 'IntegrationsSettings'
    }
  ]
}
</script>
