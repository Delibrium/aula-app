<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-start>
        <v-flex d-flex xs12 sm12 pa-2>
          <h2 class="title">{{ $vuetify.t('$vuetify.AdminPhaseTime.phaseWorking') }}</h2>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-text-field
            :label="$vuetify.t('$vuetify.AdminPhaseTime.days')"
            v-model='phaseWorking'
          ></v-text-field>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2>
          <h2 class="title">{{ $vuetify.t('$vuetify.AdminPhaseTime.phaseVoting') }}</h2>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-text-field
            :label="$vuetify.t('$vuetify.AdminPhaseTime.days')"
            v-model='phaseVoting'
          ></v-text-field>
        </v-flex>
        <v-flex d-flex xs12 sm12 pa-2>
          <v-switch
              v-for="(p, index) in phases"
              :key="index"
              v-model="phasesSelected"
              @change="updatePhases"
              :label="$vuetify.t('$vuetify.TopicPhase.' + p)"
              :value="[p, index]"></v-switch>
        </v-flex>
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

import api from '@/api'

export default {
  name: 'Phase',
  data: function () {
    return {
      phases: ['edit_topics', 'feasibility', 'vote', 'finished'],
      phasesSelected: []
    }
  },

  beforeMount: function () {
    if (Object.keys(this.$store.getters.schoolConfig).indexOf('phases') >= 0) {
      this.phasesSelected = this.$store.getters.schoolConfig['phases'].map(p => [p, this.phases.indexOf(p)])
    }
  },

  computed: {
    phaseVoting: {
      get () { return (this.$store.getters.schoolConfig.phaseVoting) ? this.$store.getters.schoolConfig.phaseVoting : 1 },
      set (value) { this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: 'phaseVoting', value: value}) }
    },
    phaseWorking: {
      get () { return (this.$store.getters.schoolConfig.phaseWorking) ? this.$store.getters.schoolConfig.phaseWorking : 1 },
      set (value) { this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: 'phaseWorking', value: value}) }
    }
  },

  props: {
  },

  methods: {
    updatePhases: function () {
      this.phasesSelected.sort((p1, p2) => p1[1] >= p2[1])
      this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: 'phases', value: this.phasesSelected.map(p => p[0])})
    },

    submit: function () {
      // this.$store.commit('UPDATE_SCHOOL_CONFIG_KEY', {key: phase})
      api.school.updateConfig(this.$store.getters.selected_school, 'phaseWorking', this.phaseWorking)
        .then(() => {
          api.school.updateConfig(this.$store.getters.selected_school, 'phaseVoting', this.phaseVoting)
          api.school.updateConfig(this.$store.getters.selected_school, 'phases', this.phasesSelected.map(p => p[0]))
        })
    }
  }
}
</script>
