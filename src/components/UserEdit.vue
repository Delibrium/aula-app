<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-flex d-flex xs12 sm12>
          <v-text-field
            name="email"
            v-model="userForm.email"
            :label="this.$vuetify.t('$vuetify.AdminUsers.formEmail')"
            required
          ></v-text-field>
        </v-flex>
        <v-flex d-flex xs12 m2>
          <v-btn @click="saveUserChanges">Save</v-btn>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import api from '@/api'

export default {
  name: 'UserEdit',
  components: {
  },
  data: function () {
    return {
      user: {},
      userForm: {
        email: this.$store.getters.user.profile.email
      }
    }
  },

  computed: {
  },

  props: {
  },

  beforeMount: function () {
  },

  methods: {
    saveUserChanges: function () {
      api.user.updateEmail(this.$store.getters.user.profile.id, this.userForm.email)
    }
  }
}
</script>
