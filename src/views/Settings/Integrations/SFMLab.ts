import { Vue, Component } from 'vue-property-decorator';
import { ToggleButton } from 'vue-js-toggle-button';

@Component({
  components: {
    ToggleButton
  }
})

export default class IntegrationsSFMLabTab extends Vue {
  showMatureContent = false

  mounted(): void {
    this.showMatureContent = this.$store.state.settings.integrations.sfmlab.showMatureContent ?? false;
  }

  handleMatureContentChange(event: VueToggleChangeEvent): void {
    this.showMatureContent = event.value;
    this.$store.commit('setSFMLabMature', this.showMatureContent);
    this.$ipcInvoke('set-application-setting', {
      key: 'integrations.sfmlab.showMatureContent',
      value: this.showMatureContent
    });
  }
}
