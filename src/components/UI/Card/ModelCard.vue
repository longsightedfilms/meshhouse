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
        {{ modelSize(item.size || 0) }}
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
import { Vue, Component, Prop } from 'vue-property-decorator';
import VueContext from 'vue-context';
import ModelImage from '@/components/UI/Image/ModelImage.vue';

@Component({
  components: {
    ModelImage,
    VueContext
  }
})
export default class ModelCard extends Vue {
  @Prop({ type: Object, required: true }) readonly item!: Model

  modelSize(size: number): string {
    return this.$formatSize(size);
  }

  handleDblClick(item: Model): void {
    if (Object.hasOwnProperty.call(item, 'installed')) {
      // Is remote item
      if (item.installed === true) {
        this.$openItem(item.path);
      } else {
        this.$router.push(`/model/${this.$route.params.database}/${item.id}`);
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
