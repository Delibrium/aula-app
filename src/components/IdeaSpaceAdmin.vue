<template>
  <v-container fluid grid-list-md>
      <v-dialog v-model="ideaSpaceCreationDialog">
        <v-card>
          <v-card-text>
            <v-layout column align-start>
              <v-flex v-if="isEditing" d-flex xs12 sm12 pa-2>
               <v-btn
                 color="red"
                 @click="ideaSpaceDeleteDialog = true"
               >
               {{ $vuetify.t('$vuetify.AdminIdeaSpace.delete') }}
               </v-btn>
              </v-flex>
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
                  v-model="slug"
                  v-validate="'required'"
                  readonly
                 :label="this.$vuetify.t('$vuetify.AdminIdeaSpace.formIdeaSpaceUrlName')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex d-flex xs12 sm12 pa-2>
                <v-layout row wrap>
                  <v-flex class="ideaSpaceImage-button" :class="{ selectedImage: image === newIdeaSpace.image }" pa-2 v-for="(image, index) of defaultIdeaSpacesImages" :key="index" >
                    <v-img :src="image"height="100" width="200" @click="selectImage(image)"/>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex xs12 sm12 pa-2>
               <v-btn
                 @click="addIdeaSpace"
               >
               {{ $vuetify.t('$vuetify.Form.save') }}
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
      <v-dialog v-model="ideaSpaceDeleteDialog" width="500">
        <v-card>
          <v-card-title>
            <h1> {{ $vuetify.t('$vuetify.AdminIdeaSpace.delete') }}</h1>
          </v-card-title>
          <v-card-text>
            <v-alert :value="true" type="info">
             {{ $vuetify.t('$vuetify.AdminIdeaSpace.deleteAlert') }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="deleteIdeaSpace"
              color="red"
            >
            {{ $vuetify.t('$vuetify.Form.delete') }}
            </v-btn>
            <v-btn
              @click="ideaSpaceDeleteDialog = false"
            >
            {{ $vuetify.t('$vuetify.Form.cancel') }}
            </v-btn>
          </v-card-actions>
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
            @click="openIdeaSpaceEditor"
          >
          {{ $vuetify.t('$vuetify.AdminIdeaSpace.add') }}
          </v-btn>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'
import slugify from 'slugify'

export default {
  name: 'IdeaSpacesAdmin',
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
      ideaSpaceDeleteDialog: false,
      isEditing: false,
      defaultIdeaSpacesImages: ['/static/img/svg/door1.svg', '/static/img/svg/door2.svg', '/static/img/svg/door3.svg', '/static/img/svg/door4.svg'],
      newIdeaSpace: {
        school_id: this.$store.getters.selected_school,
        title: '',
        image: '/static/img/svg/door1.svg'
      }
    }
  },

  computed: {
    slug: function () {
      return slugify(this.newIdeaSpace.title)
    }
  },

  props: {
  },

  beforeMount: function () {
    this.getIdeaSpaces()
  },

  methods: {
    openIdeaSpaceEditor: function () {
      this.newIdeaSpace = {
        school_id: this.$store.getters.selected_school,
        title: '',
        image: '/static/img/svg/door1.svg'
      }

      this.ideaSpaceCreationDialog = true
    },

    getIdeaSpaces: function () {
      api.ideaSpace.getIdeaSpaces(this.$store.getters.selected_school).then(response => {
        this.ideaSpaces = response.data
      })
    },
    deleteIdeaSpace: function () {
      const spaceId = this.newIdeaSpace.id
      api.ideaSpace.deleteIdeaSpace(this.newIdeaSpace.school_id, this.newIdeaSpace.id).then(resp => {
        this.ideaSpaces = this.ideaSpaces.filter(i => i.id !== spaceId)
        this.ideaSpaceDeleteDialog = false
        this.ideaSpaceCreationDialog = false
      })
    },
    addIdeaSpace: function () {
      if (!this.isEditing) {
        this.newIdeaSpace.created_by = this.$store.getters.userId
        this.newIdeaSpace.slug = this.slug
        api.ideaSpace.createIdeaSpace(this.newIdeaSpace).then(() => {
          this.getIdeaSpaces()
          this.ideaSpaceCreationDialog = false
        })
      } else {
        this.newIdeaSpace.slug = this.slug
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
    selectImage: function (image) {
      this.newIdeaSpace.image = image
    },
    submit: function () {
    }
  }
}
</script>

<style lang="scss">
.ideaSpaceImage-button {
   border: 2px solid rgba(0,0,0,0);
   border-radius: 4px;
   &.selectedImage {
    border: 2px solid var(--v-secondary-base);
   }
}
</style>
