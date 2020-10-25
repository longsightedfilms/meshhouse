<template>
  <div class="setting">
    <label>{{ $t('modals.settings.tabs.common.content.openLastPage.title') }}</label>
    <div class="input--select">
      <select
        v-model="currentLastPage"
        class="input"
        @change="onChange"
      >
        <option value="main">
          {{ $t('modals.settings.tabs.common.content.openLastPage.content.main') }}
        </option>
        <option value="lastCatalog">
          {{ $t('modals.settings.tabs.common.content.openLastPage.content.lastCatalog') }}
        </option>
      </select>
      <vue-icon
        icon="caret-forward"
        raster
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})

export default class LastPageSelector extends Vue {
  currentLastPage = ''

  mounted(): void {
    this.currentLastPage = this.$store.state.settings.lastPage;
  }

  onChange(event: Event): void {
    const target = (event.target as HTMLInputElement);

    this.$store.commit('setCurrentLastPage', target.value);
    this.$settingsSet('lastPage', target.value);
  }
}
</script>
