import {
  Vue,
  Component,
  Prop,
  Watch
} from 'vue-property-decorator';

@Component({})
export default class Icon extends Vue {
  @Prop({
    required: true,
    type: String,
    default: 'edit'
  }) readonly icon!: string;
  @Prop({
    required: false,
    type: Boolean,
    default: false
  }) readonly raster!: boolean;
  @Prop({
    required: false,
    type: Boolean,
    default: false
  }) readonly static!: boolean;

  useInvertedIcon = this.$store.state.settings.systemDarkTheme === true
    || this.$store.state.settings.theme === 'dark'

  @Watch('$store.state.settings.theme')
  onThemeChanged(val: string): void {
    this.useInvertedIcon = this.$store.state.settings.systemDarkTheme === true
    || val === 'dark';
  }

  get iconClass(): string {
    if (!this.$props.static) {
      return `icon ${this.useInvertedIcon ? 'icon--inverted' : ''}`;
    }
    return 'icon';
  }

  retrieveImage(icon: string): string {
    return `/assets/icons/${icon !== '' ? icon : 'edit'}.${this.$props.raster ? 'png' : 'svg'}`;
  }
}
