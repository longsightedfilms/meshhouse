<template>
  <div class="modal modal--add-category">
    <header class="modal_header">
      <h1>{{ $t('modals.addCategory.title') }}</h1>
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
      <v-button
        type="primary"
        :busy="busy"
        @click="onSubmit"
      >
        {{ $t('common.buttons.add') }}
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
import { ValidationObserver } from 'vee-validate';

@Component({
  components: {
    ValidationObserver
  }
})
export default class AddCategoryModal extends Vue {
  busy = false
  title = ''

  onSubmit(): void {
    (this.$refs.form as InstanceType<typeof ValidationObserver>).validate()
      .then(async(success: boolean) => {
        if (success) {
          this.busy = true;

          try {
            const { category } = this.$route.params;
            const slug = this.$stringToSlug(this.title);
            const parentId = category !== undefined ? parseInt(category, 10) : -1;

            const categories = await this.$ipcInvoke('add-category', {
              type: 'local',
              title: this.$route.params.database,
              slug,
              categoryTitle: this.title,
              parentId
            });

            this.$store.commit('setCategories', categories);
            this.$emit('close');
          } catch (err) {
            this.$emit('close');
            this.busy = false;
          }
        }
      });
  }
}
</script>
