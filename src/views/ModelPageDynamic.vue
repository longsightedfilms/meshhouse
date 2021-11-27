<template>
  <component
    :is="component"
    :model="model"
    :favorite="favorite"
    @update:favorite="(v) => favorite = v"
  />
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { Vue, Component } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { INTEGRATIONS } from '@/constants';

@Component<ModelPage>({
  components: {
    Remote: (): Promise<typeof import('*.vue')> => import('@/views/ModelPage/Remote.vue')
  },
  async beforeRouteEnter(to: Route, from: Route, next: Function) {
    if (INTEGRATIONS.includes(to.params.database)) {
      const isFavorite = await window.ipc.invoke('is-in-favorite', {
        database: to.params.database,
        remoteId: to.params.id
      });

      const data = await window.ipc.invoke('get-single-model-integration', {
        type: 'remote',
        title: to.params.database,
        item: {
          id: to.params.id
        }
      });

      next((vm: ModelPage) => {
        vm.model = data;
        vm.favorite = isFavorite;
      });
    }
  },
  async beforeRouteUpdate(to: Route, from: Route, next: Function) {
    if (INTEGRATIONS.includes(to.params.database)) {
      const isFavorite = await window.ipc.invoke('is-in-favorite', {
        database: to.params.database,
        remoteId: to.params.id
      });

      const data = await window.ipc.invoke('get-single-model-integration', {
        type: 'remote',
        title: to.params.database,
        item: {
          id: to.params.id
        }
      });

      this.model = data;
      this.favorite = isFavorite;

      next();
    }
  },
  metaInfo() {
    return {
      title: this.model.title ?? ''
    };
  }
})
export default class ModelPage extends Vue {
  model: RemoteModel = {
    id: 0,
    title: '',
    author: '',
    created_at: 0,
    updated_at: 0,
    description: '',
    thumbnail: '',
    images: [],
    image_thumbs: [],
    links: [],
    extension: '',
    file_size: '',
    tags: [],
    commentaries: []
  }

  favorite = false

  get component(): string {
    const db = this.$route.params.database;
    return INTEGRATIONS.includes(db) ? 'Remote' : 'Local';
  }
}
</script>
