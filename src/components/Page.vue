<template>
  <v-container fluid grid-list-md fill-height>
      <v-layout row wrap justify-center align-center>
        <v-flex md10 v-html="page" pa-5 class="page">
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>

import api from '@/api'

export default {
  name: 'Page',
  data: function () {
    return {
      page: '',
      communityId: 1
    }
  },

  props: {
    page_name: String
  },

  beforeMount: function () {
    api.school.getPage(this.communityId, this.page_name).then((res) => {
      this.page = res.data[0]['content']
    })
  },

  methods: {
  }
}
</script>

<style scoped lang="scss">
.page {
  background-color: white;
}
</style>

