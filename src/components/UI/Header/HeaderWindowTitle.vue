<template>
  <div class="application__header-title">
    <button
      v-show="$store.state.controls.isModalVisible"
      class="back"
      @click="back"
    >
      <svg
        width="15"
        height="12"
        viewBox="0 0 15 12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          y2="6"
          x2="1"
          y1="6"
          x1="15"
          fill="none"
        />
        <line
          y2="0"
          x2="6"
          y1="6"
          x1="0"
          fill="none"
        />
        <line
          y2="12"
          x2="6"
          y1="6"
          x1="0"
          fill="none"
        />
      </svg>
    </button>
    <div class="title">
      <img
        :src="appIcon"
        alt="Meshhouse"
      >
      <p>{{ $store.state.controls.title }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class HeaderWindowTitle extends Vue {
  os = 'linux';

  get appIcon(): string {
    let icon = 'icon.png';

    if (this.os === 'win32') {
      icon = 'icon-win.png';
    }
    if (this.os === 'darwin') {
      icon = 'icon-mac.png';
    }

    return `/${icon}`;
  }

  mounted(): void {
    ipcRenderer.send('get-os');
    ipcRenderer.once('return-os', (event: any, arg) => {
      this.os = arg;
    });
  }

  back(): void {
    this.$modal.hideAll();
    this.$store.commit('setModalVisibility', false);
  }
}
</script>
