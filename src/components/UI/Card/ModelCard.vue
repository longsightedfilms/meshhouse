<template>
  <div
    class="card card--model"
    @dblclick="handleDblClick(item)"
    @contextmenu.prevent="onRightClick"
    @dragstart="onDrag"
  >
    <model-image
      :item="item"
    />
    <div class="card_title">
      <p>{{ item.name }}</p>
    </div>
    <div class="card_properties">
      <p class="size">
        {{ modelSize(item.size) }}
      </p>
      <p class="extension">
        {{ $returnHumanLikeExtension(item.extension) }}
      </p>
      <p class="path">
        {{ item.path }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import VueContext from 'vue-context';
import Component from 'vue-class-component';
import ModelImage from '@/components/UI/Image/ModelImage.vue';
import Integrations from '@/plugins/models-db/integrations/main';
import RemoteModelInfoModal from '@/views/Modals/RemoteModelInfoModal.vue';
import { formatBytes } from '@/plugins/models-db/functions';

@Component({
  components: {
    ModelImage,
    VueContext
  },
  props: {
    item: Object
  }
})
export default class ModelCard extends Vue {
  modelSize(size: number): string {
    return formatBytes(size);
  }

  async handleDblClick(item: Model): Promise<void> {
    if (Object.hasOwnProperty.call(item, 'installed')) {
      // Is remote item
      if (item.installed === true) {
        this.$openItem(item.path);
      } else {
        const db = new Integrations[this.$route.params.database]();
        await db.fetchSingleModel(this.$props.item);
        this.$modal.show(RemoteModelInfoModal, {}, {
          adaptive: true,
          clickToClose: true,
          width: '100%',
          height: '100%',
        }, {
          'before-open': () => {
            this.$store.commit('setModalVisibility', true);
          },
          'before-close': () => {
            this.$store.commit('setModalVisibility', false);
          }
        });
      }
    } else {
      this.$openItem(item.path);
    }
  }

  onRightClick(event: MouseEvent): void {
    if (this.$parent.$refs.categoryMenu !== undefined) {
      (this.$parent.$refs.categoryMenu as any).close(event);
    }
    (this.$parent.$refs.menu as any).open(event);
    this.$store.commit('setProperties', this.$props.item);
  }

  onDrag(event: DragEvent): void {
    if (event.dataTransfer !== null) {
      event.dataTransfer.effectAllowed = 'copy';
      event.preventDefault();
      this.$ipcInvoke('dropOut', this.$props.item.path);
    }
  }

}
</script>
