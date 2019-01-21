<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout wrap align-center>
        <v-flex d-flex xs12 sm12 align-content-center justify-center>
          <v-img :src="user.picture?user.picture:'/static/img/profile_default.png'" max-width="100"/>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2 align-content-center justify-center>
          <vue-base64-file-upload
            accept="image/png,image/jpeg,image/svg"
            image-class="v1-image"
            input-class="v1-input"
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
        <v-flex d-flex xs12 m2>
          <v-btn @click="saveNewProfilePicture">Save</v-btn>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import api from '@/api'
import VueBase64FileUpload from 'vue-base64-file-upload'

export default {
  name: 'ProfileEdit',
  components: {
    VueBase64FileUpload
  },
  data: () => ({
    newProfilePicture: '',
    user: {}
  }),

  computed: {
  },

  props: {
  },

  beforeMount: function () {
    api.user.get(this.$route.params.userId).then(resp => {
      this.user = resp.data[0]
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
      api.user.updateProfilePicture(this.$store.getters.userId, this.newProfilePicture)
    }
  }
}
</script>
