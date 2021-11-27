import {
  Vue,
  Component,
  Prop
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import SettingsStore from '@/store/modules/settings';

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

  get useInvertedIcon(): boolean {
    return this.settingsStore.systemDarkTheme === true || this.settingsStore.theme === 'dark';
  }

  get settingsStore(): SettingsStore {
    return getModule(SettingsStore, this.$store);
  }

  get iconClass(): string {
    if (!this.$props.static) {
      return `icon ${this.useInvertedIcon ? 'icon--inverted' : ''}`;
    }
    return 'icon';
  }

  get iconLink(): string {
    return `/assets/icons/${this.icon !== '' ? this.icon : 'edit'}.${this.raster ? 'png' : 'svg'}`;
  }
}
