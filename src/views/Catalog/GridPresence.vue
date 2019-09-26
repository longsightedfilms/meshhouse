<template>
  <v-row>
    <v-col
      v-for="item in $store.state.pageData"
      :key="item.index"
      xl="3"
      lg="4"
      cols="6"
    >
      <v-card>
        <v-img
          :src="forceReloadImage(item.image)"
          aspect-ratio="1"
          class="grey lighten-2 mb-4"
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
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-avatar
                    class="ml-2"
                    size="24"
                    tile
                    v-on="on"
                  >
                    <img :src="$returnExtensionIcon(item.extension)">
                  </v-avatar>
                </template>
                <span>{{ $returnHumanLikeExtension(item.extension) }}</span>
              </v-tooltip>
            </div>
          </v-card-title>
        </v-img>
        <v-card-text>
          <ul class="v-ul no-dots">
            <li class="d-flex align-center">
              <v-icon>
                mdi-card-text-outline
              </v-icon>
              <p class="ma-0 ml-2">
                {{ $returnItemCategory(item.category) }}
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
          >
            {{ $t('lists.local.open') }}
          </v-btn>
          <v-btn
            text
            @click="$openFolder(item.path)"
          >
            {{ $t('lists.local.openFolder') }}
          </v-btn>

          <div class="flex-grow-1" />

          <v-btn
            icon
            @click.stop="openPropertiesModal(item)"
          >
            <v-icon>mdi-pencil-box-multiple</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <edit-properties-modal />
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import path from 'path'
import Jimp from 'jimp'
import uniqid from 'uniqid'
import { remote } from 'electron'
import { getCollection, initDB, getDB } from 'lokijs-promise'
import EditPropertiesModal from '@/views/Modals/EditPropertiesModal.vue'
import { IModel } from '@/plugins/models-db/interfaces'

@Component({
  components: {
    EditPropertiesModal
  }
})

export default class GridPresence extends Vue {
  forceReloadImage(image: string) {
    return image != '' ? image + '?v=' + this.$store.state.imageRandomizer : image
  }

  async openPropertiesModal(model: IModel) {
    let models = await getCollection("models")

    let categories: string[] = []
    let query = models.chain().find({}).simplesort('category').data()

    query.forEach((item: any) => {
      if (categories.indexOf(item.category) === -1 && item.category != '') {
        categories.push(item.category)
      }
    })

    let properties = {
      autocompleteTips: categories,
      imageChanged: false,
      name: model.name,
      category: model.category,
      image: model.image,
      extension: model.extension,
      path: model.path
    }

    this.$store.commit('setProperties', properties)
    this.$store.commit('setEditPropsModal', true)
  }
}
</script>