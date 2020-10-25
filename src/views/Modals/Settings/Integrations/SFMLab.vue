<template>
  <div v-bar>
    <div>
      <div class="tab tab--programs">
        <h1>SFMLab</h1>
        <webview
          id="foo"
          src="https://sfmlab.com/accounts/login"
          style="display:inline-flex; width:640px; height:480px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class SFMLabSettings extends Vue {}
</script>
