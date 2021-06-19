<template>
  <div>
    <div class="modal modal--links">
      <div class="modal_header">
        <button
          class="close"
          @click="back"
        >
          <svg
            width="15"
            height="12"
            viewBox="0 0 15 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              y2="6"
              x2="1"
              y1="6"
              x1="15"
              fill="none"
            />
            <line
              y2="0"
              x2="6"
              y1="6"
              x1="0"
              fill="none"
            />
            <line
              y2="12"
              x2="6"
              y1="6"
              x1="0"
              fill="none"
            />
          </svg>
        </button>
        <h1>{{ $t('modals.multipleLinks.title') }}</h1>
      </div>
      <div class="modal_content">
        <p class="modal--note">
          {{ $t('modals.multipleLinks.note') }}
        </p>
        <div class="model--links">
          <div
            v-for="(link, idx) in $store.state.controls.downloadLinks"
            :key="`link-${idx}`"
            class="model--link"
          >
            <p>{{ link.filename }} ({{ link.size }})</p>
            <button
              class="button button--flat"
              @click="installModel(link)"
            >
              <vue-icon icon="download-from-cloud" />
              {{ $t('context.model.install') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class RemoteModelInfoModal extends Vue {
  back(): void {
    this.$modal.hideAll();
    this.$store.commit('setModalVisibility', false);
  }

  async installModel(linkItem: SFMLabLink): Promise<void> {
    this.back();

    await this.$ipcInvoke('download-item-integration', {
      type: 'remote',
      title: this.$route.params.database,
      item: this.$store.state.controls.properties,
      link: linkItem
    });
  }
}
</script>
