import { Vue, Component } from 'vue-property-decorator';
import { ToggleButton } from 'vue-js-toggle-button';

@Component({
  components: {
    ToggleButton
  }
})

export default class MainProgramsTab extends Vue {
  $refs!: {
    [key: string]: HTMLInputElement;
  }

  dccForm: DCCSettings = this.$ipcSendSync('get-all-dcc-settings')

  saveSettingToFile(): void {
    this.$ipcInvoke('set-all-dcc-settings', this.dccForm);
    this.$emit('close');
  }

  handleSliderChange(event: VueToggleChangeEvent, dcc: string): void {
    this.dccForm[dcc].useSystemAssociation = event.value;
    this.$ipcInvoke('set-all-dcc-settings', this.dccForm);
  }

  handleDirectoryChange(event: Event, dcc: string): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];
    this.dccForm[dcc].customPath = file !== undefined ? file.path : '';
  }

  handleDirectoryClick(dcc: string): void {
    this.$refs[dcc].click();
  }
}
