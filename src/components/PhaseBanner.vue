<template>
  <v-container class='container' fluid row>
    <v-layout>
      <v-flex
        v-for="phaseName in this.phases"
        px-3
        py-2
        :xs9="phaseName === phase"
        :key="phaseName">
        <h2 v-if="phaseName === phase">
          {{ $vuetify.t('$vuetify.TopicPhase.' + phaseName) }}
        </h2>
        <span v-else>&nbsp;</span>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    isLoading: false,
    phases: ['edit_topics', 'feasibility', 'vote', 'finished']
  }),
  props: ['phase']
}
</script>

<style scoped lang="scss">
.container {
  padding: 0;
}

.flex {
  text-transform: uppercase;
  background-color: var(--v-secondary-base);
  color: white;
  font-size: 0.8em;
}

.flex:nth-child(1) {
  background-color: #8c9eff
}

.flex:nth-child(2) {
  background-color: #536dfe
}

.flex:nth-child(3) {
  background-color: #304ffe
}

.flex:nth-child(4) {
  background-color: #1a237e
}
</style>
