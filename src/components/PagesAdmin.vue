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
                <td >{{ props.item.name }}</td>
                <td>
                    <v-checkbox
                      v-model="props.item.public"
                      @change="updatePublic(props.item)"
                      label="is Public"
                      ></v-checkbox>
                </td>
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                    @click="openEditPage(props.item.name)"
                  >
                    edit
                  </v-icon>
                  <v-icon
                    small
                    class="mr-2"
                    @click="pageToDelete = props.item ; confirmDeletePageDialog = true"
                  >
                    delete
                  </v-icon>

                </td>
              </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-btn
            @click="addPageDialog = true"
          >
          {{ $vuetify.t('$vuetify.AdminPages.add') }}
          </v-btn>
        </v-flex>
      </v-layout>
      <v-dialog v-model="openPageEditor" v-if="pageName !== ''">
        <PageEditor :pageName="pageName" @close-page-editor="openPageEditor = false"/>
      </v-dialog>
      <v-dialog v-model="confirmDeletePageDialog" width="300">
        <v-card>
          <v-card-text>
            <v-alert type="error" :value="true">{{ $vuetify.t('$vuetify.AdminPages.confirmDelete', pageToDelete ? pageToDelete.name : '')  }}</v-alert>
             <v-btn @click="deletePage" color="error">
             {{ $vuetify.t('$vuetify.Form.delete') }}
             </v-btn>
             <v-btn
              @click="confirmDeletePageDialog = false"
              >
            {{ $vuetify.t('$vuetify.Form.cancel') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="addPageDialog" width="400">
        <v-card>
          <v-card-text>
            <v-text-field
                        name="pageName"
                        :label="$vuetify.t('$vuetify.AdminPages.pageName')"
                        v-model="newPage.name">
            </v-text-field>
           <v-btn @click="addPage" color="primary">
           {{ $vuetify.t('$vuetify.AdminPages.add') }}
           </v-btn>
           <v-btn
            @click="addPageDialog = false"
          >
          {{ $vuetify.t('$vuetify.Form.cancel') }}
          </v-btn>
          </v-card-text>
        </v-card>
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
      addPageDialog: false,
      confirmDeletePageDialog: false,
      newPage: {name: ''},
      pageToDelete: null,
      headers: [
        {
          text: this.$vuetify.t('$vuetify.AdminPages.pageName'),
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Public',
          align: 'left',
          sortable: false,
          value: 'public'
        },
        { text: 'Actions', value: 'name', sortable: false }
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
    deletePage: function () {
      const pageId = this.pageToDelete.id
      api.school.deletePage(pageId).then(res => {
        this.pages = this.pages.filter(p => p.id !== pageId)
        this.confirmDeletePageDialog = false
      })
    },
    addPage: function () {
      this.newPage.created_by = this.$store.getters.user.profile.id
      this.newPage.school_id = this.$store.getters.selected_school
      this.newPage.content = ''
      api.school.addPage(this.newPage).then(res => {
        this.pages.push(res.data[0])
        this.addPageDialog = false
      })
    },
    openEditPage: function (pageName) {
      this.pageName = pageName
      this.openPageEditor = true
    },

    updatePublic: function (page) {
      console.log(page.id, page.public)
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
