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

export default {
  name: 'Phase',
  data: () => ({
    phaseVoting: 1,
    phaseWorking: 1
  }),

  props: {
  },

  methods: {
    submit: function () {
      console.log(this.phaseWorking, this.phaseVoting)
    }
  }
}
</script>
