<template>
  <v-card class='card'>
    <form>
      <v-card-title v-if="editingId == null">
        <h3>{{ $vuetify.t('$vuetify.AdminUsers.titleAdd') }}</h3>
      </v-card-title>
      <v-card-title v-else>
        <h3>{{ $vuetify.t('$vuetify.AdminUsers.titleEdit', user.login) }}</h3>
      </v-card-title>
      <v-card-text>
        <v-text-field
          name='firstName'
          v-model='firstName'
          v-validate="'required'"
          :error-messages="errors.collect('firstName')"
          :label="this.$vuetify.t('$vuetify.AdminUsers.formFirstName')"
          required
          >
        </v-text-field>
        <v-text-field
          name='lastName'
          v-model='lastName'
          v-validate="'required'"
          :error-messages="errors.collect('lastName')"
          :label="this.$vuetify.t('$vuetify.AdminUsers.formLastName')"
          required
          >
        </v-text-field>
        <v-text-field
          name='username'
          v-model='username'
          v-validate=""
          :error-messages="errors.collect('username')"
          :label="usernameLabel"
          >
        </v-text-field>
        <v-text-field
          name='email'
          v-model='email'
          v-validate=""
          :error-messages="errors.collect('email')"
          :label="this.$vuetify.t('$vuetify.AdminUsers.formEmail')"
          required
          >
        </v-text-field>
        <v-select
          name='usergroup'
          v-if="editingId == null"
          v-model="usergroup"
          v-validate="'required'"
          :error-messages="errors.collect('usergroup')"
          :items="usergroups"
          :label="this.$vuetify.t('$vuetify.AdminUsers.formGroup')"
          required
        ></v-select>
        <v-select
          name='ideaSpace'
          v-if="editingId == null"
          v-model="ideaSpace"
          v-validate=""
          :error-messages="errors.collect('ideaSpace')"
          :items="ideaSpaces"
          :label="this.$vuetify.t('$vuetify.AdminUsers.formIdeaSpace')"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn flat @click="submit" v-if="editingId == null">
          {{ $vuetify.t('$vuetify.AdminUsers.formCreate') }}
        </v-btn>
        <v-btn flat @click="submit" v-else>
          {{ $vuetify.t('$vuetify.AdminUsers.formSave') }}
        </v-btn>
        <v-btn flat @click="cancel" v-if="editingId == null">
          {{ $vuetify.t('$vuetify.AdminUsers.formReset') }}
        </v-btn>
        <v-btn flat @click="cancel" v-else>
          {{ $vuetify.t('$vuetify.AdminUsers.formCancel') }}
        </v-btn>
      </v-card-actions>
    </form>
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
  </v-card>
</template>

<script>
import api from '@/api'

