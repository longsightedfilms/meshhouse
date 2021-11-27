<template>
  <div
    class="model-card"
    @dblclick="$openItem(model.path)"
    @contextmenu.prevent="onRightClick"
    @dragstart="onDrag"
  >
    <model-image-local
      :model="model"
    />
    <div class="model-card__title">
      <p>{{ model.name }}</p>
    </div>
    <div class="model-card__properties">
      <p class="size">
        {{ $formatSize(model.size || 0) }}
      </p>
      <p class="extension">
        {{ $returnHumanLikeExtension(model.extension) }}
      </p>
      <p class="path">
        {{ model.path }}
      </p>
    </div>
  </div>
</template>
<style src="./ModelCard.sass" lang="sass"></style>
<script src="./ModelCardLocal.ts" lang="ts"></script>
