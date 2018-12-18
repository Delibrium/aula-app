<template>
  <v-container class="container" fluid row>
    <v-layout>
      <v-flex
        v-for="phaseName in this.phases"
        px-3
        py-2
        :xs9="phaseName === phase"
        :key="phaseName"
      >
        <h2 v-if="phaseName === phase">
          <span v-if="mayChangePhase">
            <v-btn icon small dark
              v-if="phase !== phases[0]"
              @click="update(-1)">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            {{ $vuetify.t('$vuetify.TopicPhase.' + phase) }}
            <v-btn icon small dark
              v-if="phase !== phases[phases.length - 1]"
              @click="update(+1)">
              <v-icon>arrow_forward</v-icon>
            </v-btn>
          </span>
          <span v-else>{{ $vuetify.t('$vuetify.TopicPhase.' + phase) }}</span>
        </h2>
        <span v-else>&nbsp;</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '@/api'
import { isUserMemberOf } from '../utils/permissions'

export default {
  computed: {
    phase: function () { return this.topic && this.topic.phase },
    mayChangePhase: function () {
      return isUserMemberOf(
        ['admin', 'school_admin', 'moderator']
      )
    },
    phaseOptions: function () {
      return this.phases.map(p => ({
        text: this.$vuetify.t('$vuetify.TopicPhase.' + p),
        value: p
      }))
    }
  },
  data: () => ({
    isLoading: false,
    phases: ['edit_topics', 'feasibility', 'vote', 'finished']
  }),
  methods: {
    update: function (delta) {
      const newIndex = (this.phases.indexOf(this.phase) + delta) % this.phases.length
      const newPhase = this.phases[newIndex]
      api.topic.setPhase(this.topic.id, newPhase)
        .then(() => location.reload())
    }
  },
  props: ['topic']
}
</script>

<style scoped lang="scss">
.container {
  padding: 0;
}

.flex {
  background-color: var(--v-secondary-base);
  text-transform: uppercase;
  color: white;
  font-size: 0.8em;
}

.v-btn {
  margin: 0;
}

.flex:nth-child(1) {
  background-color: #8c9eff;
}

.flex:nth-child(2) {
  background-color: #536dfe;
}

.flex:nth-child(3) {
  background-color: #304ffe;
}

.flex:nth-child(4) {
  background-color: #1a237e;
}
</style>
