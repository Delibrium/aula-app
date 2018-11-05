<template>
    <v-container fluid grid-list-md>
        <v-layout row wrap align-center>
          <v-flex md10 xs12 offset-md1 color="green" class='tab-nav'>
            <v-card dark color="gray" width="50%" style="float: left" height="100%">
              <router-link :to="{ name: 'Ideas', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">
                <v-card-text class="text-md-center text-xs-center">{{ $vuetify.t('$vuetify.Space.wildIdeas') }}</v-card-text>
              </router-link>
            </v-card>
            <v-card dark color="green" width="50%" style="float: left" height="100%">
              <router-link :to="{ name: 'Topics', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}">
                <v-card-text class="text-md-center text-xs-center">{{ $vuetify.t('$vuetify.Space.ideaTopics') }}</v-card-text>
              </router-link>
            </v-card>
          </v-flex>

          <v-flex md8 offset-md2 xs12 align-center justify-center>
              <h1 class="text-md-left text-xs-left">
                {{ $vuetify.t('$vuetify.Topic.introTitle') }}
              </h1>
          </v-flex>
          <v-flex md8 offset-md2 xs12 align-center justify-center>
            <p class="text-md-left text-xs-left">
              {{ $vuetify.t('$vuetify.Topic.introDescription') }}
            </p>
          </v-flex>

          <v-flex  xs12 md10 offset-md1 pa-2 align-center justify-center text-md-left text-xs-left class='topic-list'>
            <v-layout row wrap>
              <v-flex v-for="topic in topics" :key="topic.id">
                <v-card class="topic-card">
                  <v-img :src="topic.image"></v-img>
                  <v-card-title primary-title>
                    <div>
                      <span class='topic-phase'>{{ $vuetify.t('$vuetify.TopicPhase.' + topic.phase) }}</span>
                      <h3 class="headline mb-0">{{topic.title}}</h3>
                    </div>
                  </v-card-title>
                  <v-card-text>
                    {{ topic.description }}
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
      </v-layout>
    </v-container>
</template>

<script>

import * as api from '@/api/ideaSpace'

export default {
  name: 'Topics',
  data: function () {
    return {
      tab: 1,
      topics: [],
      spaceId: this.$route.params['spaceId']
    }
  },

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
    if (!this.spaceId) {
      api.getSpace(this.$store.getters.selected_school, this.$route.params['spaceSlug'])
        .then((res) => {
          console.log(res)
          this.spaceId = res.data[0].id
          this.getTopics(this.$store.getters.selected_school, this.spaceId)
        })
    } else {
      this.getTopics(this.$store.getters.selected_school, this.spaceId)
    }
  },

  methods: {
    getTopics: function (schoolId, spaceId) {
      api.getTopics(schoolId, spaceId)
        .then(res => {
          this.topics = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .v-card__title {
    padding-bottom: 0
  }

  .tab-nav {
    margin-bottom: 2em;
  }

  .tab-nav a {
    font-size: 1.4em;
    color: #fafafa;
    text-decoration: none;
  }

  .topic-list {
    margin-top: 2em;
  }

  .topic-phase {
    text-transform: uppercase;
    color: #777;
    font-size: .8em;
  }
</style>
