<template>
  <fragment>
    <li>
      <a @click.prevent="openCatalog">
        <vue-icon
          icon="folder"
          inverted
        />
        {{ $t('context.catalog.open') }}
      </a>
    </li>
    <li v-if="!isRemoteDatabase">
      <a @click.prevent="editCatalog">
        <vue-icon
          icon="edit"
          inverted
        />
        {{ $t('context.catalog.properties') }}
      </a>
    </li>
    <li v-if="!isRemoteDatabase">
      <a @click.prevent="deleteCatalog">
        <vue-icon
          icon="recycle-bin"
          inverted
        />
        {{ $t('context.catalog.delete') }}
      </a>
    </li>
  </fragment>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Fragment } from 'vue-fragment';

@Component({
  components: {
    Fragment
  }
})
export default class CatalogContext extends Vue {
  @Prop({ required: true }) readonly database!: DatabaseItem

  get isRemoteDatabase(): boolean {
    return this.database !== null ? this.database.localDB === false : false;
  }

  openCatalog(): void {
    this.$router.push({
      path: `/db/local/${this.database.url}`
    });
  }

  editCatalog(): void {
    this.$closeSidebar();
    this.$store.commit('setProperties', this.database);
    this.$modal.show(this.$modal_EditCatalogModal, {}, {
      adaptive: true,
      clickToClose: true,
      width: '100%',
      height: '100%',
    }, {
      'before-open': () => {
        this.$store.commit('setModalVisibility', true);
      },
      'before-close': () => {
        this.$store.commit('setModalVisibility', false);
      }
    });
  }

  deleteCatalog(): void {
    this.$closeSidebar();
    this.$showDialog('delete-catalog', { database: this.database.url });
  }
}
</script>
