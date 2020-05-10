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
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import VueContext from 'vue-context'
import Component from 'vue-class-component'
import ModelImage from '@/components/UI/Image/ModelImage.vue'

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
  onRightClick(event: MouseEvent): void {
    (this.$parent.$refs.menu as any).open(event)
    this.$store.commit('setProperties', this.$props.item)
  }

}
</script>
