<template>
  <v-layout row wrap grid-list-md justify-center>
    <v-flex sm12 mb-0 pa-0>
      <v-layout column>
        <v-flex sm12 mb-0 pa-2 v-for="(delegate, id) in delegates" :key="id">
          <v-card>
            <v-card-text>
              <v-img v-if="delegate['picture']" :src="delegate['picture']" width="60"/>
                <h3>{{ delegate.first_name }} {{ delegate.last_name }}</h3>
                (<span v-for="(user, index) in delegate['users']" :key="index">{{user.first_name}} {{user.last_name}} </span>)
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  name: 'DelegateListing',

  props: { delegates: Object },

  data: function () {
    return {
      topic: null
    }
  },

  mounted: function () {
    console.log(this.delegates)
  },

  computed: {
  },

  beforeMount: function () {
  },

  methods: {
  }
}
</script>

<style scoped lang="scss">
</style>
