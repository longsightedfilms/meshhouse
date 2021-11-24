<template>
  <div
    class="card card--model"
    @dblclick="handleDblClick"
    @contextmenu.prevent="onRightClick"
    @dragstart="onDrag"
  >
    <model-image-remote
      :model="model"
    />
    <div class="card_title">
      <p>{{ model.title }}</p>
    </div>
    <div class="card_properties">
      <p class="size">
        {{ modelSize(model.size || 0) }}
      </p>
      <p class="extension">
        {{ $returnHumanLikeExtension(model.extension) }}
      </p>
      <p class="path">
        {{ model.path }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import VueContext from 'vue-context';
import ModelImageRemote from '@/components/UI/ModelImage/ModelImageRemote.vue';

@Component({
  components: {
    ModelImageRemote,
    VueContext
  }
})
export default class ModelCardRemote extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: RemoteModel

  modelSize(size: number): string {
    return this.$formatSize(size);
  }

  handleDblClick(): void {
    if (this.model.installed === true && this.model.path) {
      this.$openItem(this.model.path);
    } else {
      this.$router.push(`/model/${this.$route.params.database}/${this.model.id}`);
    }
  }

  onRightClick(event: MouseEvent): void {
    if (this.$parent.$refs.categoryMenu !== undefined) {
      (this.$parent.$refs.categoryMenu as any).close(event);
    }
    (this.$parent.$refs.menu as any).open(event);
    this.$store.commit('setProperties', this.model);
  }

  onDrag(event: DragEvent): void {
    if (event.dataTransfer !== null) {
      event.dataTransfer.effectAllowed = 'copy';
      event.preventDefault();
      this.$ipcInvoke('dropOut', this.model.path);
    }
  }

}
</script>
