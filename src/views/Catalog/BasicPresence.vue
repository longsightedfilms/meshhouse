<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="$store.state.pageData"
      :items-per-page="50"
      :footer-props="{
        'items-per-page-options': [10, 25, 50, 100, -1]
      }"
      sort-by="name"
    >
      <template v-slot:item.name="{ item }">
        <v-menu
          absolute
          right
        >
          <template v-slot:activator="{ on }">
            <v-btn
              class="text-none text-left d-inline-block btn-avatar"
              block
              text
              v-on="on"
            >
              <v-avatar
                size="24"
                tile
              >
                <img :src="$returnExtensionIcon(item.extension)">
              </v-avatar>
              <ul class="v-ul no-dots">
                <li class="d-flex align-center">
                  <p class="ma-0 title">
                    {{ item.name }}
                  </p>
                </li>
                <li class="d-flex align-center">
                  <v-icon>
                    mdi-card-text-outline
                  </v-icon>
                  <p class="ma-0 ml-2 overline">
                    {{ $returnItemCategory(item.category) }}
                  </p>
                </li>
              </ul>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="$openItem(item.path)">
              <v-list-item-title>{{ $t('lists.local.open') }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$openFolder(item.path)">
              <v-list-item-title>{{ $t('lists.local.openFolder') }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="$openPropertiesModal(item)">
              <v-list-item-title>Properties</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-slot:item.extension="{ item }">
        <p class="ma-0">
          {{ $returnHumanLikeExtension(item.extension) }}
        </p>
      </template>

      <template v-slot:item.path="{ item }">
        <p class="ma-0">
          {{ item.path }}
        </p>
      </template>
    </v-data-table>
    <edit-properties-modal />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import path from 'path'
import EditPropertiesModal from '@/views/Modals/EditPropertiesModal.vue'
import { DatatableHeader, Model } from '@/plugins/models-db/interfaces'

@Component({
  components: {
    EditPropertiesModal
  }
})

export default class BasicPresence extends Vue {
  headers: DatatableHeader[] = [
    { text: this.getLocalizedString('lists.local.datatable.title'), align: 'left', width: '300', value: 'name'},
    { text: this.getLocalizedString('lists.local.datatable.filetype'), width: '160', value: 'extension' },
    { text: this.getLocalizedString('lists.local.datatable.path'), value: 'path' }
  ]

  getLocalizedString(str: string): string {
    return this.$t(str).toString()
  }
}
</script>