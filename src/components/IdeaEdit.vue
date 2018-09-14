<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
      <v-layout row wrap align-center>
        <v-flex md8 offset-md2 xs12>
          <h1>Deine Idee</h1>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
          <v-text-field
            label="Wie soll deine Idee heißen?"
            hint="z.B. bessere Ausstattung im Computerraum"
            required
            ></v-text-field>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
        <v-textarea
          label="Was möchtest du vorschlagen?"
          hint="Hier kanst du deine Idee so ausführlich wie möglich beschreiben..."
          ></v-textarea>
        </v-flex>
      </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>

<script>

import Filters from '@/components/Filters'

export default {
  name: 'IdeaEdit',
  components: { Filters },
  data: () => ({
    tab: 0
  }),

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
  },

  methods: {
  }
}
</script>
