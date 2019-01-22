<template>
  <v-slide-y-transition mode="out-in">
    <v-container fluid grid-list-md>
      <v-layout row wrap align-center>
        <v-flex md8 offset-md2 xs12>
          <v-card>
            <v-card-text>
              <v-layout row wrap align-center>
                <v-flex md8 offset-md2 xs12>
                  <h1 v-if="editTopicId == null">
                    {{ $vuetify.t('$vuetify.TopicCreation.pageTitleCreating') }}
                  </h1>
                  <h1 v-else>
                    {{ $vuetify.t('$vuetify.TopicCreation.pageTitleEditing') }}
                  </h1>
                </v-flex>
                <v-flex md8 offset-md2 xs12>
                  <v-text-field
                    name="title"
                    :label="$vuetify.t('$vuetify.TopicCreation.title')"
                    :hint="$vuetify.t('$vuetify.TopicCreation.titleHint')"
                    v-validate="'required|max:160'"
                    :error-messages="errors.collect('title')"
                    required
                    v-model="title"
                    :disabled="isLoadingTopic"
                    :loading="isLoadingTopic"
                  ></v-text-field>
                </v-flex>
                <v-flex md8 offset-md2 xs12>
                  <v-textarea
                    name="description"
                    :label="$vuetify.t('$vuetify.TopicCreation.description')"
                    :hint="$vuetify.t('$vuetify.TopicCreation.descriptionHint')"
                    v-validate="'required'"
                    required
                    :error-messages="errors.collect('description')"
                    v-model="description"
                    :disabled="isLoadingTopic"
                    :loading="isLoadingTopic"
                  ></v-textarea>
                </v-flex>
                <v-flex class="select-ideas" md8 offset-md2 xs12>
                  <h2>{{ $vuetify.t('$vuetify.TopicCreation.selectIdeas') }}</h2>
                  <v-alert
                    :value="errors.has('selectIdeas')"
                    type="warning"
                  >{{ errors.first('selectIdeas')}}</v-alert>
                  <v-list two-line dense>
                    <template v-for="(idea, index) in ideas">
                      <v-list-tile :key="idea.id">
                        <v-list-tile-avatar>
                          <v-checkbox
                            name="selectIdeas"
                            v-model="selected"
                            :value="idea.id"
                            :v-validate="shouldValidateWildIdeas"
                          ></v-checkbox>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ idea.title }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ idea.description }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-flex>
                <v-flex xs12 md8 offset-md2 pa-2 align-center justify-center text-md-center text-xs-center>
                  <v-btn
                    @click="submit"
                    round
                    color="primary"
                    dark
                  >{{ $vuetify.t('$vuetify.TopicCreation.publish') }}</v-btn>
                  <v-btn
                    v-if="this.$route.params.topicId != null"
                    :to="{ name: 'Topic', spaceSlug: this.$route.params.spaceSlug, topicId: this.$route.params.topicId }"
                    round
                    dark
                  >{{ $vuetify.t('$vuetify.TopicCreation.cancel') }}</v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
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

import * as spaceApi from '@/api/ideaSpace'
import * as topicApi from '@/api/topic'
import { isUserMemberOf } from '../utils/permissions'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'TopicEdit',
  props: {
    spaceSlug: ''
  },

  computed: {
    editTopicId: function () {
      return this.$route.params['topicId']
    },
    shouldValidateWildIdeas: function () {
      if (this.editTopicId == null) {
        return 'required'
      } else {
        return null
      }
    }
  },

  data: () => ({
    title: '',
    description: '',
    tab: 0,
    selected: [],
    ideas: [],
    showSnackbar: false,
    snackbarMsg: '',
    isLoadingTopic: false,
    dictionary: {
      custom: {
        title: {
          required: 'Bitte gib dem Thema einen Namen',
          max: 'Das ist zu lang! Bitte gib dem Thema einen kurzen, eingängigen Namen.'
        },
        description: {
          required: 'Bitte gib eine Beschreibung für dieses Thema ein'
        },
        selectIdeas: {
          required: 'Bitte wähle mindestens eine Idee für das neue Thema'
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
    if (this.editTopicId != null) {
      this.getTopic()
    }
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    getIdeas: function (schoolId, spaceId) {
      spaceApi.getIdeas(schoolId, spaceId).then((res) => {
        this.ideas = this.ideas.concat(res.data)
      })
    },
    getTopic: function () {
      this.isLoadingTopic = true
      topicApi.get(this.editTopicId)
        .then((res) => {
          this.title = res.data[0].title
          this.description = res.data[0].description
          this.isLoadingTopic = false
        })
        .catch((err) => {
          console.log(err)
          this.showSnackbar = true
          this.snackbarMsg = this.$vuetify.t('$vuetify.TopicCreation.topicNotFound')
          this.isLoadingTopic = false
        })
    },
    assignIdeas: function (topicId) {
      const spaceSlug = this.$route.params['spaceSlug']
      topicApi.assignIdeas(topicId, this.selected)
        .then(res => {
          if (res == null || res.status < 400) {
            const newId = res.data[0].id
            this.$router.push(
              { name: 'Topic', params: { spaceSlug, topicId: newId } }
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
    },
    submit: function () {
      this.$validator.validate()
        .then(isFormValid => {
          // Do nothing if validation fails -  errors are displayed in UI
          if (!isFormValid) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
            return
          }

          if (!isUserMemberOf(['school_admin', 'principal', 'admin'])) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.rightsError')
            return
          }

          const now = (new Date()).toISOString()
          const topic = {
            title: this.title,
            description: this.description,
            school_id: this.$store.getters.selected_school,
            created_by: this.$store.getters.userId,
            changed_by: this.$store.getters.userId,
            idea_space: this.$route.params['spaceId'],
            image: ''
          }

          if (this.editTopicId != null) {
            topic.id = this.editTopicId
            topic.changed_by = this.$store.getters.userId
            topic.changed_at = now
          } else {
            topic.phase = 'edit_topics'
            topic.config = {
              'edit_topics_started': now
            }
          }

          topicApi.createOrUpdate(topic)
            .then((res) => {
              if (res.status < 400 && res.data.length > 0) {
                const topicId = res.data[0].id

                if (this.selected.length > 0) {
                  this.assignIdeas(topicId)
                } else {
                  const spaceSlug = this.$route.params['spaceSlug']
                  this.$router.push(
                    { name: 'Topic', params: { spaceSlug, topicId } }
                  )
                }
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

<style scoped lang="scss">
.select-ideas h2 {
  margin: 2em auto 1em;
}

.select-ideas .v-list {
  background-color: inherit;
}
</style>
