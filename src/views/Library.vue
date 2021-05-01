<template>
  <main class="layout layout--library">
    <div class="library__header">
      <h1>{{ $t('views.catalog.library.title') }}</h1>
      <p>{{ $t('views.catalog.library.total', { count: totalModelsCount, size: $formatSize(totalModelsSize) }) }}</p>
    </div>
    <vue-context ref="menu">
      <catalog-context :database="selectedDatabase" />
    </vue-context>
    <div class="library__grid">
      <library-card
        v-for="entry in libraryEntries"
        :key="entry.title"
        :database="entry"
        @contextmenu="(e) => selectDatabase(e, entry)"
      />
      <library-card
        is-add-button
      />
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import VueContext from 'vue-context';
import LibraryCard from '@/components/UI/Card/LibraryCard.vue';
import CatalogContext from '@/components/UI/Context/CatalogContext.vue';

@Component({
  components: {
    CatalogContext,
    LibraryCard,
    VueContext
  },
  metaInfo: {
    title: 'Meshhouse',
    titleTemplate: ''
  }
})
export default class Library extends Vue {
  selectedDatabase: DatabaseItem | null = null;

  get ifIntegrationsHidden(): boolean {
    return this.$store.state.settings.hideIntegrations;
  }

  get libraryEntries(): DatabaseItem[] {
    const integrations: any = this.$store.state.db.databases.integrations;
    const local: DatabaseItem[] = this.$store.state.db.databases.local;

    if (this.ifIntegrationsHidden) {
      return local;
    } else {
      const integrationArray: DatabaseItem[] = Object.values(integrations);
      return integrationArray.concat(local);
    }
  }

  get totalModelsCount(): number {
    return this.libraryEntries.reduce((prev, next) => prev + Number(next.count), 0);
  }

  get totalModelsSize(): number {
    return this.libraryEntries.reduce((prev, next) => prev + Number(next.totalsize), 0);
  }

  selectDatabase(event: Event, db: DatabaseItem): void {
    if (!db.disabled) {
      this.selectedDatabase = db;
      (this.$refs.menu as any).open(event);
    }
  }
}
</script>
