<template>
  <v-container pa-0>
      <v-layout wrap align-center justify-center>
        <v-flex md10 xs12>
           <Breadcrumbs :items="breadcrumbs"/>
        </v-flex>
        <v-flex md10 xs12 sm12 align-content-center justify-center>
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
                    v-validate="'required'"
                    :label="this.$vuetify.t('$vuetify.UserSettings.currentPassword')"
                    :error-messages="errors.first('old_password')"
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
                    v-validate="{ is: userForm.new_password }"
                    type="password"
                    :label="this.$vuetify.t('$vuetify.UserSettings.newPasswordConfirm')"
                    required
                    :error-messages="errors.first('new_password_confirm')"
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
      <v-snackbar v-model="showSnackbar" :bottom="true">
        {{ snackbarMsg }}
        <v-btn
          color="accent"
          flat
          @click="showSnackbar = false"
        >{{ $vuetify.t('$vuetify.Snackbar.close') }}</v-btn>
      </v-snackbar>
  </v-container>
</template>

<script>

import api from '@/api'
import Breadcrumbs from '@/components/Breadcrumbs'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'UserEdit',
  components: {
    Breadcrumbs
  },
  data: function () {
    return {
      showSnackbar: false,
      snackbarMsg: '',
      user: {},
      userForm: {
        email: this.$store.getters.user.profile.email
      },
      breadcrumbs: [
        {
          title: 'aula',
          to: '/'
        },
        {
          title: this.$vuetify.t('$vuetify.UserProfile.profile'),
          to: { name: 'Profile', params: { userId: this.$store.getters.user.profile.id } }
        },
        {
          title: this.$vuetify.t('$vuetify.Menu.settings'),
          to: this.$route.path
        }
      ],
      dictionary: {
        custom: {
          new_password_confirm: {
            is: this.$vuetify.t('$vuetify.UserSettings.newPasswordConfirmError')
          },
          old_password: {
            required: this.$vuetify.t('$vuetify.UserSettings.oldPasswordRequired')
          }
        }
      }
    }
  },

  computed: {
  },

  props: {
  },

  beforeMount: function () {
  },

  mounted: function () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    saveUserChanges: function () {
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
          } else {
            api.user.updateEmail(this.$store.getters.user.profile.id, this.userForm.email)
            // TODO: Validate with new password is correctly typed (minimum size and complexity)
            api.user.updatePassword(this.$store.getters.user.profile.id, this.userForm.old_password, this.userForm.new_password)
              .then(res => {
                if (res.status < 400) {
                  this.$router.back()
                }
              })
              .catch(
                () => {
                  this.isFormValid = false
                  this.showSnackbar = true
                  this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
                }
              )
          }
        })
    }
  }
}
</script>
