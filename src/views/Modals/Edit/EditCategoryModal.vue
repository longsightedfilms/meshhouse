<template>
  <div class="modal modal--add-category">
    <header class="modal_header">
      <h1>{{ $t('modals.editCategory.title') }}</h1>
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
        {{ $t('common.buttons.save') }}
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
export default class EditCategoryModal extends Vue {
  busy = false
  title = ''

  mounted(): void {
    this.title = this.$store.state.controls.properties.name;
  }

  onSubmit(): void {
    (this.$refs.form as InstanceType<typeof ValidationObserver>).validate()
      .then(async(success: boolean) => {
        if (success) {
          this.busy = true;
          try {
            const { category, database } = this.$route.params;
            const slug = this.$stringToSlug(this.title);
            const id = this.$store.state.controls.properties.id;

            const categories = await this.$ipcInvoke('update-category', {
              type: 'local',
              title: database,
              slug,
              categoryTitle: this.title,
              id
            });
            this.$store.commit('setCategories', categories);
            this.$emit('close');
            this.busy = false;
          } catch (err) {
            this.$emit('close');
            this.busy = false;
          }
        }
      });
  }
}
</script>
