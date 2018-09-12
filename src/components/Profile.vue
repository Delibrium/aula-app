<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout  wrap align-center>
        <v-flex d-flex xs12 sm12 pa-2 align-content-center justify-center>
          <v-img src="/static/img/profile_default.png" max-width="100"/>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2 align-content-center justify-center>
           <h1 class="text-xs-center">{{ $store.getters.user.user.username }}</h1>
        </v-flex>
        <v-flex d-flex xs12 sm12>
          <v-layout row wrap align-center justify-center>
            <v-flex d-flex sm1 align-content-center justify-center>
              <v-chip justify-center class="text-xs-center text-sm-center" label outline color="green">Admin</v-chip>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-layout wrap align-center justify-center>
          <v-flex row d-flex xs12 lg3 pa-2 align-content-center justify-center>
           <v-btn round color="green" dark>{{ $vuetify.t('$vuetify.UserProfile.delegates') }}</v-btn>
          </v-flex>
          <v-flex row d-flex xs12 lg3 pa-2 align-content-center justify-center>
            <v-btn round color="green" dark>{{ $vuetify.t('$vuetify.UserProfile.edit') }}</v-btn>
          </v-flex>
        </v-layout>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

export default {
  name: 'Profile',
  components: {
  },
  data: () => ({
  }),

  computed: {
  },

  props: {
  },

  methods: {
  }
}
</script>
