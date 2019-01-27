<template>
  <v-container fluid grid-list-md>
      <v-layout row wrap justify-center align-center>
        <v-flex md8>
          <v-layout row wrap justify-center align-center>
            <!-- Default Idea Space -->
            <v-flex d-flex xs12 sm4 pa-2 class="idea-space">
              <router-link :to="{ name: 'Ideas', params: { spaceSlug: 'school' } }">
              <v-card>
                  <v-img
                    src="/static/img/svg/Schule.svg"
                    height="162"
                    ></v-img>
                <v-card-title primary-title>
                  <v-layout>
                    <v-flex>
                    <h3 class="headline mb-0 space-name">{{ $store.getters.schoolConfig.mainSpaceName }}</h3>
                    </v-flex>
                    <v-flex text-align-right>
                    <v-icon color="primary" class="arrow">
                      arrow_forward
                    </v-icon>
                    </v-flex>
                  </v-layout>

                </v-card-title>
              </v-card>
              </router-link>
            </v-flex>

            <v-flex d-flex xs12 sm4 pa-2 v-for="space in idea_space" :key="space.id" class="idea-space">
              <router-link :to="{ name: 'Ideas', params: { spaceSlug: space.slug, spaceId: space.id } }">
              <v-card >
                  <v-img
                    :src="space.image"
                    height="162"
                    ></v-img>
                <v-card-title primary-title>
                  <v-layout>
                    <v-flex>
                    <h3 class="headline mb-0 space-name">{{ space.title }}</h3>
                    </v-flex>
                    <v-flex text-align-right>
                    <v-icon color="primary" class="arrow">
                      arrow_forward
                    </v-icon>
                    </v-flex>
                  </v-layout>
                </v-card-title>
              </v-card>
              </router-link>
            </v-flex>

          </v-layout>
        </v-flex>
      </v-layout>
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

.space-name {
   text-transform: uppercase;
   text-decoration: none;
}

.arrow {
   float: right;
}

.idea-space {
  a {
    text-decoration: none;
  }
}

</style>
