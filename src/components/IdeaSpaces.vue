<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap justify-center align-center>
        <!-- Default Idea Space -->
        <v-flex d-flex xs12 sm3 pa-2>
          <router-link :to="{ name: 'Ideas', params: { spaceSlug: 'school' } }">
          <v-card>
              <v-img
                src="/static/img/school.png"
                ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ $store.getters.schoolConfig.mainSpaceName }}</h3>
              </div>
            </v-card-title>
          </v-card>
          </router-link>
        </v-flex>

        <v-flex d-flex xs12 sm3 pa-2 v-for="space in idea_space" :key="space.id">
          <router-link :to="{ name: 'Ideas', params: { spaceSlug: space.slug, spaceId: space.id } }">
          <v-card >
              <v-img
                src="/static/img/room1.png"
                ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ space.title }}</h3>
              </div>
            </v-card-title>
          </v-card>
          </router-link>
        </v-flex>

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import * as api from '@/api/ideaSpace'

export default {
  name: 'IdeaSpaces',
  data: () => ({
    idea_space: [],
    user: {}
  }),

  props: {
  },

  beforeMount: function () {
    api.getIdeaSpaces(this.$store.getters.selected_school).then((res) => {
      this.idea_space = res.data
    })
  },

  methods: {
  }
}
</script>

<style scoped lang="scss">
.idea-space-teaser {
  display: flex;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #ededed;
  margin: auto;
  max-width: 450px;
}

</style>
