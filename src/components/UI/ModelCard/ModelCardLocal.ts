import { Vue, Component, Prop } from 'vue-property-decorator';
import VueContext from 'vue-context';
import ModelImageLocal from '@/components/UI/ModelImage/ModelImageLocal.vue';

@Component<ModelCardLocal>({
  components: {
    ModelImageLocal,
    VueContext
  }
})
export default class ModelCardLocal extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly model!: Model

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
