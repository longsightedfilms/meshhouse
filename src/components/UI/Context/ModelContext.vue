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
import RemoteModelInfoModal from '@/views/Modals/RemoteModelInfoModal.vue';
import Integrations from '@/plugins/models-db/integrations/main';
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
    const item = this.$store.state.controls.properties;
    const db = new Integrations[this.$route.params.database]();
    await db.downloadHandle(item);
  }

  async installOtherFileModel(): Promise<void> {
    const item = this.$store.state.controls.properties;
    const db = new Integrations[this.$route.params.database]();
    await db.updateHandle(item);
  }

  async deleteModel(): Promise<void> {
    const item = this.$store.state.controls.properties;
    const db = new Integrations[this.$route.params.database]();
    await db.deleteItem(item);
  }

  async openRemoteInfo(): Promise<void> {
    const item = this.$store.state.controls.properties;
    const db = new Integrations[this.$route.params.database]();
    await db.fetchSingleModel(item);
    this.$modal.show(RemoteModelInfoModal, {}, {
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
