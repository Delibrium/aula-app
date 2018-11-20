<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="green">
                <v-toolbar-title>{{ $vuetify.t('$vuetify.Login.welcome') }}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form id="check-login-form">
                  <v-select
                    autocomplete
                    prepend-icon="school"
                    :items="schools"
                    label="Schule"
                    @change="handleChangeSchool"
                  ></v-select>
                  <v-text-field
                    prepend-icon="person"
                    v-model="username"
                    :label="$vuetify.t('$vuetify.Login.login')"
                    type="text">
                  </v-text-field>
                  <v-text-field
                    id="password"
                    prepend-icon="lock"
                    v-model="password"
                    :label="$vuetify.t('$vuetify.Login.password')"
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
                  @click="login">
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import api from '@/api'

export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    schools: [],
    selectedSchoolId: null
  }),

  beforeMount: function () {
    this.loadSchools()
  },

  props: {
    source: String
  },

  methods: {
    login: function () {
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
          console.log('Error on Login')
          this.error = error.data
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

