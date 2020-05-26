<template>
  <div class="updated">
    <h1>
      {{ $t('views.catalog.updated.title') }}
    </h1>
    <p>
      {{ $t('views.catalog.updated.description') }}
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class Updated extends Vue {}
</script>
