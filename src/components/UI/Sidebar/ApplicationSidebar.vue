<template>
  <aside class="application__sidebar">
    <button
      class="show-databases"
      @click="toggleVisibility"
    >
      <font-awesome-icon
        icon="angle-left"
        size="2x"
        :style="flipIcon"
      />
    </button>
    <nav v-bar>
      <div class="nav-container">
        <div>
          <label>{{ $t('common.types.databases.remote') }}</label>
          <div
            v-for="(item, index) in $store.state.db.databases"
            :key="'remote-' + item.title"
          >
            <sidebar-link
              v-if="!item.localDB"
              :navlink="item"
              :progress="computeProgressLength(index)"
            />
          </div>
          <label>{{ $t('common.types.databases.local') }}</label>
          <div
            v-for="(item, index) in $store.state.db.databases"
            :key="'local-' + item.title"
          >
            <sidebar-link
              v-if="item.localDB"
              :navlink="item"
              :progress="computeProgressLength(index)"
            />
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import SidebarLink from '@/components/UI/Sidebar/SidebarLink.vue'

@Component({
  components: {
    SidebarLink,
  }
})
export default class ApplicationSidebar extends Vue {
  mounted(): void {
    if(this.$settingsGet('databasesVisible') !== undefined) {
      this.$store.commit('setDBVisibility', this.$settingsGet('databasesVisible'))
    }
  }

  get flipIcon(): object {
    const { databasesVisible } = this.$store.state.controls
    return !databasesVisible ? {
      transform: `rotate(180deg)`
    } : {}
  }

  computeProgressLength(idx: number): number {
    let totalSpace = 0
    const { databases } = this.$store.state.db
    databases.forEach((db: any) => {
      totalSpace += Number(db.totalsize)
    })
    return 100 / (totalSpace / Number(databases[idx].totalsize))
  }

  toggleVisibility(val: boolean): void {
    this.$store.commit('setDBVisibility', !this.$store.state.controls.databasesVisible)
    this.$settingsSet('databasesVisible', this.$store.state.controls.databasesVisible)
  }
}
</script>
