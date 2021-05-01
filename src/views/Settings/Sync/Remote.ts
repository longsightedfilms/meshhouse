import { Vue, Component } from 'vue-property-decorator';
import { ToggleButton } from 'vue-js-toggle-button';

@Component({
  components: {
    ToggleButton
  }
})
export default class SyncRemoteTab extends Vue {
  $refs!: {
    [key: string]: HTMLInputElement[];
  }

  databases: DatabaseItem[] = []

  enabledDatabases: string[] = []

  async mounted(): Promise<void> {
    this.databases = await this.$ipcInvoke('get-database', 'databases.local');
  }

  enabledDatabase(db: string): boolean {
    return this.enabledDatabases.includes(db);
  }

  handleSliderChange(event: VueToggleChangeEvent, db: string): void {
    const value = event.value;

    if(value) {
      this.enabledDatabases.push(db);
    } else {
      const idx = this.enabledDatabases.indexOf(db);
      this.enabledDatabases.splice(idx, 1);
    }
  }
}
