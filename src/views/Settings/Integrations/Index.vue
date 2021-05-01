<template>
  <div class="tab">
    <h1>{{ $t('modals.settings.tabs.integrations.title') }}</h1>
    <div class="tab__block">
      <div class="tab__block--header">
        <label class="title">{{ $t('modals.settings.tabs.integrations.content.customProxy.title') }}</label>
        <toggle-button
          :value="proxy.customProxy"
          :width="42"
          :height="18"
          :sync="true"
          @change="handleServerChange"
        />
      </div>
      <div
        v-if="proxy.customProxy"
        class="input-group"
      >
        <input
          class="input"
          type="text"
          placeholder="https://my-api.com"
          :value="proxy.url"
          @change="handleServerInput"
        >
      </div>
      <label
        class="tab__block--hint"
        v-html="$t('modals.settings.tabs.integrations.content.customProxy.hint')"
      />
    </div>
    <div
      v-for="(obj, key) in integrations"
      :key="key"
      class="tab__block"
    >
      <div class="tab__block--header">
        <label class="title">{{ obj.title }}</label>
        <toggle-button
          :value="!obj.disabled"
          :width="42"
          :height="18"
          :sync="true"
          :disabled="obj.path === null"
          @change="(event) => handleSliderChange(event, obj.url)"
        />
      </div>
      <div class="input-group">
        <input
          :ref="obj.url"
          type="file"
          webkitdirectory
          hidden
          required
          @change="(event) => handleDirectoryChange(event, obj.url)"
        >
        <button
          class="input input--file"
          @click.prevent="() => handleDirectoryClick(obj.url)"
        >
          <span v-if="obj.path !== null">
            {{ obj.path }}
          </span>
          <span
            v-else
            class="placeholder"
          >
            {{ $t('modals.settings.tabs.integrations.content.path') }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
<script src="./Index.ts" lang="ts"></script>
