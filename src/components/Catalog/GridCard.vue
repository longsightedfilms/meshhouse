<template>
  <v-card>
    <v-img
      :src="$forceReloadImage(item.image)"
      aspect-ratio="1"
      class="grey lighten-2"
      max-height="300"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-icon
            color="grey"
            size="200"
          >
            mdi-file-image
          </v-icon>
        </v-row>
      </template>
      <v-card-title class="align-end fill-height">
        <div class="v-title-dark">
          <span
            class="title"
            style="word-break: break-word;"
          >
            {{ item.name }}
          </span>
          <div class="flex-grow-1" />
          <v-avatar
            class="ml-2"
            size="24"
            tile
          >
            <img :src="$returnExtensionIcon(item.extension)">
          </v-avatar>
        </div>
      </v-card-title>
    </v-img>
    <v-card-text>
      <ul class="v-ul no-dots">
        <li class="d-flex align-center">
          <v-icon>
            mdi-card-text-outline
          </v-icon>
          <p
            v-if="item.category !== ''"
            class="ma-0 ml-2"
          >
            {{ item.category }}
          </p>
          <p
            v-else
            class="ma-0 ml-2"
          >
            {{ $t('lists.local.noCategory') }}
          </p>
        </li>
        <li class="d-flex align-center">
          <v-icon>
            mdi-folder
          </v-icon>
          <v-tooltip 
            max-width="600"
            bottom
          >
            <template v-slot:activator="{ on }">
              <p
                class="ma-0 ml-2 text-truncate"
                v-on="on"
              >
                {{ item.path }}
              </p>
            </template>
            <span>{{ item.path }}</span>
          </v-tooltip>
        </li>
      </ul>
    </v-card-text>
    <v-card-actions>
      <v-btn
        text
        @click="$openItem(item.path)"
        v-t="'lists.local.open'"
      />
      <v-btn
        text
        @click="$openFolder(item.path)"
        v-t="'lists.local.openFolder'"
      />
      <div class="flex-grow-1" />
      <v-btn
        icon
        @click.stop="$openPropertiesModal(item)"
      >
        <v-icon>mdi-pencil-box-multiple</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    item: Object
  }
})
export default class GridCard extends Vue {}
</script>