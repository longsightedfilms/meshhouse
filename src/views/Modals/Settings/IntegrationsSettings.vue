<template>
  <div v-bar>
    <div>
      <div class="tab tab--programs">
        <h1>Включение интеграций</h1>
        <div class="programs">
          <div
            v-for="(obj, key) in integrations"
            :key="key"
            class="program"
          >
            <div class="program-header">
              <label class="title">{{ obj.title }}</label>
              <toggle-button
                :value="!obj.disabled"
                :width="42"
                :height="18"
                :sync="true"
                @change="(event) => handleSliderChange(event, obj.url)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { ToggleButton } from 'vue-js-toggle-button';

@Component({
  components: {
    ToggleButton
  }
})

export default class ProgramSettings extends Vue {
  integrations: any = {}

  mounted(): void {
    this.integrations = this.$store.state.db.databases.integrations;
  }

  handleSliderChange(event: VueToggleChangeEvent, integration: string): void {
    this.integrations[integration].disabled = !event.value;
    this.$setIntegrationsDB(this.integrations);
  }
}
</script>
