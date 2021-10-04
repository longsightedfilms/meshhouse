<template>
  <fragment v-if="isRemoteItem">
    <li v-if="$store.state.controls.properties.installed">
      <a @click.prevent="$openFolder($store.state.controls.properties.path)">
        <vue-icon
          icon="folder"
          inverted
        />
        {{ $t('context.model.openFolder') }}
      </a>
    </li>
    <li v-if="!$store.state.controls.properties.installed">
      <a @click.prevent="installModel()">
        <vue-icon
          icon="download-from-cloud"
          inverted
        />
        {{ $t('context.model.install') }}
      </a>
    </li>
    <li v-if="$store.state.controls.properties.installed">
      <a @click.prevent="installOtherFileModel()">
        <vue-icon
          icon="download-from-cloud"
          inverted
        />
        {{ $t('context.model.update') }}
      </a>
    </li>
    <li v-if="$store.state.controls.properties.installed">
      <a @click.prevent="deleteModel()">
        <vue-icon
          icon="recycle-bin"
          inverted
        />
        {{ $t('context.model.delete') }}
      </a>
    </li>
    <li>
      <a @click.prevent="handleFavorites()">
        <vue-icon
          icon="bookmark"
          raster
          inverted
        />
        {{ $t(`views.favorites.${!$store.state.controls.properties.favorite ? 'add' : 'delete'}`) }}
      </a>
    </li>
    <li>
      <a @click.prevent="openRemoteInfo()">
        <vue-icon
          icon="edit"
          inverted
        />
        {{ $t('context.model.remoteInfo') }}
      </a>
    </li>
  </fragment>
  <fragment v-else>
    <li>
      <a @click.prevent="$openItem($store.state.controls.properties.path)">
        {{ $t('context.model.open') }}
      </a>
    </li>
    <li>
      <a @click.prevent="$openFolder($store.state.controls.properties.path)">
        <vue-icon
          icon="folder"
          inverted
        />
        {{ $t('context.model.openFolder') }}
      </a>
    </li>
    <li>
      <a @click.prevent="openProperties">
        <vue-icon
          icon="edit"
          inverted
        />
        {{ $t('context.model.properties') }}
      </a>
    </li>
  </fragment>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import EditPropertiesModal from '@/views/Modals/Edit/EditPropertiesModal.vue';
import { Fragment } from 'vue-fragment';

@Component({
  components: {
    Fragment
  }
})
export default class ModelContext extends Vue {
  get isRemoteItem(): boolean {
    return Object.hasOwnProperty.call(this.$store.state.controls.properties, 'installed');
  }

  async installModel(): Promise<void> {
    await this.$ipcInvoke('download-handle-integration', {
      type: 'remote',
      title: this.$route.params.database,
      item: this.$store.state.controls.properties
    });
  }

  async installOtherFileModel(): Promise<void> {
    await this.$ipcInvoke('update-handle-integration', {
      type: 'remote',
      title: this.$route.params.database,
      item: this.$store.state.controls.properties
    });
  }

  async deleteModel(): Promise<void> {
    await this.$ipcInvoke('delete-item-integration', {
      type: 'remote',
      title: this.$route.params.database,
      item: this.$store.state.controls.properties
    });
  }

  async handleFavorites(): Promise<void> {
    const payload = {
      database: this.$route.params.database,
      remoteId: this.$store.state.controls.properties.remoteId,
      thumbnail: this.$store.state.controls.properties.images ? this.$store.state.controls.properties.images[0] : this.$store.state.controls.properties.image ?? '',
      title: this.$store.state.controls.properties.name
    };

    try {
      const method = this.$store.state.controls.properties.favorite
        ? 'remove-favorite'
        : 'add-favorite';

      await this.$ipcInvoke(method, payload);
      this.$store.commit('setLocalFavorite', {
        id: this.$store.state.controls.properties.remoteId,
        status: method === 'add-favorite'
      });
    } catch (err) {
      console.error(err);
    }
  }

  openRemoteInfo(): void {
    this.$router.push(`/model/${this.$route.params.database}/${this.$store.state.controls.properties.id}`);
  }

  openProperties(): void {
    this.$openPropertiesModal(this.$store.state.controls.properties).then(() => {
      this.$modal.show(EditPropertiesModal, {}, {
        clickToClose: true,
        width: '1024px',
        height: 'auto',
        pivotX: 1.0,
        pivotY: 1.0,
      });
    });
  }
}
</script>
