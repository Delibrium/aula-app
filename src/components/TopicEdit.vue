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
      <v-flex class='select-ideas' md8 offset-md2 xs12>
        <h2>{{ $vuetify.t('$vuetify.TopicCreation.selectIdeas') }}</h2>
        <v-list two-line dense>
          <template v-for="(idea, index) in ideas">
            <v-list-tile :key="idea.id">
              <v-list-tile-avatar>
                <v-checkbox v-model="selected" :value='idea.id'></v-checkbox>
              </v-list-tile-avatar>
              <v-list-tile-content>
              <v-list-tile-title>

                {{ idea.title }}
              </v-list-tile-title>
              <v-list-tile-sub-title>{{ idea.description }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
        <v-flex  xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
            <v-btn @click="submit" round color="green" dark>{{ $vuetify.t('$vuetify.TopicCreation.publish') }}</v-btn>
        </v-flex>
      </v-layout>
      <v-snackbar
        :value="snackbar !== null"
        :bottom="true"
      >
        {{ snackbar }}
        <v-btn
          color="pink"
          flat
          @click="snackbar = null"
        >
          {{ $vuetify.t('$vuetify.Snackbar.close') }}
        </v-btn>
      </v-snackbar>
    </v-container>
  </v-slide-y-transition>
</template>

<script>

import * as spaceApi from '@/api/ideaSpace'
import * as topicApi from '@/api/topic'
import { isUserMemberOf } from '../utils/permissions'

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
    selected: [],
    ideas: [],
    snackbar: null,
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
    if (!this.spaceId) {
      spaceApi.getSpace(this.$store.getters.selected_school, this.$route.params['spaceSlug'])
        .then((res) => {
          this.spaceId = res.data[0].id
          this.getIdeas(this.$store.getters.selected_school, this.spaceId)
        })
    } else {
      this.getIdeas(this.$store.getters.selected_school, this.spaceId)
    }
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    getIdeas: function (schoolId, spaceId) {
      spaceApi.getIdeas(schoolId, spaceId).then((res) => {
        this.ideas = res.data
      })
    },
    submit: function () {
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) return

          if (!isUserMemberOf(['school_admin', 'principal'])) {
            this.snackbar = this.$vuetify.t('snackbar.rightsError')
            return
          }

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

          topicApi.create(topic)
            .then((res) => {
              if (res.status < 400 && res.data.length > 0) {
                const spaceSlug = this.$route.params['spaceSlug']
                const topicId = res.data[0].id

                topicApi.assignIdeas(topicId, this.selected)
                  .then(res => {
                    if (res == null || res.status < 400) {
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

<style scoped lang="scss">
  .select-ideas h2 {
    margin: 2em auto 1em;
  }

  .select-ideas .v-list {
    background-color: inherit;
  }
</style>
