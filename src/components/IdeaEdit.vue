<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
      <v-layout row wrap align-center>
        <v-flex md8 offset-md2 xs12>
          <h1>{{ $vuetify.t('$vuetify.IdeaCreation.title') }}</h1>
        </v-flex>
        <v-flex md8 offset-md2 xs12>
          <v-text-field
            name='title'
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
          name='suggestion'
          :label="$vuetify.t('$vuetify.IdeaCreation.suggestion')"
          :hint="$vuetify.t('$vuetify.IdeaCreation.suggestionDescription')"
          v-model="description"
          ></v-textarea>
        </v-flex>
        <v-flex  xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
            <v-btn @click="submitIdea" round color="green" dark>{{ $vuetify.t('$vuetify.IdeaCreation.publish') }}</v-btn>
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

import * as api from '@/api/ideaSpace'
import Filters from '@/components/Filters'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'IdeaEdit',
  components: { Filters },
  data: () => ({
    title: '',
    description: '',
    tab: 0,
    snackbar: null,
    dictionary: {
      custom: {
        title: {
          required: 'Bitte beschreibe hier deine Idee kurz',
          max: 'Das ist zu lang! Gib hier nur eine kurze Beschreibung deiner Idee ein.'
        }
      }
    }
  }),

  props: {
    spaceSlug: ''
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    submitIdea: function () {
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) return

          const newIdea = {
            title: this.title,
            description: this.description,
            school_id: this.$store.getters.selected_school,
            created_by: this.$store.getters.userId,
            changed_by: this.$store.getters.userId,
            idea_space: this.$route.params['spaceId']
          }

          api.createIdea(newIdea)
            .then((res) => {
              if (res.status < 400 && res.data.length > 0) {
                const spaceSlug = this.$route.params['spaceSlug']
                const ideaId = res.data[0].id
                this.$router.push(
                  { name: 'IdeaView', params: { spaceSlug, ideaId } }
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