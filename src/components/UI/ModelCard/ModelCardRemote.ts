import { Vue, Component, Prop } from 'vue-property-decorator';
import VueContext from 'vue-context';
import ModelImageRemote from '@/components/UI/ModelImage/ModelImageRemote.vue';

@Component<ModelCardRemote>({
  components: {
    ModelImageRemote,
    VueContext
  }
})
export default class ModelCardRemote extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly model!: RemoteModel

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
