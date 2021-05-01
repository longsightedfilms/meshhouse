<template>
  <div class="tab">
    <h1>{{ $t('modals.settings.tabs.common.title') }}</h1>
    <language-selector />
    <theme-selector />
    <last-page-selector />
    <div class="setting setting--switch">
      <label class="title">{{ $t('modals.settings.tabs.common.content.hideIntegrations.title') }}</label>
      <toggle-button
        :value="hideIntegrations"
        :width="42"
        :height="18"
        :sync="true"
        @change="(event) => handleSliderChange(event, 'hideIntegrations')"
      />
    </div>
    <div class="setting setting--switch">
      <label class="title">{{ $t('modals.settings.tabs.common.content.minimalisticHeaders.title') }}</label>
      <toggle-button
        :value="minimalisticHeaders"
        :width="42"
        :height="18"
        :sync="true"
        @change="(event) => handleSliderChange(event, 'minimalisticHeaders')"
      />
    </div>
    <div class="setting setting--switch">
      <label class="title">{{ $t('modals.settings.tabs.common.content.showInTray.title') }}</label>
      <toggle-button
        :value="showInTray"
        :width="42"
        :height="18"
        :sync="true"
        @change="(event) => handleSliderChange(event, 'showInTray')"
      />
    </div>
    <i>{{ $t('modals.settings.tabs.common.content.showInTray.note') }}</i>
    <p>{{ $t('modals.settings.restartRequired') }}</p>
  </div>
</template>
<script src="./Index.ts" lang="ts"></script>
