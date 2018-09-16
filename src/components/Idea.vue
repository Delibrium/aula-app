<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
        <v-layout row wrap align-center>
          <v-flex md8 xs12 offset-md2 color="green">
            <h1>{{ idea.title }}</h1>
          </v-flex>
      </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>

<script>

import { getIdea } from '@/api/ideaSpace'

export default {
  name: 'Idea',
  data: () => ({
    idea: {}
  }),

  props: {
  },

  beforeMount: function () {
    getIdea(this.$route.params['ideaId']).then((res) => {
      console.log(res)
      this.idea = res.data[0]
    })
  },

  methods: {
  }
}
</script>
