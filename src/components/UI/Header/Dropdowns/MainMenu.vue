<template>
  <fragment>
    <a @click="showSettings">
      <vue-icon
        icon="settings"
        inverted
      />
      {{ $t('dropdowns.mainmenu.settings') }}
    </a>
    <a @click="showAbout">
      <vue-icon
        icon="info"
        inverted
      />
      {{ $t('dropdowns.mainmenu.aboutProgram') }}
    </a>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Fragment } from 'vue-fragment'
import SettingsModal from '@/views/Modals/SettingsModal.vue'
import AboutProgramModal from '@/views/Modals/AboutProgramModal.vue'

@Component({
  components: {
    Fragment
  }
})
export default class MainMenuDropdown extends Vue {

  showSettings(): void {
    this.$modal.show(SettingsModal, {}, {
      adaptive: true,
      clickToClose: true,
      width: '1024px',
      height: 'auto',
    })
  }

  showAbout(): void {
    this.$modal.show(AboutProgramModal, {}, {
      clickToClose: true,
      height: 'auto'
    })
  }
}
</script>
