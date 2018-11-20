<template>
  <div>
    <h3 v-if="comments != null">
      {{ $vuetify.t('$vuetify.Idea.suggestions', comments.length) }}
    </h3>

    <Comment
      class='commentTopLevel'
      :comments="comments"
    />

    <v-card class='newCommentForm'>
      <v-form>
        <v-card-title v-if="editingId != null"><h3>Verbesserungsvorschlag "{{ text }}" bearbeiten</h3></v-card-title>
        <v-card-title v-else><h3>Neuer Verbesserungsvorschlag</h3></v-card-title>
        <v-card-text>
          <p v-if="parentCommentId != null">
            Antwort auf {{ parentCommentId }}
          </p>
          <v-text-field
            name='text'
            v-model='text'
            v-validate="'required'"
            :error-messages="errors.collect('text')"
            label='Dein Verbesserungsvorschlag'
            required
            >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="this.submit">Veröffentlichen</v-btn>
          <v-btn flat @click="this.cancel" v-if="this.editingId == null">Zurücksetzen</v-btn>
          <v-btn flat @click="this.cancel" v-else>Abbrechen</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>

    <v-snackbar
      v-model="showSnackbar"
      :bottom="true"
    >
      {{ snackbarMsg }}
      <v-btn
        color="pink"
        flat
        @click="showSnackbar = false"
      >
        {{ $vuetify.t('$vuetify.Snackbar.close') }}
      </v-btn>
    </v-snackbar>

  </div>
</template>

<script>
import api from '@/api'
import Comment from '@/components/Comment'
// import { isUserMemberOf } from '../utils/permissions'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'Comments',
  props: [],
  data: function () {
    return {
      comments: null,
      editingId: null,
      text: null,
      parentCommentId: null,
      showSnackbar: null,
      snackbarMsg: null
    }
  },

  components: { Comment },

  beforeMount: function () {
    this.getComments()

    // As comments can be nested deeply, the root element
    // is used as an event bus. Recursively inserted <Comment /> elements
    // send a 'set-reply' event there to be received here.
    this.$root.$on('set-reply', (replyId) => {
      this.parentCommentId = replyId
    })
  },

  computed: {
    ideaId: function () {
      return this.$route.params.ideaId
    }
  },

  methods: {
    cancel: function () {
      this.editingId = null
      this.text = ''
      this.parentCommentId = null
      this.$nextTick(() => this.$validator.reset())
    },
    getComments: function () {
      api.comment.get(this.ideaId).then(resp => {
        this.comments = resp.data
      })
    },
    submit: function () {
      this.$validator.validate()
        .then(isFormValid => {
          if (!isFormValid) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.formError')
            return
          }

          // if (!isUserMemberOf(['admin'])) {
          //   this.showSnackbar = true
          //   this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.rightsError')
          //   return
          // }

          const currentUserId = this.$store.getters.userId

          const comment = {
            created_by: currentUserId,
            changed_by: currentUserId,
            school_id: this.$store.getters.selected_school,
            text: this.text,
            parent_idea: this.ideaId,
            parent_comment: this.parentCommentId
          }

          // Select the appripriate api depending on whether
          // a comment is being added or edited. Also fill
          // in the comment id when editing.
          let fn
          if (this.editingId == null) {
            fn = api.comment.create
          } else {
            comment.id = this.editingId
            fn = api.comment.update
          }

          fn(comment)
            .then((res) => {
              if (res.status < 400) {
                this.showSnackbar = true
                this.snackbarMsg = 'Verbesserungsvorschlag veröffentlicht'
                this.getComments()
                this.cancel()
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Snackbar.serverError')
              }
            })
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .card {
    padding: 10px;
  }
  .commentTopLevel {
    list-style: none;
  }
</style>
