<template>
    <v-container pa-0>
      <v-layout row wrap align-center justify-center>
        <v-flex md10 xs12>
           <Breadcrumbs :items="breadcrumbs"/>
        </v-flex>
        <v-flex md10 xs12>
          <v-layout row wrap align-center>
            <v-flex>
              <v-card>
                <v-card-text>
                  <v-layout row wrap align-center justify-center>
                    <v-flex md10>
                      <h1 v-if="this.topic != null">{{ $vuetify.t('$vuetify.IdeaCreation.titleWithTopic', this.topic.title) }}</h1>
                      <h1 v-else>{{ $vuetify.t('$vuetify.IdeaCreation.title') }}</h1>
                    </v-flex>
                    <v-flex md10 xs12>
                      <v-text-field
                        name="title"
                        :label="$vuetify.t('$vuetify.IdeaCreation.name')"
                        :hint="$vuetify.t('$vuetify.IdeaCreation.nameExample')"
                        v-model="idea.title"
                        v-validate="'required|max:160'"
                        :error-messages="errors.collect('title')"
                        required
                      ></v-text-field>
                    </v-flex>
                    <v-flex md10 xs12>
                      <v-textarea
                        name="suggestion"
                        :label="$vuetify.t('$vuetify.IdeaCreation.suggestion')"
                        :hint="$vuetify.t('$vuetify.IdeaCreation.suggestionDescription')"
                        v-model="idea.description"
                      ></v-textarea>
                    </v-flex>
                    <v-flex md10 xs12>
                      <CategorySelect :selectedCategory="categoryId" :cats="categories" @select-category="selectCategory"/>
                    </v-flex>
                    <v-flex xs12 md8 pa-2 align-center justify-center text-md-center text-xs-center>
                      <v-alert error :value="!topicMayReceiveIdeas">
                        {{ $vuetify.t('$vuetify.Topic.cantCreateIdea') }}
                      </v-alert>
                      <v-btn
                        @click="submitIdea"
                        :disabled="!topicMayReceiveIdeas"
                        color="primary"
                        dark
                      >{{ isEditing ? $vuetify.t('$vuetify.Form.save') : $vuetify.t('$vuetify.IdeaCreation.publish') }}</v-btn>
                      <v-btn
                        v-if="this.topic != null"
                        href
                        :to="{name: 'Topic', params: {topicId: this.topicId}}"
                        round
                        dark
                      >{{ $vuetify.t('$vuetify.IdeaCreation.backToTopic') }}</v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
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
</template>

<script>
import api from '@/api'
import apiIdea from '@/api/idea'
import { isUserMemberOf } from '../utils/permissions'
import Breadcrumbs from '@/components/Breadcrumbs'
import CategorySelect from '@/components/CategorySelect'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'IdeaEdit',
  components: { Breadcrumbs, CategorySelect },
  data: function () {
    return {
      idea: {
        title: '',
        description: '',
        category: { }
      },
      categories: [],
      tab: 0,
      showSnackbar: false,
      snackbarMsg: '',
      topic: null,
      breadcrumbs: [],
      spaceName: this.$store.getters.schoolConfig.mainSpaceName,
      dictionary: {
        custom: {
          title: {
            required: 'Bitte beschreibe hier deine Idee kurz',
            max: 'Das ist zu lang! Gib hier nur eine kurze Beschreibung deiner Idee ein.'
          }
        }
      }
    }
  },

  computed: {
    categoryId: function () {
      return this.idea.category.id
    },
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
    spaceSlug: '',
    isEditing: false
  },

  beforeMount: function () {
    if (this.topicId != null) {
      api.topic.get(this.topicId)
        .then(res => {
          this.topic = res.data[0]
        })
    }

    if (this.$route.params['spaceSlug'] !== 'school') {
      api.ideaSpace.getSpace(this.$store.getters.selected_school, this.$route.params['spaceSlug'])
        .then((res) => {
          this.spaceId = res.data[0].id
          this.spaceName = res.data[0].title
          this.setBreadcrumbs()
        })
    }

    api.category.get(this.$store.getters.school_id).then((res) => {
      this.$set(this, 'categories', res.data)
      if (!this.isEditing) {
        let defaultCategory = this.categories.filter(c => c.def)
        this.idea.category = defaultCategory[0]
      }
    })

    this.setBreadcrumbs()

    if (this.$route.params['ideaId']) {
      apiIdea.getIdea(this.$route.params['ideaId']).then((res) => {
        let idea = res.data[0]
        this.idea = idea
        this.$nextTick()
      })
    }
  },

  mounted () {
    this.$validator.localize('en', this.dictionary)
  },

  methods: {
    selectCategory: function (categoryId) {
      this.idea.category = categoryId
    },
    setBreadcrumbs: function () {
      var ideaPlaceRoute

      ideaPlaceRoute = {
        title: `[${this.spaceName}] Wilde ideen`,
        to: {
          name: 'Ideas',
          params: {
            spaceSlug: this.$route.params['spaceSlug']
          }
        }
      }

      this.breadcrumbs = [
        { title: 'aula',
          to: '/'
        },
        ideaPlaceRoute,
        {
          title: this.$vuetify.t('$vuetify.Space.newIdea'),
          to: this.$route.path
        }
      ]
    },

    submitIdea: function () {
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
            title: this.idea.title,
            description: this.idea.description,
            school_id: this.$store.getters.selected_school,
            created_by: this.isEditing ? this.idea.created_by.id : this.$store.getters.userId,
            changed_by: this.$store.getters.userId,
            idea_space: this.$route.params['spaceId'],
            category: this.idea.category.id
          }

          if (this.topic != null) {
            newIdea = Object.assign({}, newIdea, {
              topic: this.topic.id
            })
          }

          let apiRequest
          if (this.isEditing) {
            newIdea.id = this.idea.id
            apiRequest = api.ideaSpace.updateIdea
          } else {
            apiRequest = api.ideaSpace.createIdea
          }

          apiRequest(newIdea)
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
        .catch((e) => {
          this.showSnackbar = true
          this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.clientError')
        })
    }
  }
}
</script>
