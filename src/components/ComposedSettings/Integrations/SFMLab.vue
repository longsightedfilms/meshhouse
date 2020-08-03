<template>
  <div class="setting">
    <label>SFMLab</label>
    <div class="program-header">
      <label class="title">Hide adult-only models</label>
      <toggle-button
        :value="hideAdultOnlyModels"
        :width="42"
        :height="18"
        :sync="true"
        @change="(event) => handleSliderChange(event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { remote } from 'electron';

@Component({})

export default class SFMLabSettings extends Vue {
  hideAdultOnlyModels = true
  login = ''
  password = ''

  mounted(): void {
    const settings = JSON.parse(localStorage.getItem('SFMLab') ?? '{}');
    if (Object.hasOwnProperty.call(settings, 'hideAdultOnlyModels')) {
      this.hideAdultOnlyModels = settings.hideAdultOnlyModels;
      this.login = settings.login;
      this.password = settings.password;
    } else {
      settings.hideAdultOnlyModels = this.hideAdultOnlyModels;
      settings.login = this.login;
      settings.password = this.password;
      localStorage.setItem('SFMLab', JSON.stringify(settings));
    }
  }

  handleSliderChange(event: VueToggleChangeEvent): void {
    console.log(event.value);
    this.hideAdultOnlyModels = event.value;
    //this.dccForm[dcc].useSystemAssociation = event.value;
    //this.$dccSetConfig(this.dccForm);
  }
}
</script>
