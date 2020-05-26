<template>
  <div class="modal modal--add-category">
    <header class="modal_header">
      <h2>{{ $t('modals.addCategory.title') }}</h2>
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
        {{ $t('common.buttons.add') }}
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
import Vue from 'vue';
import Component from 'vue-class-component';
import Integrations from '@/plugins/models-db/integrations/main';
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ValidationObserver
  }
})
export default class AddCategoryModal extends Vue {
  title = ''

  onSubmit(): void {
    (this.$refs.form as InstanceType<typeof ValidationObserver>).validate()
      .then(async(success: boolean) => {
        if (success) {
          const db = new Integrations.local(this.$route.params.database);
          const { category } = this.$route.params;
          const slug = this.$stringToSlug(this.title);
          const parentId = category !== undefined ? parseInt(category, 10) : -1;

          const query = `INSERT INTO categories
          VALUES (null, ${parentId}, '${slug}', '${this.title}')`;

          const result = await db.runQuery(query);

          if (result) {
            const categories = await db.fetchItemsFromDatabase('SELECT * FROM \'categories\'');
            this.$store.commit('setCategories', categories);
            this.$emit('close');
          }
        }
      });
  }
}
</script>
