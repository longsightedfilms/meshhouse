import { Vue, Component, Prop } from 'vue-property-decorator';
import { getLocalLink } from '@/functions/image';

@Component<ModelImageLocal>({})
export default class ModelImageLocal extends Vue {
  @Prop({
    type: Object,
    required: true
  }) readonly model!: Model

  get imageLink(): string {
    return getLocalLink(this.model.image);
  }

  get retrieveImage(): string {
    return this.model.image !== ''
      ? this.$forceReloadImage(this.imageLink)
      : `/assets/files/${this.model.extension.substr(1)}.svg`;
  }

  get imageClass(): string {
    return `image ${this.model.image === '' ? 'image--icon' : ''}`;
  }

  get iconFile(): string {
    const extension = this.model.extension.substr(1);
    switch (extension) {
    case 'ma':
    case 'mb':
      return '/assets/dcc/maya.svg';
    default:
      return `/assets/dcc/${extension}.svg`;
    }
  }
}
