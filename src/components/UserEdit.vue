<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout wrap align-center justify-center>
        <v-flex d-flex md8 xs12 sm12 pa-2 align-content-center justify-center>
          <v-card>
            <v-card-text>
              <v-layout column align-center>
                <v-flex d-flex xs12 sm12>
                  <v-text-field
                    name="email"
                    v-model="userForm.email"
                    :label="this.$vuetify.t('$vuetify.AdminUsers.formEmail')"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex d-flex xs12 sm12>
                  <v-text-field
                    name="old_password"
                    type="password"
                    v-model="userForm.old_password"
                    :label="this.$vuetify.t('$vuetify.UserSettings.currentPassword')"
                    required
                  ></v-text-field>
                </v-flex>
                 <v-flex d-flex xs12 sm12>
                  <v-text-field
                    name="new_password"
                    v-model="userForm.new_password"
                    type="password"
                    :label="this.$vuetify.t('$vuetify.UserSettings.newPassword')"
                    required
                  ></v-text-field>
                </v-flex>
                 <v-flex d-flex xs12 sm12>
                  <v-text-field
                    name="new_password_confirm"
                    v-model="userForm.new_password_confirm"
                    type="password"
                    :label="this.$vuetify.t('$vuetify.UserSettings.newPasswordConfirm')"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex d-flex xs12 m2>
                  <v-btn @click="saveUserChanges">Save</v-btn>
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
      // TODO: Validate with new password is correctly typed
      api.user.updatePassword(this.$store.getters.user.profile.id, this.userForm.old_password, this.userForm.new_password)
    }
  }
}
</script>
