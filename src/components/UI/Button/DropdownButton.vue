<template>
  <div
    v-on-clickaway="onClickedOutside"
    class="dropdown"
  >
    <button
      class="button button--flat"
      :title="hint"
      @click="toggleDropdown"
    >
      <slot name="button">
        Dropdown
      </slot>
    </button>
    <nav :class="menuClass">
      <slot name="default">
        <li>
          <a href="#">Test item 1</a>
        </li>
      </slot>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mixin as clickaway } from 'vue-clickaway'

@Component({
  mixins: [
    clickaway
  ],
  props: {
    hint: {
      type: String,
      required: false,
      default: ''
    }
  }
})
export default class DropdownButton extends Vue {
  toggled = false

  get menuClass(): string {
    return `dropdown__menu ${this.toggled ? 'show' : ''}`
  }

  toggleDropdown(event: any): void {
    this.toggled = !this.toggled
  }

  onClickedOutside(event: any): void {
    this.toggled = false
  }
}
</script>
