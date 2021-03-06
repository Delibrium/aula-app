<template>
  <v-layout column class='comments'>
    <v-flex md10 xs12 class="actions">
      <h3 v-if="comments != null">
        {{ $vuetify.t('$vuetify.Comment.title', comments.length) }}

        <div class="buttons">
        <v-btn-toggle v-model="sortBy" @change="this.sortComments" mandatory>
          <v-btn small>
            {{ $vuetify.t('$vuetify.Comment.sortByNew') }}
          </v-btn>
          <v-btn small>
            {{ $vuetify.t('$vuetify.Comment.sortByVotes') }}
          </v-btn>
        </v-btn-toggle>
        </div>
      </h3>
    </v-flex>
    <v-flex md10 xs12>
      <v-layout align-center justify-center>
        <v-flex class="add-comment" md2 text-md-center text-xs-center>
          <v-btn v-if="!disabled" @click="editingComment = true" class="white--text" color="primary"> {{ $vuetify.t('$vuetify.Comment.add') }} </v-btn>
          <v-tooltip v-if="disabled" bottom>
            <v-btn slot="activator" disabled class="white--text" color="primary"> {{ $vuetify.t('$vuetify.Comment.add') }} </v-btn>
            <span>{{ $vuetify.t('$vuetify.Comment.disabled') }}</span>
          </v-tooltip>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-dialog v-model="editingComment" :max-width="maxEditorWidth" :fullscreen="$vuetify.breakpoint.xsOnly" transition="dialog-bottom-transition" content-class="comment-editor">
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
              {{ $vuetify.t('$vuetify.Comment.formReplyTo', this.parentComment.created_by.username) }}
            </p>
            <quill-editor class="editor-example bubble"
                   ref="commentEditor"
                   :content="text"
                   :options="editorOptions"
                   @change="onEditorChange($event)"
                   >
               <div id="toolbar" slot="toolbar">
                 <!-- Add a bold button -->
                 <button class="ql-bold">Bold</button>
                 <button class="ql-italic">Italic</button>
                 <button class="ql-link">Link</button>
                 <button class="ql-image">Image</button>
                 <button class="ql-align" value="center">Align Center</button>
                 <button class="ql-list" value="ordered">Ordered List</button>
                 <button class="ql-list" value="bullet">Bullet List</button>
                 <!-- Add font size dropdown -->
                 <select class="ql-size">
                   <option value="small"></option>
                   <!-- Note a missing, thus falsy value, is used to reset to default -->
                   <option selected></option>
                   <option value="large"></option>
                   <option value="huge"></option>
                 </select>
                 <select class="ql-font">
                   <option selected="selected"></option>
                   <option value="serif"></option>
                   <option value="monospace"></option>
                 </select>
               </div>
            </quill-editor>

            <!--
            <v-textarea
              name='text'
              v-model='text'
              v-validate="'required'"
              :error-messages="errors.collect('text')"
              :label="this.$vuetify.t('$vuetify.Comment.formLabelTitle')"
              required
              >
              </v-textarea> -->
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
      <v-card v-if="disabled">
        <v-card-text>
          <v-alert type="info" :value="true">
            {{ $vuetify.t('$vuetify.Comment.disabled') }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-flex>
    <Comment
      class='commentTopLevel'
      :comments="comments"
    />
    </v-flex>


    <v-snackbar
      v-model="showSnackbar"
      :bottom="true"
    >
      {{ snackbarMsg }}
      <v-btn
        color="accent"
        flat
        @click="showSnackbar = false"
      >
        {{ $vuetify.t('$vuetify.Snackbar.close') }}
      </v-btn>
    </v-snackbar>

  </v-layout>
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
      editingComment: false,
      text: null,
      parentCommentId: null,
      parentComment: null,
      showSnackbar: null,
      snackbarMsg: null,
      sortBy: 1,
      editorOptions: {
        placeholder: '...',
        modules: {
          toolbar: '#toolbar'
        }
      }
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
    },
    fullWidthEditor: function () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return true
        default: return false
      }
    },
    maxEditorWidth: function () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return '100%'
        case 'sm': return '400px'
        case 'md': return '500px'
        case 'lg': return '600px'
        case 'xl': return '800px'
      }
    }
  },

  methods: {
    onEditorChange: function ({ quill, html, text }) {
      this.text = html
    },

    cancel: function () {
      this.editingId = null
      this.text = ''
      this.parentCommentId = null
      this.editingComment = false
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
    setReply: function (comment) {
      this.editingComment = true
      this.parentComment = comment
      this.parentCommentId = comment.id
    },
    setEditing: function (commentId) {
      this.editingComment = true
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
    ul {
      padding-left: 0 !important;
    }
  }
  .comments {
    .actions {
       background-color: white;
       padding: 10px;
       border-bottom: 1px solid #bdbdbd;

       h3 {
        text-align: center;
       }

       .buttons {
         float: right;
       }
    }
  }
  .comments > h3 {
    margin-bottom: 1em;
  }
  .newCommentForm {
  }

  .add-comment {
     padding: 10px;
  }

  .v-dialog.comment-editor {
     margin: 10px;
  }

  .v-dialog.v-dialog--active {
     margin: 0;
  }
</style>
