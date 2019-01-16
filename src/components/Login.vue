<template>
  <v-app id="inspire">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{ $vuetify.t('$vuetify.Login.welcome') }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form id="login">
                  <v-autocomplete
                    name='school'
                    prepend-icon="school"
                    :items="schools"
                    label="Schule"
                    @change="handleChangeSchool"
                    v-validate="'required'"
                    v-model="selectedSchoolId"
                    :error-messages="errors.collect('school')"
                  ></v-autocomplete>
                  <v-text-field
                    name='username'
                    prepend-icon="person"
                    v-model="username"
                    :label="$vuetify.t('$vuetify.Login.login')"
                    v-validate="'required'"
                    :error-messages="errors.collect('username')"
                    type="text">
                  </v-text-field>
                  <v-text-field
                    name='password'
                    id="password"
                    prepend-icon="lock"
                    v-model="password"
                    :label="$vuetify.t('$vuetify.Login.password')"
                    v-validate="'required'"
                    :error-messages="errors.collect('password')"
                    type="password">
                  </v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  dark
                  type="submit"
                  color="green darken-1"
                  form="check-login-form"
                  @click.stop="login">
                  {{ $vuetify.t('$vuetify.Login.button') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-snackbar
        v-model="showSnackbar"
        :bottom="true"
      >
        {{ snackbarMsg }}
        <v-btn
          color="pink"
          flat
          @click="showSnackbar = false"
        >
          {{ $vuetify.t('$vuetify.Snackbar.close') }}
        </v-btn>
      </v-snackbar>
  </v-app>
</template>

<script>
import api from '@/api'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    schools: [],
    selectedSchoolId: null,
    showSnackbar: false,
    snackbarMsg: ''
  }),

  beforeMount: function () {
    this.loadSchools()
  },

  props: {
    source: String
  },

  methods: {
    login: function () {
      this.$validator.validate()
        .then(isFormValid => {
          if (!isFormValid) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
            return
          }

          const params = {
            data: {
              username: this.username,
              password: this.password,
              school_id: this.selectedSchoolId
            },
            redirect: { name: 'IdeaSpaces' },
            fetchUser: true
          }
          this.$auth.login(params)
            .then((res) => {
              this.$store.commit('SET_USER', res.data.data)
              this.$auth.user(res.data.data)
            })
            .catch((error) => {
              if (error.response && error.response.status === 401) {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Login.passwordError'
                )
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Snackbar.serverError'
                )
              }
            })
        })
    },
    loadSchools: function () {
      api.school.getPublic()
        .then(res => {
          this.schools = res.data
        })
    },
    handleChangeSchool: function (value) {
      this.selectedSchoolId = value
    }
  }
}
</script>

