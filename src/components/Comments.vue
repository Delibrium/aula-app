<template>
  <div class='comments'>
    <h3 v-if="comments != null">
      {{ $vuetify.t('$vuetify.Comment.title', comments.length) }}

      <v-btn-toggle v-model="sortBy" @change="this.sortComments" mandatory>
        <v-btn small>
          {{ $vuetify.t('$vuetify.Comment.sortByNew') }}
        </v-btn>
        <v-btn small>
          {{ $vuetify.t('$vuetify.Comment.sortByVotes') }}
        </v-btn>
      </v-btn-toggle>
    </h3>

    <Comment
      class='commentTopLevel'
      :comments="comments"
    />

    <v-card class='newCommentForm' v-if="!disabled">
      <v-form>
        <v-card-title v-if="editingId != null">
          <h3>
            {{ $vuetify.t('$vuetify.Comment.formTitleEdit') }}
          </h3>
        </v-card-title>
        <v-card-title v-else>
          <h3>
            {{ $vuetify.t('$vuetify.Comment.formTitleCreate') }}
          </h3>
        </v-card-title>

        <v-card-text>
          <p v-if="parentCommentId != null">
            {{ $vuetify.t('$vuetify.Comment.formReplyTo', this.parentCommentId) }}
          </p>
          <v-text-field
            name='text'
            v-model='text'
            v-validate="'required'"
            :error-messages="errors.collect('text')"
            :label="this.$vuetify.t('$vuetify.Comment.formLabelTitle')"
            required
            >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="this.submit">
            {{ $vuetify.t('$vuetify.Comment.submit') }}
          </v-btn>
          <v-btn flat @click="this.cancel" v-if="this.editingId == null">
            {{ $vuetify.t('$vuetify.Comment.reset') }}
          </v-btn>
          <v-btn flat @click="this.cancel" v-else>
            {{ $vuetify.t('$vuetify.Comment.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
    <p v-else>
      {{ $vuetify.t('$vuetify.Comment.disabled') }}
    </p>

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

const tally = comment => {
  // Tally up the votes on a comment and return an absolute result
  if (comment == null) return 0
  const up = comment.votes.filter(v => v.val === 'up').length
  const down = comment.votes.filter(v => v.val === 'down').length
  return up - down
}

export default {
  $_veeValidate: { validator: 'new' },

  name: 'Comments',
  props: ['disabled'],
  data: function () {
    return {
      comments: null,
      editingId: null,
      text: null,
      parentCommentId: null,
      showSnackbar: null,
      snackbarMsg: null,
      sortBy: 1
    }
  },

  components: { Comment },

  beforeMount: function () {
    this.getComments()

    // As comments can be nested deeply, the root element
    // is used as an event bus. Recursively inserted <Comment /> elements
    // send events for various events, which are received here.
    this.$root.$on('set-reply', this.setReply)
    this.$root.$on('set-edit', this.setEditing)
    this.$root.$on('set-deleted', this.setDeleted)
    this.$root.$on('reload', this.getComments)
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
      // Reset the validator on the next tick to avoid triggering
      // validation errors because of the empty fields
      this.$nextTick(() => this.$validator.reset())
    },
    getComments: function () {
      api.comment.get(this.ideaId).then(resp => {
        this.comments = resp.data
        this.sortComments()
      })
    },
    setReply: function (commentId) {
      this.parentCommentId = commentId
    },
    setEditing: function (commentId) {
      const comment = this.comments.filter(c => c.id === commentId).shift()
      if (comment != null) {
        this.text = comment.text
        this.editingId = commentId
      }
    },
    setDeleted: function (commentId) {
      api.comment.remove(commentId)
        .then(res => {
          this.getComments()
        })
        .catch(() => {
          this.showSnackbar = true
          this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.serverError')
        })
    },
    sortComments: function () {
      const sortByNew = (a, b) => {
        return a.created_at < b.created_at ? 1 : -1
      }
      const sortByVotes = (a, b) => {
        const ta = tally(a)
        const tb = tally(b)
        return ta === tb
          ? sortByNew(a, b) // Sort by date if two comments have same vote count
          : ta < tb
            ? 1
            : -1
      }
      // Select sorting function depending on index of selection button group
      const fn = [sortByNew, sortByVotes][this.sortBy]
      this.comments = this.comments.sort(fn)
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
            comment.created_by = currentUserId
            fn = api.comment.create
          } else {
            comment.id = this.editingId
            comment.changed_by = currentUserId
            fn = api.comment.patch
          }

          fn(comment)
            .then((res) => {
              if (res.status < 400) {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t('$vuetify.Comment.snackbarCreated')
                this.getComments()
                this.cancel()
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Snackbar.serverError')
              }
            })
            .catch(() => {
              this.showSnackbar = true
              this.snackbarMsg = this.$vuetify.t('$vuetify.Snackbar.serverError')
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
  .comments {
    margin: 2em auto;
  }
  .comments > h3 {
    margin-bottom: 1em;
  }
  .newCommentForm {
    margin-top: 2em;
  }
</style>