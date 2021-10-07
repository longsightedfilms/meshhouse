<template>
  <main class="layout layout--sidebar">
    <aside class="layout__sidebar">
      <label class="sidebar-heading">{{ $t('views.favorites.title') }}</label>
      <button
        class="sidebar-nav"
        @click="$router.back()"
      >
        <vue-icon
          class="sidebar-nav__icon"
          icon="home"
        />
      </button>
      <button
        v-for="item in integrationsList"
        :key="item.slug"
        class="sidebar-nav"
        :class="selectedFilter === item.slug ? 'sidebar-nav--active' : ''"
        @click="selectedFilter = item.slug"
      >
        <img
          v-if="item.icon !== ''"
          class="sidebar-nav__icon sidebar-nav__icon--lg"
          :src="retrieveImage(item.icon)"
        >
        {{ item.title }}
        <span class="sidebar-nav__badge">
          {{ item.count }}
        </span>
      </button>
    </aside>
    <main class="layout__content">
      <div
        v-if="visibleFavorites.length > 0"
        class="favorites__grid"
      >
        <div
          v-for="(favorite, idx) in visibleFavorites"
          :key="idx"
          class="favorite"
          tabindex="-1"
          @dblclick="redirectToItem(favorite)"
        >
          <img
            class="favorite__image"
            :src="favorite.thumbnail"
            :alt="favorite.title"
          >
          <img
            class="favorite__integration"
            :src="retrieveImage(getIntegrationIcon(favorite.database))"
          >
          <div class="favorite__date">
            <vue-icon
              icon="calendar"
              raster
            />
            <p>{{ $formatDate(favorite.createdAt) }}</p>
          </div>
          <p class="favorite__title">
            {{ favorite.title }}
          </p>
          <button
            class="button button--flat button--flat-danger button--icon-only"
            :title="$t('views.favorites.delete')"
            @click="removeFromList(favorite)"
          >
            <vue-icon icon="recycle-bin" />
          </button>
        </div>
      </div>
      <div
        v-else
        class="favorites__empty"
      >
        <vue-icon icon="box" />
        <h1>
          {{ $t('views.favorites.empty') }}
        </h1>
        <p>
          {{ $t('views.favorites.emptyNotice') }}
        </p>
      </div>
    </main>
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
  selectedFilter = 'all'

  get integrationsList(): any[] {
    const items = [
      {
        title: this.$i18n.t('common.list.all'),
        slug: 'all',
        icon: '',
        count: this.favoritesList.length
      }
    ];
    const integrations = this.$store.state.db.databases.integrations;

    for (const key in integrations) {
      items.push({
        title: integrations[key].title,
        slug: integrations[key].url,
        icon: integrations[key].icon,
        count: this.favoritesList.filter((favorite: Favorite) => favorite.database === integrations[key].url).length
      });
    }

    return items;
  }

  get visibleFavorites(): Favorite[] {
    if (this.selectedFilter === 'all') {
      return this.favoritesList;
    }

    return this.favoritesList.filter((favorite: Favorite) => favorite.database === this.selectedFilter);
  }

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

  retrieveImage(icon?: string): string {
    if (icon) {
      if (!icon.includes('@/')) {
        return this.$forceReloadImage(icon);
      } else {
        return `/assets/integrations/${icon.substr(2)}`;
      }
    } else {
      return '#';
    }
  }

  getIntegrationIcon(db: string): string {
    return this.$store.state.db.databases.integrations[db].icon || '';
  }
}
</script>
