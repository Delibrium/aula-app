<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-start>
        <v-flex d-flex xs12 sm12 pa-2>
          <h2 class="title">{{ $vuetify.t('$vuetify.AdminQuorum.school') }}</h2>
        </v-flex>
        <v-layout row wrap>
          <v-flex d-flex xs6 sm6 pa-2>
            <v-text-field
              v-model='schoolQuorum'
                ></v-text-field>
          </v-flex>
          <v-flex d-flex xs6 sm6 fill-height align-center>
              {{ $vuetify.t('$vuetify.AdminQuorum.schoolPercent')  }}
          </v-flex>
        </v-layout>
        <v-flex d-flex xs12 sm12 pa-2>
          <h2 class="title">{{ $vuetify.t('$vuetify.AdminQuorum.class') }}</h2>
        </v-flex>

        <v-layout row wrap>
          <v-flex d-flex xs6 sm6 pa-2>
            <v-text-field
              v-model='classQuorum'
                ></v-text-field>
          </v-flex>
          <v-flex d-flex xs6 sm6 fill-height align-center>
              {{ $vuetify.t('$vuetify.AdminQuorum.classPercent')  }}
          </v-flex>
        </v-layout>

        <v-flex d-flex xs12 sm12 pa-2>
          <v-btn
            @click="submit"
          >
          {{ $vuetify.t('$vuetify.UserSettings.save') }}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import * as api from '@/api/school'

export default {
  name: 'Quorum',
  data: function () {
    return {

    }
  },

  props: {
  },

  computed: {
    schoolQuorum: {
      get () { return (this.$store.getters.schoolConfig.schoolQuorum) ? this.$store.getters.schoolConfig.schoolQuorum : 30 },
      set (value) { this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: 'schoolQuorum', value: value}) }
    },
    classQuorum: {
      get () { return (this.$store.getters.schoolConfig.classQuorum) ? this.$store.getters.schoolConfig.classQuorum : 30 },
      set (value) { this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: 'classQuorum', value: value}) }
    }
  },

  methods: {
    submit: function () {
      api.updateSchoolConfig(this.$store.getters.selected_school, 'schoolQuorum', this.schoolQuorum)
        .then(() => {
          api.updateSchoolConfig(this.$store.getters.selected_school, 'classQuorum', this.classQuorum)
        })
    }
  }
}
</script>
