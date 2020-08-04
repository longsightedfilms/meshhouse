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
        Установить модель
      </a>
    </li>
    <li v-if="$store.state.controls.properties.installed">
      <a @click.prevent="deleteModel()">
        <vue-icon
          icon="recycle-bin"
          inverted
        />
        Удалить модель
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
    await db.downloadItem(item);
  }

  async deleteModel(): Promise<void> {
    const item = this.$store.state.controls.properties;
    const db = new Integrations[this.$route.params.database]();
    await db.deleteItem(item);
  }

  openProperties(): void {
    this.$openPropertiesModal(this.$store.state.controls.properties).then(() => {
      this.$modal.show(EditPropertiesModal, {}, {
        clickToClose: true,
        width: '450px',
        height: 'auto',
        pivotX: 1.0,
        pivotY: 1.0,
      });
    });
  }
}
</script>
