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
                  <v-text-field prepend-icon="person" v-model="data.body.username" :label="$vuetify.t('$vuetify.Login.login')" type="text"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" v-model="data.body.password" :label="$vuetify.t('$vuetify.Login.password')" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="green darken-1" form="check-login-form" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    name: 'Login',
    data: () => ({
      drawer: null,
      data: {
        body: {
          username: '',
          password: ''
        }
      }
    }),

    mounted: function () {
    },

    props: {
      source: String
    },

    methods: {
      login: function () {
        // var redirect = this.$auth.redirect()
        this.$auth.login({
          data: this.data.body,
          redirect: { name: 'IdeaSpaces' },
          fetchUser: true
        }).then((res) => {
          this.$store.commit('SET_USER', res.data.data)
          this.$auth.user(res.data.data)
        }, (res) => {
          console.log('Error on Login')
          this.error = res.data
        })
      }
    }
  }
</script>

