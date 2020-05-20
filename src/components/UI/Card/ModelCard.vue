<template>
  <div
    class="card card--model"
    @dblclick="$openItem(item.path)"
    @contextmenu.prevent="onRightClick"
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
import Vue from 'vue'
import VueContext from 'vue-context'
import Component from 'vue-class-component'
import ModelImage from '@/components/UI/Image/ModelImage.vue'
import { formatBytes } from '@/plugins/models-db/functions'

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
    return formatBytes(size)
  }

  onRightClick(event: MouseEvent): void {
    (this.$parent.$refs.categoryMenu as any).close(event);
    (this.$parent.$refs.menu as any).open(event)
    this.$store.commit('setProperties', this.$props.item)
  }

}
</script>
