<template>
  <div
    v-on-clickaway="onClickedOutside"
    class="dropdown"
  >
    <button
      v-on-clickaway="onClickedInside"
      class="button button--flat button--icon-only"
      :title="hint"
      @click.prevent="toggleDropdown"
    >
      <slot name="button">
        Dropdown
      </slot>
      <span
        v-if="notify"
        class="button__notify"
      />
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
<style src="./DropdownButton.sass" lang="sass"></style>
<script src="./DropdownButton.ts" lang="ts"></script>
