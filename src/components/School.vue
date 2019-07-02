<template>
  <v-container fluid grid-list-md>
    <v-layout column wrap>
      <v-flex>
        <v-btn
          @click="addCommunity"
        >{{ $vuetify.t('$vuetify.AdminCommunity.add') }}</v-btn>
      </v-flex>
      <v-flex v-if="$auth.user().role.indexOf('admin') >= 0" d-flex xs12 sm4 pa-2>
        <v-data-table
          :headers="headers"
          :items="schools"
          class="elevation-1"
        >
        <template slot="items" slot-scope="props">
          <td  :class="{'green lighten-3': $store.getters.selected_school === props.item.id}" @click="selectSchool(props.item)">{{ props.item.name }}</td>
        </template>
        </v-data-table>
      </v-flex>

      <v-flex d-flex xs12 sm4 pa-2>
        <v-card class="elevation-1">
          <v-card-text>
            <v-layout column>
              <v-flex>
                <v-text-field
                  name="description"
                  v-model="schoolConfig.mainSpaceName"
                  v-validate="'required'"
                  :label="this.$vuetify.t('$vuetify.AdminCommunity.mainSpaceName')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex>
              <v-img :class="{ selectedImage: schoolImage === defaultImage }"
                     src="./static/img/svg/Schule.svg"
                     width="280" height="162"
                     @click="setDefaultImage"
              />
              <v-img v-if="!isDefaultImage && selectedSchool.image !== ''"
                     :class="{ selectedImage: schoolImage !== defaultImage }"
                     :src="selectedSchool.image"
                     :contain="true"
                     width="280" height="162"
              />

              <vue-base64-file-upload
                accept="image/png,image/jpeg,image/svg"
                image-class="upload-image-preview"
                input-class="upload-image-input"
                :placeholder="$vuetify.t('$vuetify.Form.picture')"
                @load="onLoad" />
              </v-flex>
              <v-flex>
                <v-btn
                  @click="openEditPage('terms')"
                >{{ $vuetify.t('$vuetify.AdminCommunity.termsEdit') }}</v-btn>

                <v-btn
                  @click="openEditPage('impressum')"
                >{{ $vuetify.t('$vuetify.AdminCommunity.impressumEdit') }}</v-btn>

                <v-btn
                  @click="updateSchool"
                >{{ $vuetify.t('$vuetify.Form.save') }}</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-dialog width="400" v-model="createCommunityDialog">
        <v-card>
          <v-card-text>
            <v-flex>
              <v-text-field
                name="new_community_name"
                v-model="newCommunityName"
                :label="this.$vuetify.t('$vuetify.AdminCommunity.newCommunityName')"
                v-validate="'required'"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-alert
                type="success"
                :value="communityAdded">
                Password for the new school's admin: <h1>{{ newCommunityAdminPassword }}</h1>
              </v-alert>
              <v-btn color="primary"
                @click="saveCommunity"
                v-if="!communityAdded"
              >{{ $vuetify.t('$vuetify.AdminCommunity.save') }}</v-btn>
              <v-btn
                @click="createCommunityDialog = false"
                v-if="!communityAdded"
              >{{ $vuetify.t('$vuetify.Form.cancel') }}</v-btn>
              <v-btn
                @click="createCommunityDialog = false"
                v-if="communityAdded"
              >{{ $vuetify.t('$vuetify.Form.close') }}</v-btn>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="editPage" v-if="canEditMainPages && pageName !== ''">
        <PageEditor :pageName="pageName" @close-page-editor="editPage = false"/>
      </v-dialog>
    </v-layout>
    <v-snackbar v-model="showSnackbar" :bottom="true">
      {{ snackbarMsg }}
      <v-btn
        color="pink"
        flat
        @click="showSnackbar = false"
      >{{ $vuetify.t('$vuetify.Snackbar.close') }}</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>

import api from '@/api'
import { isUserMemberOf } from '../utils/permissions'
import PageEditor from '@/components/PageEditor'
import VueBase64FileUpload from 'vue-base64-file-upload'

export default {
  name: 'School',
  components: { PageEditor, VueBase64FileUpload },
  data: function () {
    return {
      schools: [],
      selectedSchool: {},
      defaultImage: './static/img/svg/Schule.svg',
      schoolImage: this.defaultImage,
      imagecontain: false,
      newCommunityName: '',
      newCommunityAdminPassword: '',
      createCommunityDialog: false,
      communityAdded: false,
      schoolConfig: this.$store.getters.schoolConfig,
      editPage: false,
      pageName: '',
      showSnackbar: false,
      snackbarMsg: '',
      headers: [
        {
          text: this.$vuetify.t('$vuetify.AdminCommunity.tableHeaderName'),
          align: 'left',
          sortable: true,
          value: 'schoolName'
        }]
    }
  },

  props: {
  },

  computed: {
    canEditMainPages: function () {
      return isUserMemberOf(['admin'])
    },
    isDefaultImage: function () {
      return this.selectedSchool.image === './static/img/svg/Schule.svg'
    }
  },

  methods: {
    submit: function () {
    },

    addCommunity: function () {
      this.createCommunityDialog = true
      this.newCommunityName = ''
      this.newCommunityAdminPassword = ''
      this.communityAdded = false
    },

    saveCommunity: function () {
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
            return
          }

          api.school.createCommunity(this.newCommunityName).then(res => {
            // TODO: Check when user tried an already existing community name (http status 409 )
            if (res.status === 200) {
              this.communityAdded = true
              this.newCommunityAdminPassword = res.data.password
            }
          })
        })
    },

    setDefaultImage: function () {
      this.schoolImage = this.defaultImage
      this.imagecontain = false
    },

    onLoad: function (dataUri) {
      this.schoolImage = dataUri
      this.imagecontain = true
    },

    openEditPage: function (pageName) {
      this.pageName = pageName
      this.editPage = true
    },

    selectSchool: function (school) {
      this.$store.commit('SET_SELECTED_SCHOOL', school.id)
      this.$store.commit('SET_SCHOOL_NAME', school.name)
      api.school.getConfig(school.id).then((res) => {
        this.$store.commit('SET_SCHOOL_CONFIG', res.data)
        this.$emit('selectedSchool')
      })
    },

    updateSchool: function () {
      api.school.updateConfig(this.$store.getters.selected_school, 'mainSpaceName', this.schoolConfig.mainSpaceName).then(
        res => {
          var data = {
            image: this.schoolImage,
            imagecontain: this.imagecontain
          }
          api.school.update(this.$store.getters.selected_school, data)
        }
      )
    }
  },

  beforeMount: function () {
    api.school.get().then((res) => {
      this.schools = res.data
      this.selectedSchool = this.schools.find(s => s.id === this.$store.getters.selected_school)
      this.schoolImage = this.selectedSchool.image
    })
  }
}
</script>

<style lang="scss">
  .vue-base64-file-upload {
    border: 4px dashed #dbdbdb;
    margin-top: 10px;
    padding: 30px;
    max-width: 400px;
    font-weight: bold;

    .upload-image-preview {
      max-width: 350px;
    }

    .vue-base64-file-upload-wrapper {
      input {
        text-align: center;
      }
    }
  }

  .selectedImage {
    border: 2px solid var(--v-secondary-base);
  }

</style>
