<template>
  <div class="tab">
    <h1>{{ $t('modals.settings.tabs.integrations.content.sfmlab.title') }}</h1>
    <div class="tab__block">
      <div class="tab__block--header">
        <label class="title">{{ $t('modals.settings.tabs.integrations.content.sfmlab.content.matureContent.title') }}</label>
        <toggle-button
          :value="showMatureContent"
          :width="42"
          :height="18"
          :sync="true"
          @change="handleMatureContentChange"
        />
      </div>
    </div>
  </div>
</template>
<script src="./SFMLab.ts" lang="ts"></script>
