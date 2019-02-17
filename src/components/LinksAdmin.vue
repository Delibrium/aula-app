<template>
  <v-container fluid grid-list-md fill-height>
      <v-layout column align-start>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="linkItems"
                class="elevation-1"
              >
              <template slot="items" slot-scope="props">
                <td >{{ props.item.name }}</td>
                <td>
                  {{ props.item.position }}
                </td>
                <td class="justify-center layout px-0">
                  <v-icon
                    small
                    class="mr-2"
                    @click="openEditLink(props.item)"
                  >
                    edit
                  </v-icon>
                  <v-icon
                    small
                    class="mr-2"
                    @click="() => { linkToDelete = props.item ; confirmDeleteLinkDialog = true }"
                  >
                    delete
                  </v-icon>
                </td>
              </template>
              </v-data-table>
              <v-btn @click="openEditLink()">{{ $vuetify.t('$vuetify.AdminLinks.addLink') }}</v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-dialog v-model="editLinkDialog" width="400">
        <v-card>
          <v-card-text>
            <v-text-field
                        name="linkName"
                        :label="$vuetify.t('$vuetify.AdminLinks.linkName')"
                        v-model="link.name">
            </v-text-field>
            <v-text-field
                        name="linkUrl"
                        :label="$vuetify.t('$vuetify.AdminLinks.linkUrl')"
                        v-model="link.url">
            </v-text-field>
            <v-text-field
                        name="linkPosition"
                        :label="$vuetify.t('$vuetify.AdminLinks.linkPosition')"
                        v-model="link.position">
            </v-text-field>
            <v-btn @click="saveLink()">{{ $vuetify.t('$vuetify.Form.save') }}</v-btn>
            <v-btn @click="editLinkDialog = false">{{ $vuetify.t('$vuetify.Form.close') }}</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="confirmDeleteLinkDialog" width="400">
        <v-card>
          <v-card-text>
            <v-btn color="error" @click="deleteLink()">{{ $vuetify.t('$vuetify.Form.delete') }}</v-btn>
            <v-btn @click="linkToDelete = null ; confirmDeleteLinkDialog = false">{{ $vuetify.t('$vuetify.Form.close') }}</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>

import api from '@/api'

export default {
  name: 'Links',
  data: function () {
    return {
      editLinkDialog: false,
      linkItems: [],
      link: {},
      linkToDelete: null,
      confirmDeleteLinkDialog: false,
      isNew: false,
      headers: [
        {
          text: this.$vuetify.t('$vuetify.AdminLinks.linkName'),
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: this.$vuetify.t('$vuetify.AdminLinks.linkPosition'),
          align: 'left',
          sortable: true,
          value: 'position'
        },
        { text: 'Actions', value: 'name', sortable: false }
      ]
    }
  },

  props: {
  },

  beforeMount: function () {
    if (!this.$store.getters.schoolConfig.links) {
      this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: 'links', value: []})
    }

    this.linkItems = this.$store.getters.schoolConfig['links']
  },

  methods: {
    saveLink: function () {
      var newLinks = this.$store.getters.schoolConfig.links
      if (this.isNew) {
        newLinks.push(this.link)
      } else {
        newLinks[newLinks.indexOf(this.link)] = this.link
      }
      api.school.updateConfig(this.$store.getters.selected_school, 'links', newLinks)
        .then(() => {
          this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: 'links', value: newLinks})
          this.link = {}
          this.editLinkDialog = false
        })
    },

    deleteLink: function () {
      let newLinks = this.$store.getters.schoolConfig.links
      newLinks.splice(this.$store.getters.schoolConfig.links.indexOf(this.linkToDelete), 1)
      api.school.updateConfig(this.$store.getters.selected_school, 'links', newLinks)
        .then(() => {
          this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: 'links', value: newLinks})
          this.confirmDeleteLinkDialog = false
        })
    },

    openEditLink: function (link) {
      if (link) {
        this.link = link
        this.isNew = false
      } else {
        this.isNew = true
      }
      this.editLinkDialog = true
    }
  }
}
</script>

<style scoped lang="scss">
</style>

