<template>
  <aside class="application__sidebar">
    <button
      class="show-databases"
      @click="toggleVisibility"
    >
      <vue-icon
        :style="flipIcon"
        icon="caret-back"
        inverted
        raster
      />
    </button>
    <nav v-bar>
      <div class="nav-container">
        <div>
          <label>{{ $t('common.types.databases.remote') }}</label>
          <div>
            <sidebar-link
              v-for="(item, index) in filteredRemoteDB"
              :key="'remote-' + item.title"
              :navlink="item"
              :progress="computeProgressLength(index)"
            />
          </div>
          <label>{{ $t('common.types.databases.local') }}</label>
          <div>
            <sidebar-link
              v-for="(item, index) in filteredLocalDB"
              :key="'local-' + item.title"
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
      transform: `translateX(-1px) rotate(180deg)`
    } : {}
  }

  get filteredRemoteDB(): DatabaseItem[] {
    return this.$store.state.db.databases.filter((db: DatabaseItem) => db.localDB === false)
  }

  get filteredLocalDB(): DatabaseItem[] {
    return this.$store.state.db.databases.filter((db: DatabaseItem) => db.localDB === true)
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
