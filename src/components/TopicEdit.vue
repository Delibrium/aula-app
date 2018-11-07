<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
      <v-layout row wrap align-center>
        <v-flex md8 offset-md2 xs12>
          <h1>{{ $vuetify.t('$vuetify.TopicCreation.pageTitle') }}</h1>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
          <v-text-field
            :label="$vuetify.t('$vuetify.TopicCreation.title')"
            :hint="$vuetify.t('$vuetify.TopicCreation.titleHint')"
            required
            v-model="title"
            ></v-text-field>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
        <v-textarea
          :label="$vuetify.t('$vuetify.TopicCreation.description')"
          :hint="$vuetify.t('$vuetify.TopicCreation.descriptionHint')"
          v-model="description"
          ></v-textarea>
        </v-flex>
        <v-flex  xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
            <v-btn @click="submitIdea" round color="green" dark>{{ $vuetify.t('$vuetify.TopicCreation.publish') }}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>

<script>

import * as api from '@/api/topic'
import Filters from '@/components/Filters'

export default {
  name: 'TopicEdit',
  components: { Filters },
  data: () => ({
    title: '',
    description: '',
    tab: 0
  }),

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
  },

  methods: {
    submitIdea: function () {
      var newIdea = {
        title: this.title,
        description: this.description,
        school_id: this.$store.getters.selected_school,
        created_by: this.$store.getters.userId,
        changed_by: this.$store.getters.userId,
        idea_space: this.$route.params['spaceId']
      }
      console.log(newIdea)
      api.createTopic(newIdea).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>
