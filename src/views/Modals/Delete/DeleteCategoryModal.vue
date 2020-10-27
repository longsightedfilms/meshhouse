<template>
  <div class="modal modal--delete-category">
    <header class="modal_header">
      <h1>{{ $t('modals.deleteCategory.title') }}</h1>
    </header>
    <div class="modal_content">
      <p>{{ $t('modals.deleteCategory.description') }}</p>
    </div>
    <div class="modal_actions">
      <v-button
        type="primary"
        :busy="busy"
        @click="onSubmit"
      >
        {{ $t('common.buttons.delete') }}
      </v-button>
      <v-button
        :disabled="busy"
        @click="$emit('close')"
      >
        {{ $t('common.buttons.cancel') }}
      </v-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class DeleteCategoryModal extends Vue {
  busy = false

  async onSubmit(): Promise<void> {
    this.busy = true;
    try {
      const categories = await this.$ipcInvoke('delete-category', {
        type: 'local',
        title: this.$route.params.database,
        id: this.$store.state.controls.properties.id
      });

      this.$store.commit('setCategories', categories);
      this.$emit('close');
    } catch (err) {
      this.$emit('close');
      this.busy = false;
    }
  }
}
</script>
