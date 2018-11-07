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
            <v-btn @click="submit" round color="green" dark>{{ $vuetify.t('$vuetify.TopicCreation.publish') }}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-slide-y-transition>
</template>

<script>

import * as api from '@/api/topic'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'TopicEdit',
  props: {
    spaceSlug: ''
  },

  data: () => ({
    title: '',
    description: '',
    tab: 0,
    dictionary: {
      custom: {
        title: {
          required: 'Bitte gib dem Thema einen Namen',
          max: 'Das ist zu lang! Bitte gib dem Thema einen kurzen, eingängigen Namen.'
        }
      }
    }
  }),

  beforeMount: function () {
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    submit: function () {
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) return

          const topic = {
            title: this.title,
            description: this.description,
            school_id: this.$store.getters.selected_school,
            created_by: this.$store.getters.userId,
            changed_by: this.$store.getters.userId,
            idea_space: this.$route.params['spaceId'],
            image: '',
            phase: 'edit_topics'
          }

          api.createTopic(topic)
            .then((res) => {
              if (res.status < 400 && res.data.length > 0) {
                const spaceSlug = this.$route.params['spaceSlug']
                // TODO: Redirect to topic's view
                // const topicId = res.data[0].id
                this.$router.push(
                  { name: 'Topics', params: { spaceSlug } }
                )
              } else {
                this.snackbar = this.$vuetify.t('$vuetify.Snackbar.serverError')
              }
            })
            .catch(() => {
              this.snackbar = this.$vuetify.t('$vuetify.Snackbar.networkError')
            })
        })
        .catch(() => {
          this.snackbar = this.$vuetify.t('$vuetify.Snackbar.clientError')
        })
    }
  }
}
</script>
