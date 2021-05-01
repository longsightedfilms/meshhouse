import { Vue, Component } from 'vue-property-decorator';
import { ToggleButton } from 'vue-js-toggle-button';
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ToggleButton,
    ValidationObserver
  }
})
export default class SyncIndexTab extends Vue {
  $refs!: {
    [key: string]: HTMLInputElement[];
  }

  form = {
    email: '',
    password: ''
  }

  handleSliderChange(event: VueToggleChangeEvent, db: string): void {
    const value = event.value;

    /*if(value) {
      this.enabledDatabases.push(db);
    } else {
      const idx = this.enabledDatabases.indexOf(db);
      this.enabledDatabases.splice(idx, 1);
    }*/
  }
}
