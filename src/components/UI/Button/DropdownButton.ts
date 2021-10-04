import { Vue, Component, Prop, Mixins } from 'vue-property-decorator';
import { mixin as clickaway } from 'vue-clickaway';

@Component({})
export default class DropdownButton extends Mixins(clickaway) {
  @Prop({
    required: false,
    type: String,
    default: ''
  }) readonly hint!: string;
  @Prop({
    required: false,
    type: Boolean,
    default: false
  }) readonly closeByClick!: boolean;
  @Prop({
    required: false,
    type: Boolean,
    default: false
  }) readonly notify!: boolean;

  toggled = false

  get menuClass(): string {
    return `dropdown__menu ${this.toggled ? 'show' : ''}`;
  }

  toggleDropdown(): void {
    this.toggled = !this.toggled;
    this.$emit('click');
  }

  onClickedOutside(): void {
    this.toggled = false;
  }

  onClickedInside(): void {
    if (this.$props.closeByClick === true) {
      this.toggled = false;
    }
  }
}
