<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
      <v-layout row wrap align-center>
        <v-flex md8 offset-md2 xs12>
          <h1 v-if="this.topic != null">{{ $vuetify.t('$vuetify.IdeaCreation.titleWithTopic', this.topic.title) }}</h1>
          <h1 v-else>{{ $vuetify.t('$vuetify.IdeaCreation.title') }}</h1>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
          <v-text-field
            name="title"
            :label="$vuetify.t('$vuetify.IdeaCreation.name')"
            :hint="$vuetify.t('$vuetify.IdeaCreation.nameExample')"
            v-model="title"
            v-validate="'required|max:160'"
            :error-messages="errors.collect('title')"
            required
          ></v-text-field>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
          <v-textarea
            name="suggestion"
            :label="$vuetify.t('$vuetify.IdeaCreation.suggestion')"
            :hint="$vuetify.t('$vuetify.IdeaCreation.suggestionDescription')"
            v-model="description"
          ></v-textarea>
        </v-flex>
        <v-flex xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
          <v-alert error :value="!topicMayReceiveIdeas">
            {{ $vuetify.t('$vuetify.Topic.cantCreateIdea') }}
          </v-alert>
          <v-btn
            @click="submitIdea"
            :disabled="!topicMayReceiveIdeas"
            round
            color="primary"
            dark
          >{{ $vuetify.t('$vuetify.IdeaCreation.publish') }}</v-btn>
          <v-btn
            v-if="this.topic != null"
            href
            :to="{name: 'Topic', params: {topicId: this.topicId}}"
            round
            dark
          >{{ $vuetify.t('$vuetify.IdeaCreation.backToTopic') }}</v-btn>
        </v-flex>
      </v-layout>
      <v-snackbar v-model="showSnackbar" :bottom="true">
        {{ snackbarMsg }}
        <v-btn
          color="accent"
          flat
          @click="showSnackbar = false"
        >{{ $vuetify.t('$vuetify.Snackbar.close') }}</v-btn>
      </v-snackbar>
    </v-container>
  </v-slide-y-transition>
</template>

<script>
import api from '@/api'
import { isUserMemberOf } from '../utils/permissions'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'IdeaEdit',
  data: () => ({
    title: '',
    description: '',
    tab: 0,
    showSnackbar: false,
    snackbarMsg: '',
    topic: null,
    dictionary: {
      custom: {
        title: {
          required: 'Bitte beschreibe hier deine Idee kurz',
          max: 'Das ist zu lang! Gib hier nur eine kurze Beschreibung deiner Idee ein.'
        }
      }
    }
  }),

  computed: {
    topicId: function () {
      return this.$route.params.topicId
    },
    userMayCreateIdeas: function () {
      return !isUserMemberOf(['school_admin', 'principal'])
    },
    topicMayReceiveIdeas: function () {
      return this.topicId == null || (this.topic && this.topic.phase === 'edit_topics')
    }
  },

  props: {
    spaceSlug: ''
  },

  beforeMount: function () {
    if (this.topicId != null) {
      api.topic.get(this.topicId)
        .then(res => {
          this.topic = res.data[0]
        })
    }
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    submitIdea: function () {
      debugger
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
            return
          }

          if (!this.userMayCreateIdeas) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.rightsError')
            return
          }

          let newIdea = {
            title: this.title,
            description: this.description,
            school_id: this.$store.getters.selected_school,
            created_by: this.$store.getters.userId,
            changed_by: this.$store.getters.userId,
            idea_space: this.$route.params['spaceId']
          }

          if (this.topic != null) {
            newIdea = Object.assign({}, newIdea, {
              topic: this.topic.id
            })
          }

          api.ideaSpace.createIdea(newIdea)
            .then((res) => {
              if (res.status < 400 && res.data.length > 0) {
                const spaceSlug = this.$route.params['spaceSlug']
                const ideaId = res.data[0].id
                this.$router.push(
                  { name: 'IdeaView', params: { spaceSlug, ideaId } }
                )
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.serverError')
              }
            })
            .catch(() => {
              this.showSnackbar = true
              this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.networkError')
            })
        })
        .catch(() => {
          this.showSnackbar = true
          this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.clientError')
        })
    }
  }
}
</script>
