<template>
  <v-container fluid grid-list-md>
      <v-layout column wrap align-center>
        <v-flex md12 xs12>
          <h2>Filtere nach Kategorie</h2>
        </v-flex>
        <v-flex md12 xs2  color="green">
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'Filters',
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
