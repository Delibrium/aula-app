<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout wrap align-center justify-center>
        <v-flex d-flex md10 xs12 sm12 pa-2 align-content-center justify-center>
          <v-card>
            <v-card-text>
              <v-layout wrap align-center>
                <v-flex d-flex xs12 sm12 pa-2 align-content-center justify-center>
                  <v-img :src="user.picture?user.picture:'/static/img/profile_default.png'" max-width="100"/>
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
                <v-flex>
                <v-layout wrap align-center justify-center>
                  <v-flex row d-flex xs12 lg3 pa-2 align-content-center justify-center>
                   <v-btn round color="primary" dark>{{ $vuetify.t('$vuetify.UserProfile.delegates') }}</v-btn>
                  </v-flex>
                  <v-flex row d-flex xs12 lg3 pa-2 align-content-center justify-center>
                    <v-btn :to="{ name: 'ProfileEdit', params: { userId: $store.getters.userId } }" round color="primary" dark>{{ $vuetify.t('$vuetify.UserProfile.edit') }}</v-btn>
                  </v-flex>
                </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import api from '@/api'

export default {
  name: 'Profile',
  components: {
  },
  data: () => ({
    user: {}
  }),

  beforeMount: function () {
    api.user.get(this.$route.params.userId).then(resp => {
      this.user = resp.data[0]
    })
  },

  computed: {
  },

  props: {
  },

  methods: {
  }
}
</script>

<style scss>
  .v1-input {
     text-align: center
  }
</style>
