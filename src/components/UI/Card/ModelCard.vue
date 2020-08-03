<template>
  <div
    class="card card--model"
    @dblclick="handleDblClick(item)"
    @contextmenu.prevent="onRightClick"
    @dragstart="onDrag"
  >
    <model-image
      :src="item.image"
      :extension="item.extension"
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
import { formatBytes } from '@/plugins/models-db/functions';
import { ipcRenderer } from 'electron';

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

  handleDblClick(item: Model): void {
    if (Object.hasOwnProperty.call(item, 'installed')) {
      // Is remote item
      if (item.installed === true) {
        this.$openItem(item.path);
      } else {
        console.log('not installed');
      }
    } else {
      this.$openItem(item.path);
    }
  }

  onRightClick(event: MouseEvent): void {
    (this.$parent.$refs.categoryMenu as any).close(event);
    (this.$parent.$refs.menu as any).open(event);
    this.$store.commit('setProperties', this.$props.item);
  }

  onDrag(event: DragEvent): void {
    if (event.dataTransfer !== null) {
      event.dataTransfer.effectAllowed = 'copy';
      event.preventDefault();
      ipcRenderer.send('dropOut', this.$props.item.path);
    }
  }

}
</script>
