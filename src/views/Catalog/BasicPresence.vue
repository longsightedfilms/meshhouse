<template>
  <v-container class="pr-4" fluid>
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="$store.state.pageData"
          :items-per-page="50"
          :footer-props="{
            'items-per-page-options': [10, 25, 50, 100, -1],
          }"
          disable-filtering
          disable-sort
        >
          <template v-slot:item.name="{ item }">
            <v-lazy min-height="57">
              <v-menu absolute right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="text-none text-left d-inline-block btn-avatar"
                    block
                    text
                    v-on="on"
                  >
                    <v-avatar size="24" tile>
                      <img :src="$returnExtensionIcon(item.extension)" />
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
                        <p
                          v-if="item.category !== ''"
                          class="ma-0 ml-2 overline"
                        >
                          {{ item.category }}
                        </p>
                        <p v-else class="ma-0 ml-2 overline">
                          {{ $t('lists.local.noCategory') }}
                        </p>
                      </li>
                    </ul>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="$openItem(item.path)">
                    <v-list-item-title v-t="'lists.local.open'" />
                  </v-list-item>
                  <v-list-item @click="$openFolder(item.path)">
                    <v-list-item-title v-t="'lists.local.openFolder'" />
                  </v-list-item>
                  <v-list-item @click="$openPropertiesModal(item)">
                    <v-list-item-title v-t="'lists.local.properties'" />
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-lazy>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import path from 'path'
import EditPropertiesModal from '@/views/Modals/EditPropertiesModal.vue'
import { DatatableHeader, Model } from '@/plugins/models-db/interfaces'

@Component({
  components: {
    EditPropertiesModal,
  },
})
export default class BasicPresence extends Vue {
  headers: DatatableHeader[] = [
    {
      text: this.getLocalizedString('lists.local.datatable.title'),
      align: 'left',
      width: '300',
      value: 'name',
    },
    {
      text: this.getLocalizedString('lists.local.datatable.filetype'),
      width: '160',
      value: 'extension',
    },
    {
      text: this.getLocalizedString('lists.local.datatable.path'),
      value: 'path',
    },
  ]

  getLocalizedString(str: string): string {
    return this.$t(str).toString()
  }
}
</script>
