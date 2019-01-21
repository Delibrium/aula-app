<template>
  <v-container fluid grid-list-md>
      <v-dialog v-model="ideaSpaceCreationDialog">
        <v-card>
          <v-card-text>
            <v-layout column align-start>
              <v-flex d-flex xs12 sm12 pa-2>
                <v-text-field
                  name="title"
                  v-model="newIdeaSpace.title"
                  v-validate="'required'"
                 :label="this.$vuetify.t('$vuetify.AdminIdeaSpace.formIdeaSpaceName')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex d-flex xs12 sm12 pa-2>
                <v-text-field
                  name="description"
                  v-model="newIdeaSpace.description"
                  v-validate="'required'"
                 :label="this.$vuetify.t('$vuetify.AdminIdeaSpace.formIdeaSpaceDescription')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex d-flex xs12 sm12 pa-2>
                <v-text-field
                  name="slug"
                  v-model="newIdeaSpace.slug"
                  v-validate="'required'"
                 :label="this.$vuetify.t('$vuetify.AdminIdeaSpace.formIdeaSpaceUrlName')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex d-flex xs12 sm12 pa-2>
               <v-btn
                 @click="addIdeaSpace"
               >
               {{ $vuetify.t('$vuetify.AdminIdeaSpace.add') }}
               </v-btn>
               <v-btn
                 @click="ideaSpaceCreationDialog = false"
               >
               {{ $vuetify.t('$vuetify.AdminUsers.formCancel') }}
               </v-btn>
             </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-layout column align-start>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="ideaSpaces"
                class="elevation-1"
              >
              <template slot="items" slot-scope="props">
                <td @click="editIdeaSpace(props.item)" >{{ props.item.title }}</td>
                <td>{{ props.item.description }}</td>
              </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-btn
            @click="ideaSpaceCreationDialog = true"
          >
          {{ $vuetify.t('$vuetify.AdminIdeaSpace.add') }}
          </v-btn>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'

export default {
  name: 'Phase',
  data: function () {
    return {
      headers: [
        {
          text: this.$vuetify.t('$vuetify.AdminIdeaSpace.formIdeaSpaceName'),
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: this.$vuetify.t('$vuetify.AdminIdeaSpace.formIdeaSpaceDescription'),
          align: 'left',
          sortable: true,
          value: 'description'
        }],
      ideaSpaces: [],
      ideaSpaceCreationDialog: false,
      isEditing: false,
      newIdeaSpace: {
        school_id: this.$store.getters.selected_school,
        title: ''
      }
    }
  },

  computed: {
  },

  props: {
  },

  beforeMount: function () {
    this.getIdeaSpaces()
  },

  methods: {
    getIdeaSpaces: function () {
      api.ideaSpace.getIdeaSpaces(this.$store.getters.selected_school).then(response => {
        this.ideaSpaces = response.data
      })
    },
    addIdeaSpace: function () {
      if (!this.isEditing) {
        this.newIdeaSpace.created_by = this.$store.getters.userId
        api.ideaSpace.createIdeaSpace(this.newIdeaSpace).then(() => {
          this.getIdeaSpaces()
          this.ideaSpaceCreationDialog = false
        })
      } else {
        api.ideaSpace.updateIdeaSpace(this.newIdeaSpace).then(() => {
          this.getIdeaSpaces()
          this.ideaSpaceCreationDialog = false
        })
      }
    },
    editIdeaSpace: function (ideaSpace) {
      this.isEditing = true
      this.newIdeaSpace = ideaSpace
      this.ideaSpaceCreationDialog = true
    },
    submit: function () {
    }
  }
}
</script>
