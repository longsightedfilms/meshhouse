<template>
  <div class="modal modal--updater">
    <header class="modal_header">
      <h2>{{ $t('modals.updater.title') }}</h2>
    </header>
    <div class="modal_content">
      <p>{{ $t('modals.updater.notAvailable') }}</p>
    </div>
    <div class="modal_actions">
      <button
        class="button button--primary"
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

@Component({})
export default class UpdateNotAvailableModal extends Vue {}
</script>
