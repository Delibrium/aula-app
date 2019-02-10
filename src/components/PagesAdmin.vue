<template>
  <v-container fluid grid-list-md>
      <v-layout column align-start>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="pages"
                class="elevation-1"
              >
              <template slot="items" slot-scope="props">
                <td @click="openEditPage(props.item.name)" >{{ props.item.name }}</td>
              </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-btn
            @click="openPageEditor"
          >
          {{ $vuetify.t('$vuetify.AdminIdeaSpace.add') }}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-dialog v-model="openPageEditor" v-if="pageName !== ''">
        <PageEditor :pageName="pageName" @close-page-editor="openPageEditor = false"/>
      </v-dialog>
  </v-container>
</template>

<script>

import api from '@/api'
import PageEditor from '@/components/PageEditor'

export default {
  name: 'PagesAdmin',
  components: { PageEditor },
  data: function () {
    return {
      headers: [
        {
          text: this.$vuetify.t('$vuetify.AdminPages.pageName'),
          align: 'left',
          sortable: true,
          value: 'name'
        }
      ],
      pages: [],
      pageName: '',
      openPageEditor: false
    }
  },

  computed: {
  },

  props: {
  },

  beforeMount: function () {
    this.getPages()
  },

  methods: {
    openEditPage: function (pageName) {
      this.pageName = pageName
      this.openPageEditor = true
    },

    getPages: function () {
      api.school.getPages(this.$store.getters.selected_school).then(response => {
        this.pages = response.data
      })
    }
  }
}
</script>

<style lang="scss">

</style>
