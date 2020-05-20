<template>
  <div class="modal modal--delete-category">
    <header class="modal_header">
      <h2>{{ $t('modals.deleteCategory.title') }}</h2>
    </header>
    <div class="modal_content">
      <p>{{ $t('modals.deleteCategory.description') }}</p>
    </div>
    <div class="modal_actions">
      <button
        class="button button--primary"
        @click="onSubmit"
      >
        {{ $t('common.buttons.delete') }}
      </button>
      <button
        class="button button--danger"
        @click="$emit('close')"
      >
        {{ $t('common.buttons.close') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Integrations from '@/plugins/models-db/integrations/main'

@Component({})
export default class DeleteCategoryModal extends Vue {
  async onSubmit(): Promise<void> {
    const db = new Integrations.local(this.$route.params.database)
    const { id } = this.$store.state.controls.properties

    let query = `UPDATE models
    SET category = NULL
    WHERE category in (
      SELECT id from categories
      WHERE id = ${id}
      or parentId = ${id}
    )`

    await db.runQuery(query)

    query = `DELETE FROM categories
    WHERE id = ${id}
    OR parentId = ${id}`

    const result = await db.runQuery(query)

    if (result) {
      const categories = await db.fetchCategories()
      this.$store.commit('setCategories', categories)
      this.$emit('close')
    }
  }
}
</script>
