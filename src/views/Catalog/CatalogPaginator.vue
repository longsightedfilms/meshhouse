<template>
  <div
    class="paginator"
    :class="!$store.state.controls.isLoaded ? 'disabled' : ''"
  >
    <router-link
      :to="generateLink(1)"
      :disabled="activePage === 1"
      :title="$t('hints.paginator.first')"
      class="paginator-item paginator-item-first"
    >
      <vue-icon
        icon="double-left"
        raster
      />
    </router-link>
    <router-link
      :to="generateLink((activePage - 1))"
      :disabled="activePage === 1"
      :title="$t('hints.paginator.prev')"
      class="paginator-item paginator-item-prev"
    >
      <vue-icon
        icon="caret-back"
        raster
      />
    </router-link>
    <router-link
      v-for="idx in paginatorPages"
      :key="idx"
      :to="generateLink(idx)"
      :disabled="activePage === idx"
      :title="$t('hints.paginator.page', { page: idx })"
      class="paginator-item"
    >
      {{ idx }}
    </router-link>
    <router-link
      :to="generateLink((activePage + 1) < totalPages ? (activePage + 1) : totalPages)"
      :disabled="activePage === totalPages"
      :title="$t('hints.paginator.next')"
      class="paginator-item paginator-item-next"
    >
      <vue-icon
        icon="caret-back"
        raster
      />
    </router-link>
    <router-link
      :to="generateLink(totalPages)"
      :disabled="activePage === totalPages"
      :title="$t('hints.paginator.last')"
      class="paginator-item paginator-item-last"
    >
      <vue-icon
        icon="double-left"
        raster
      />
    </router-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

@Component({
  props: {
    totalPages: {
      type: Number,
      required: true,
      default: 1
    }
  }
})
export default class CatalogPaginator extends Vue {
  get activePage(): number {
    return this.$route.params.page !== undefined ? Number(this.$route.params.page) : 1;
  }

  get paginatorPages(): number[] {
    const arr: number[] = [];
    for (let i = 1; i <= this.$props.totalPages; i++) {
      arr.push(i);
    }
    const pages = Number(this.activePage) + 10;
    const slicedArr = arr.slice(this.activePage - 1, pages);
    if (this.$props.totalPages < 10) {
      return arr;
    }
    if (slicedArr.length <= 10) {
      return arr.slice(this.activePage - pages - 1, pages);
    }
    return arr.slice(this.activePage - 1, pages);
  }

  generateLink(index: number): any {
    if (index === 1 || index === 0) {
      return {
        name: 'RemoteDatabase',
        params: {
          database: this.$route.params.database
        }
      };
    }
    return {
      name: 'RemoteDatabase',
      params: {
        database: this.$route.params.database,
        page: index
      }
    };
  }
}
</script>
