<template>
  <v-container pa-0>
    <v-layout wrap align-center justify-center>
      <v-flex md10 xs12>
         <Breadcrumbs :items="breadcrumbs"/>
      </v-flex>
      <v-flex d-flex md10 xs12 sm12 align-content-center justify-center>
        <v-card>
          <v-card-text>
            <v-layout wrap align-center justify-center>
              <v-flex d-flex xs12 sm12 align-content-center justify-center>
                <v-img :src="user.picture?user.picture:'/static/img/svg/Aula_Logo_Kopf.svg'" class="avatar-image" max-width="300"/>
              </v-flex>
              <v-flex d-flex xs12 sm12 pa-2 align-content-center justify-center>
                <vue-base64-file-upload
                  accept="image/png,image/jpeg,image/svg"
                  image-class="imagePreview"
                  input-class="imageInput"
                  :value="user.picture?user.picture:'/static/img/profile_default.png'"
                  @file="onFile"
                  @load="onLoad" />
              </v-flex>
              <v-flex d-flex xs12 sm12 pa-2 align-content-center justify-center>
                 <h1 class="text-xs-center">{{ $store.getters.user.profile.first_name }} {{ $store.getters.user.profile.last_name }}</h1>
              </v-flex>
              <v-flex d-flex xs12 sm12>
                <v-layout row wrap align-center justify-center>
                  <v-flex d-flex sm1 align-content-center justify-center :key="index" v-for="(role, index) in $store.getters.user.profile.role">
                    <v-chip justify-center class="text-xs-center text-sm-center" label outline color="primary">{{ role }}</v-chip>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex text-xs-center pa-3 xs12 md2>
                <v-btn @click="saveNewProfilePicture" color="primary">Save</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'
import VueBase64FileUpload from 'vue-base64-file-upload'
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  name: 'ProfileEdit',
  components: {
    VueBase64FileUpload,
    Breadcrumbs
  },
  data: function () {
    return {
      newProfilePicture: '',
      user: {},
      breadcrumbs: [
        {
          title: 'aula',
          to: '/'
        },
        {
          title: this.$vuetify.t('$vuetify.UserProfile.profile'),
          to: { name: 'Profile', params: { userId: this.$route.params.userId } }
        },
        {
          title: this.$vuetify.t('$vuetify.UserProfile.edit'),
          to: this.$route.path
        }
      ]
    }
  },

  computed: {
  },

  props: {
  },

  beforeMount: function () {
    api.user.get(this.$route.params.userId).then(resp => {
      this.user = resp.data[0]
      this.newProfilePicture = this.user.picture
    })
  },

  methods: {
    onFile: function (file) {
      console.log(file) // file object
    },

    onLoad: function (dataUri) {
      console.log(dataUri) // data-uri string
      this.newProfilePicture = dataUri
    },

    saveNewProfilePicture: function () {
      api.user.updateProfilePicture(this.$store.getters.userId, this.newProfilePicture).then((res) => {
        if (res.status < 400) {
          this.$router.push({
            name: 'Profile',
            params: { userId: this.$route.params.userId }
          })
        }
      })
    }
  }
}
</script>

<style scss>
.vue-base64-file-upload {
  text-align: center;
}
.imagePreview {
  max-width: 300px;
}
.imageInput {
  text-align: center;
}
</style>
