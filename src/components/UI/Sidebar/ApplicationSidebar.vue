<template>
  <aside
    class="application__sidebar"
    :class="isVisible ? 'visible' : ''"
  >
    <button
      class="show-databases"
      :title="$t('common.buttons.showCatalogs')"
      @click="toggleVisibility"
    >
      <p>{{ $t('common.buttons.showCatalogs') }}</p>
      <vue-icon
        :style="flipIcon"
        icon="caret-back"
        raster
      />
    </button>
    <nav v-bar>
      <div class="nav-container">
        <div>
          <div v-if="!ifIntegrationsHidden">
            <label class="label">{{ $t('common.types.databases.remote') }}</label>
            <div>
              <sidebar-link
                v-for="item in filteredRemoteDB"
                :key="'remote-' + item.title"
                :navlink="item"
                :progress="computeProgressLength(item.title)"
              />
            </div>
          </div>
          <div>
            <label class="label">{{ $t('common.types.databases.local') }}</label>
            <div>
              <sidebar-link
                v-for="item in filteredLocalDB"
                :key="'local-' + item.title"
                :navlink="item"
                :progress="computeProgressLength(item.title)"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import SidebarLink from '@/components/UI/Sidebar/SidebarLink.vue';

@Component({
  components: {
    SidebarLink,
  }
})
export default class ApplicationSidebar extends Vue {
  mounted(): void {
    if(this.$settingsGet('databasesVisible') !== undefined) {
      this.$store.commit('setDBVisibility', this.$settingsGet('databasesVisible'));
    }
    if(this.$settingsGet('hideIntegrations') !== undefined) {
      this.$store.commit('hideIntegrations', this.$settingsGet('hideIntegrations'));
    }
  }

  get flipIcon(): object {
    return !this.isVisible ? {
      transform: 'translateX(-1px) rotate(180deg)'
    } : {};
  }

  get isVisible(): boolean {
    return this.$store.state.controls.databasesVisible;
  }

  get filteredRemoteDB(): DatabaseItem[] {
    return this.$store.state.db.databases.filter((db: DatabaseItem) => db.localDB === false);
  }

  get filteredLocalDB(): DatabaseItem[] {
    return this.$store.state.db.databases.filter((db: DatabaseItem) => db.localDB === true);
  }

  get ifIntegrationsHidden(): boolean {
    return this.$store.state.controls.hideIntegrations;
  }

  computeProgressLength(title: string): number {
    let totalSpace = 0;
    const { databases } = this.$store.state.db;
    const idx = databases.findIndex((db: DatabaseItem) => db.title === title);

    databases.forEach((db: DatabaseItem) => {
      totalSpace += Number(db.totalsize);
    });

    if (databases[idx].totalsize === 0) {
      return 0;
    } else {
      return 100 / (totalSpace / Number(databases[idx].totalsize));
    }
  }

  toggleVisibility(val: boolean): void {
    this.$store.commit('setDBVisibility', !this.$store.state.controls.databasesVisible);
    this.$settingsSet('databasesVisible', this.$store.state.controls.databasesVisible);
  }
}
</script>
