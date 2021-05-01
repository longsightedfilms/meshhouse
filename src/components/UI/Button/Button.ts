import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Button extends Vue {
  @Prop({
    required: false,
    type: Boolean,
    default: false
  }) readonly disabled!: boolean;
  @Prop({
    required: false,
    type: String,
    default: ''
  }) readonly type!: string;
  @Prop({
    required: false,
    type: Boolean,
    default: false
  }) readonly busy!: boolean;
  @Prop({
    required: false,
    type: Boolean,
    default: false
  }) readonly iconOnly!: boolean;
  @Prop({
    required: false,
    type: String,
    default: ''
  }) readonly size!: string;

  get buttonClass(): string {
    let fullClass = 'v-button';

    const type = this.$props.type.trim();
    const isBusy = this.$props.busy;
    const iconOnly = this.$props.iconOnly;
    const size = this.$props.size.trim();

    if(type !== '') {
      fullClass += ` v-button--${type}`;
    }

    if(size !== '') {
      fullClass += ` v-button--${size}`;
    }

    if (isBusy) {
      fullClass += ' v-button--busy';
    }

    if (iconOnly) {
      fullClass += ' v-button--icon-only';
    }
    return fullClass;
  }
}
