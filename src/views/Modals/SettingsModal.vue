<template>
  <div class="modal modal--settings">
    <aside class="modal_tabs">
      <label>{{ $t('modals.settings.tabs.common.title') }}</label>
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
          class="button"
          :class="selected === 'IntegrationsSettings' ? 'active' : ''"
          @click="selected = 'IntegrationsSettings'"
        >
          {{ $t('modals.settings.tabs.integrations.title') }}
        </button>
      </div>
    </aside>
    <main>
      <header class="modal_header">
        <h2>{{ $t('modals.settings.title') }}</h2>
      </header>
      <div class="modal_content">
        <component :is="selected" />
      </div>
      <div class="modal_actions">
        <button
          class="button button--primary"
          @click="$emit('close')"
        >
          {{ $t('common.buttons.close') }}
        </button>
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

@Component({
  components: {
    MainSettings,
    ProgramSettings,
    IntegrationsSettings
  },
})
export default class ModalSettings extends Vue {
  selected = 'MainSettings'
}
</script>
