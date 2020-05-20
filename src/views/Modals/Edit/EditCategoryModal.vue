<template>
  <div class="modal modal--add-category">
    <header class="modal_header">
      <h2>{{ $t('modals.editCategory.title') }}</h2>
    </header>
    <div class="modal_content">
      <ValidationObserver ref="form">
        <ValidationProvider
          v-slot="{ errors }"
          name="categoryTitle"
          class="input-group"
          rules="required"
          immediate
        >
          <label>{{ $t('fields.categoryTitle') }}</label>
          <input
            v-model="title"
            type="text"
            class="input"
            :placeholder="$t('modals.addCatalog.hints.name')"
          >
          <span class="input__message">
            {{ errors[0] }}
          </span>
        </ValidationProvider>
      </ValidationObserver>
    </div>
    <div class="modal_actions">
      <button
        class="button button--primary"
        @click="onSubmit"
      >
        {{ $t('common.buttons.save') }}
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
import { ValidationObserver } from 'vee-validate'

@Component({
  components: {
    ValidationObserver
  }
})
export default class EditCategoryModal extends Vue {
  title = ''

  mounted(): void {
    this.title = this.$store.state.controls.properties.name
  }

  onSubmit(): void {
    (this.$refs.form as InstanceType<typeof ValidationObserver>).validate()
      .then(async (success: boolean) => {
        if (success) {
          const db = new Integrations.local(this.$route.params.database)
          const { category } = this.$route.params
          const slug = this.$stringToSlug(this.title)
          const id = this.$store.state.controls.properties.id

          const query = `UPDATE categories
          SET slug = '${slug}', name = '${this.title}'
          WHERE id = ${id}`

          const result = await db.runQuery(query)

          if (result) {
            const categories = await db.fetchCategories()
            this.$store.commit('setCategories', categories)
            this.$emit('close')
          }
        }
      })
  }
}
</script>
