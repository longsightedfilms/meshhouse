<template>
  <main class="layout layout--tabs">
    <aside class="tab__navigation">
      <button
        class="navigation__button"
        @click="backRoute"
      >
        <vue-icon icon="home" />
      </button>
      <div
        v-for="setting in settingsList"
        :key="setting.title"
      >
        <label class="navigation__label">{{ $t(setting.title) }}</label>
        <div>
          <button
            v-for="submenu in setting.submenus"
            :key="submenu.component"
            class="navigation__button"
            :class="selected === submenu.component ? 'active' : ''"
            @click="selected = submenu.component"
          >
            <vue-icon
              v-if="submenu.icon"
              :icon="submenu.icon.title"
              :raster="submenu.icon.raster"
            />
            {{ $t(submenu.title) }}
          </button>
        </div>
      </div>
    </aside>
    <main
      class="tab__container"
      @click="handleClicks"
    >
      <component :is="selected" />
    </main>
  </main>
</template>

<script src="./Index.ts" lang="ts"></script>
