<template>
  <div class="modal modal--delete-category">
    <header class="modal_header">
      <h1>{{ $t('modals.deleteCatalog.title') }}</h1>
    </header>
    <div class="modal_content">
      <p>{{ $t('modals.deleteCatalog.description') }}</p>
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
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class DeleteCatalogModal extends Vue {
  @Prop({ type: String, required: true }) readonly database!: string;
  busy = false

  async onSubmit(): Promise<void> {
    this.busy = true;
    try {
      await this.$deleteDatabase(this.database);
    } catch (err) {
      console.error(err);
    } finally {
      this.busy = false;
      this.$router.push('/library');
      this.$emit('close');
    }
  }
}
</script>
