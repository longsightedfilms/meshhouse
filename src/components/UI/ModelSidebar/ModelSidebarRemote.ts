import { Vue, Component, Prop } from 'vue-property-decorator';

@Component<ModelSidebarRemote>({
  components: {
    ModelComments: (): Promise<typeof import('*.vue')> => import('@/components/UI/ModelComments/ModelComments.vue')
  }
})
export default class ModelSidebarRemote extends Vue {
  @Prop({ type: Object, required: true }) model!: RemoteModel

  get iconFile(): string {
    const extension = this.model.extension.substr(1);
    switch (extension) {
    case 'ma':
    case 'mb':
      return '/assets/dcc/maya.svg';
    case 'fbx':
      return '/assets/dcc/max.svg';
    default:
      return `/assets/dcc/${extension}.svg`;
    }
  }
}
