<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap align-center>
        {{ $route.params['spaceSlug'] }}
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
  export default {
    name: 'Ideas',
    data: () => ({
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
