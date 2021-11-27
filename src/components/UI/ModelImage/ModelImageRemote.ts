import { Vue, Component, Prop } from 'vue-property-decorator';
import { getLocalLink } from '@/functions/image';

@Component<ModelImageRemote>({})
export default class ModelImageRemote extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: RemoteModel

  get imageLink(): string {
    return getLocalLink(this.model.thumbnail);
  }

  get imageClass(): string {
    return `image ${this.model.thumbnail === '' ? 'image--icon' : ''}`;
  }

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
