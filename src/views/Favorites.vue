<template>
  <main class="layout layout--favorites">
    <div class="favorites__header">
      <h1>{{ $t('views.favorites.title') }}</h1>
      <p>{{ $tc('views.favorites.items', favoritesList.length) }}</p>
    </div>
    <div class="favorites__list">
      <div
        v-for="(favorite, idx) in favoritesList"
        :key="idx"
        class="favorite"
      >
        <img
          class="favorite__image"
          :src="favorite.thumbnail"
          :alt="favorite.title"
        >
        <div class="favorite__info">
          <h2>{{ favorite.title }} [{{ favorite.database }}]</h2>
          <p>{{ $t('views.favorites.date', { date: $formatDate(favorite.createdAt) }) }}</p>
        </div>
        <div class="favorite__actions">
          <button
            class="button button--flat"
            @click="redirectToItem(favorite)"
          >
            {{ $t('views.favorites.showItem') }}
          </button>
          <button
            class="button button--flat button--icon-only"
            :title="$t('views.favorites.delete')"
            @click="removeFromList(favorite)"
          >
            <vue-icon icon="recycle-bin" />
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component<Favorites>({
  metaInfo() {
    return {
      title: this.$t('views.favorites.title').toString()
    };
  }
})
export default class Favorites extends Vue {
  favoritesList: Favorite[] = []

  async created(): Promise<void> {
    this.favoritesList = await this.$ipcInvoke('get-favorites-list');
  }

  async removeFromList(item: Favorite): Promise<void> {
    try {
      await this.$ipcInvoke('remove-favorite', item);
      const idx = this.favoritesList.findIndex((favorite) => favorite.id === item.id);
      this.favoritesList.splice(idx, 1);
    } catch (err) {
      console.error(err);
    }
  }

  redirectToItem(item: Favorite): void {
    this.$router.push(`/model/${item.database}/${item.remoteId}`);
  }
}
</script>