export default {
  $_veeValidate: { validator: 'new' },

  name: 'GroupsUsersEditor',
  data: function () {
    const defaultGroups = [
      { value: 'student', text: this.$vuetify.t('$vuetify.roles.student') },
      { value: 'class_guest', text: this.$vuetify.t('$vuetify.roles.class_guest') },
      { value: 'school_guest', text: this.$vuetify.t('$vuetify.roles.school_guest') },
      { value: 'moderator', text: this.$vuetify.t('$vuetify.roles.moderator') },
      { value: 'principal', text: this.$vuetify.t('$vuetify.roles.principal') },
      { value: 'school_admin', text: this.$vuetify.t('$vuetify.roles.school_admin') },
      { value: 'admin', text: this.$vuetify.t('$vuetify.roles.admin') }
    ]

    const defaultUser = {
      firstName: '',
      lastName: '',
      username: '',
      usergroup: 'student',
      ideaSpace: null,
      autoUsername: '',
      email: ''
    }

    let defaultData = {
      usergroup: 'student',
      editingId: null,
      showSnackbar: false,
      snackbarMsg: '',
      ideaSpaces: [],
      usernameLabel: this.genUsernameLabel(),
      usergroups: defaultGroups,
      defaultUser: defaultUser
    }

    // The defaultUser value is applied to the data object
    // to set initial values for the form fields
    defaultData = Object.assign(defaultData, defaultUser)
    return defaultData
  },

  beforeMount: function () {
    this.getIdeaSpaces()
  },

  computed: {
    generatedUsername: function () {
      // Suggested usernames are a lower case string with two parts:
      // - the first character of the user's first name - if any
      // - their last name
      return (
        (this.firstName && this.firstName.length > 0 ? this.firstName[0] : '') +
        this.lastName
      ).toLowerCase()
    }
  },

  props: ['handleSuccess', 'handleCancel', 'user'],

  watch: {
    user: function (next, prev) {
      if (next == null) next = {}
      this.firstName = next.first_name
      this.lastName = next.last_name
      this.username = next.login
      this.email = next.email
      this.usergroup = next.group_id
      this.editingId = next.id
      this.$nextTick(() => this.$validator.reset())
    },
    lastName: function () {
      // Shows preview of auto-generated username in label of the
      // username input fields as soon as users type in the name input fields
      this.usernameLabel = this.genUsernameLabel()
    },
    firstName: function () {
      this.usernameLabel = this.genUsernameLabel()
    }
  },

  methods: {
    genUsernameLabel: function () {
      const un = this.username
      const ln = this.lastName

      return (un == null || un.length === 0) && ln && ln.length > 1
        ? this.$vuetify.t(
          '$vuetify.AdminUsers.formLoginSuggestion',
          this.generatedUsername
        )
        : this.$vuetify.t('$vuetify.AdminUsers.formLogin')
    },
    cancel: function () {
      if (this.user == null) {
        Object.assign(this, this.defaultUser)
        this.$nextTick(() => this.$validator.reset())
      } else {
        this.handleCancel()
      }
    },
    getIdeaSpaces: function () {
      const schoolId = this.$store.getters.selected_school
      api.ideaSpace.getIdeaSpaces(schoolId).then((res) => {
        // Return value is transformed so that it is suitable for
        // vuetify's select component
        this.ideaSpaces = res.data.map(sp => ({
          text: sp.title,
          value: sp.id
        }))
        // Add a no-space-assigned option here
        this.ideaSpaces.push({
          text: this.$vuetify.t('$vuetify.AdminUsers.formNoSpaceSelected'),
          value: null
        })
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

          // Submit the entered username if it has more than one
          // character, otherwise default to the autogenerated username
          const username = this.username && this.username.length > 1
            ? this.username
            : this.generatedUsername

          const email = this.email && this.email.length > 0
            ? this.email
            : null

          const user = {
            first_name: this.firstName,
            last_name: this.lastName,
            email,
            username,
            user_group: this.usergroup,
            idea_space: this.ideaSpace
          }

          // Select the appripriate api depending on whether
          // a user is being added or edited. Also fill
          // in the user id and remove fields only used for new users
          // when editing.
          let fn
          if (this.editingId == null) {
            fn = api.user.create
          } else {
            user.id = this.editingId
            delete user.user_group
            delete user.idea_space
            fn = api.user.update
          }

          fn(user)
            .then((res) => {
              if (res.status < 400) {
                this.showSnackbar = true
                this.snackbarMsg = this.editingId == null
                  ? this.$vuetify.t('$vuetify.AdminUsers.snackbarCreated')
                  : this.$vuetify.t('$vuetify.AdminUsers.snackbarSaved')
                this.handleSuccess(res.data)
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Snackbar.serverError')
              }
            })
            .catch((err) => {
              // 23505 is the Postgrest error code for violations of
              // unique constraints
              if (err.response && err.response.data.code === '23505') {
                this.errors.add({
                  field: 'username',
                  msg: this.$vuetify.t(
                    '$vuetify.AdminUsers.formLoginUniqueError', user.username)
                })
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Snackbar.clientError')
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
</style>
