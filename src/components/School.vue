<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap>
        <v-flex d-flex xs12 sm4 pa-2 v-for="school in schools" :key="school.id">
          <v-card class="elevation-1" :class="{'green lighten-3': $store.getters.selected_school === school.id}">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ school.name }}</h3>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn color="green" @click="selectSchool(school)">Select</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import api from '@/api'

export default {
  name: 'School',
  data: () => ({
    schools: []
  }),

  props: {
  },

  methods: {
    submit: function () {
    },

    selectSchool: function (school) {
      this.$store.commit('SET_SELECTED_SCHOOL', school.id)
      this.$store.commit('SET_SCHOOL_NAME', school.name)
      api.school.getConfig(school.id).then((res) => {
        this.$store.commit('SET_SCHOOL_CONFIG', res.data)
        this.$emit('selectedSchool')
      })
    }
  },

  beforeMount: function () {
    api.school.get().then((res) => {
      this.schools = res.data
    })
  }
}
</script>
