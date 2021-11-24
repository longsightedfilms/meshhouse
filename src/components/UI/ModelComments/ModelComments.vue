<template>
  <div class="model-comments">
    <h1>{{ $t('modals.model.comments') }}</h1>
    <div
      v-for="(comment, idx) in comments"
      :key="`comment-${idx}`"
      class="comment"
    >
      <header class="comment__header">
        <img
          :src="comment.avatar"
          :alt="comment.name"
          class="comment__avatar"
          loading="lazy"
        >
        <div class="comment__info">
          <b class="username">
            {{ comment.name }}
          </b>
          <p class="date">
            {{ $formatDateRelative(comment.date) }}
          </p>
        </div>
      </header>
      <p class="comment__message">
        {{ comment.message }}
      </p>
    </div>
  </div>
</template>
<style src="./ModelComments.sass" lang="sass"></style>
<script src="./ModelComments.ts" lang="ts"></script>
