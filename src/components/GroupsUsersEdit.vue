<template>
  <v-card>
    <v-card-title class="editor-title">
      <h2 v-if="editingId == null">{{ $vuetify.t('$vuetify.AdminUsers.titleAdd') }}</h2>
      <h3 v-else>{{ $vuetify.t('$vuetify.AdminUsers.titleEdit', user.username) }}</h3>
      <v-dialog v-model="csvDialog" max-width="750px">
        <v-btn slot="activator">
          <v-icon left>cloud_upload</v-icon>
          {{ $vuetify.t('$vuetify.AdminUsers.csvDialog') }}
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">
              {{ $vuetify.t('$vuetify.AdminUsers.csvTitle') }}
            </span>
          </v-card-title>

          <v-card-text>
            <v-layout row wrap>
              <v-flex sm12 md6>
                <p>
                  {{ $vuetify.t('$vuetify.AdminUsers.csvInstructions') }}
                </p>
              </v-flex>
              <v-flex sm12 md6>
                <upload-btn
                  name="csvFile"
                  class="csv-button"
                  :disabled="csvUsers != null"
                  :error-messages="errors.collect('csvFile')"
                  :title="this.$vuetify.t('$vuetify.AdminUsers.csvFilePicker')"
                  accept="text/csv*"
                  :fileChangedCallback="handleFileSelected"
                ></upload-btn>
                <v-btn :disabled="csvUsers == null" @click="resetCSVForm">
                  {{ $vuetify.t('$vuetify.AdminUsers.csvReset') }}
                </v-btn>
              </v-flex>

              <v-flex v-if="csvErrors.length > 0">
                <v-alert v-for="error in csvErrors" :key="error" value="1">
                  {{ error }}
                </v-alert>
              </v-flex>

              <v-flex sm12 mb-3 v-if="csvUsers != null">
                <v-data-table
                  item-key="username"
                  :headers="csvPreviewHeaders"
                  :items="csvUsers">
                  <v-toolbar slot="header" class="mb-2" flat>
                    <v-toolbar-title>
                      {{ $vuetify.t('$vuetify.AdminUsers.csvTableHeader',
                        this.csvUsers.length) }}
                    </v-toolbar-title>
                  </v-toolbar>

                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.username }}</td>
                    <td>{{ props.item.first_name }}</td>
                    <td>{{ props.item.last_name }}</td>
                    <td>{{ props.item.email }}</td>
                  </template>
                </v-data-table>
              </v-flex>

              <v-flex sm12 md6 px-2 v-if="csvUsers != null">
                <v-select
                  name="usergroup"
                  v-model="usergroup"
                  v-validate="'required'"
                  :error-messages="errors.collect('usergroup')"
                  :items="usergroups"
                  :label="this.$vuetify.t('$vuetify.AdminUsers.formGroup')"
                  required
                ></v-select>
              </v-flex>
              <v-flex sm12 md6 px-2 v-if="csvUsers != null">
                <v-select
                  name="ideaSpace"
                  v-model="ideaSpace"
                  v-validate
                  :error-messages="errors.collect('ideaSpace')"
                  :items="ideaSpaces"
                  :label="this.$vuetify.t('$vuetify.AdminUsers.formIdeaSpace')"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              flat
              color="primary"
              @click="saveCSV"
              :loading="isLoading"
              :disabled="csvUsers == null">
              {{ $vuetify.t('$vuetify.AdminUsers.csvSave') }}
            </v-btn>
            <v-btn
              flat
              :disabled="isLoading"
              @click="closeCSVDialog">
              {{ $vuetify.t('$vuetify.AdminUsers.csvClose') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-card-text>
      <v-text-field
        name="firstName"
        v-model="firstName"
        v-validate="'required'"
        :error-messages="errors.collect('firstName')"
        :label="this.$vuetify.t('$vuetify.AdminUsers.formFirstName')"
        required
      ></v-text-field>
      <v-text-field
        name="lastName"
        v-model="lastName"
        v-validate="'required'"
        :error-messages="errors.collect('lastName')"
        :label="this.$vuetify.t('$vuetify.AdminUsers.formLastName')"
        required
      ></v-text-field>
      <v-text-field
        name="username"
        v-model="username"
        v-validate
        :error-messages="errors.collect('username')"
        :label="usernameLabel"
      ></v-text-field>
      <v-text-field
        name="email"
        v-model="email"
        v-validate
        :error-messages="errors.collect('email')"
        :label="this.$vuetify.t('$vuetify.AdminUsers.formEmail')"
        required
      ></v-text-field>
      <v-select
        name="usergroup"
        v-if="editingId == null"
        v-model="usergroup"
        v-validate="'required'"
        :error-messages="errors.collect('usergroup')"
        :items="usergroups"
        :label="this.$vuetify.t('$vuetify.AdminUsers.formGroup')"
        required
      ></v-select>
      <v-select
        name="ideaSpace"
        v-if="editingId == null"
        v-model="ideaSpace"
        v-validate
        :error-messages="errors.collect('ideaSpace')"
        :items="ideaSpaces"
        :label="this.$vuetify.t('$vuetify.AdminUsers.formIdeaSpace')"
      ></v-select>

    </v-card-text>
    <v-card-actions>
      <v-btn
        flat
        color="primary"
        @click="submit"
        v-if="editingId == null"
      >{{ $vuetify.t('$vuetify.AdminUsers.formCreate') }}</v-btn>
      <v-btn
        color="primary"
        @click="updateUser"
        v-if="editingId !== null"
      >{{ $vuetify.t('$vuetify.Form.save') }}</v-btn>
      <v-btn
        flat
        color="primary"
        @click="dialogResetPassword = true"
        v-if="editingId !== null"
      >{{ $vuetify.t('$vuetify.AdminUsers.resetPassword') }}</v-btn>
      <v-btn
        flat
        color="primary"
        @click="submit"
        v-else
      >{{ $vuetify.t('$vuetify.AdminUsers.formSave') }}</v-btn>
      <v-btn
        flat
        @click="cancel"
        v-if="editingId == null"
      >
        {{ $vuetify.t('$vuetify.AdminUsers.formReset') }}
      </v-btn>
      <v-btn flat @click="cancel" v-else>
        {{ $vuetify.t('$vuetify.AdminUsers.formCancel') }}
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="dialogResetPassword" width="400">
      <v-card>
        <v-card-title>
          <h3>{{ $vuetify.t('$vuetify.AdminUsers.confirmResetPassword', this.username) }}</h3>
        </v-card-title>
        <v-card-text>
          <v-alert v-if="newPassword !== ''" :value="true" type="info">
            <b>{{ $vuetify.t('$vuetify.AdminUsers.newPassword') }}:</b>  <h2>{{ newPassword }}</h2>
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            v-if="newPassword == ''"
            @click="resetPassword"
          >{{ $vuetify.t('$vuetify.AdminUsers.resetPassword') }}</v-btn>
          <v-btn @click="dialogResetPassword = false" v-if="newPassword == ''">
            {{ $vuetify.t('$vuetify.AdminUsers.formCancel') }}
          </v-btn>
          <v-btn @click="dialogResetPassword = false; newPassword = ''" v-if="newPassword !== ''">
            {{ $vuetify.t('$vuetify.Form.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="showSnackbar" :bottom="true">
      {{ snackbarMsg }}
      <v-btn
        color="pink"
        flat
        @click="showSnackbar = false"
      >{{ $vuetify.t('$vuetify.Snackbar.close') }}</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import api from '@/api'
import UploadButton from 'vuetify-upload-button'
import Papa from 'papaparse'

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
      dialogResetPassword: false,
      usergroup: 'student',
      editingId: null,
      showSnackbar: false,
      snackbarMsg: '',
      csvDialog: false,
      csvUsers: null,
      csvErrors: [],
      isLoading: false,
      ideaSpaces: [],
      newPassword: '',
      usernameLabel: this.genUsernameLabel(),
      usergroups: defaultGroups,
      defaultUser: defaultUser,
      csvPreviewHeaders: [
        { text: 'Benutzername', value: 'username' },
        { text: 'Vorname', value: 'first_name' },
        { text: 'Nachname', value: 'last_name' },
        { text: 'Email', value: 'email' }
      ]
    }

    // The defaultUser value is applied to the data object
    // to set initial values for the form fields
    defaultData = Object.assign(defaultData, defaultUser)
    return defaultData
  },

  beforeMount: function () {
    this.getIdeaSpaces()
  },

  components: {
    'upload-btn': UploadButton
  },

  computed: {
    allUsernames: function () {
      const existing = this.users == null ? [] : this.users.map(u => u.username)
      const fromCsv = this.csvUsers == null ? [] : this.csvUsers.map(u => u.username)
      return existing.concat(fromCsv)
    }
  },

  props: ['handleSuccess', 'handleCancel', 'user', 'users'],

  watch: {
    user: function (next, prev) {
      if (next == null) next = {}
      this.firstName = next.first_name
      this.lastName = next.last_name
      this.username = next.username
      this.origUsername = next.username
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
    updateUser: function () {
      let userData = {
        id: this.editingId,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email
      }
      api.user.update(userData).then(res => {
        if (this.origUsername !== this.username) {
          api.user.updateUsername(this.editingId, this.username).then(res => {
            this.origUsername = this.username
            this.handleSuccess()
          }).catch(err => {
            console.log(err)
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t(
              '$vuetify.AdminUsers.usernameExists')
          })
        } else {
          this.handleSuccess()
        }
      })
    },

    resetPassword: function () {
      api.user.resetPassword(this.$store.getters.selected_school, this.editingId).then(res => {
        this.newPassword = res.data['new_password']
      })
    },

    genUsername: function (first, last) {
      let candidate
      const firstName = first || this.firstName
      const lastName = last || this.lastName

      var stopSearchingUsername = false
      var sliceSize = 3
      var shortFirstname = firstName.slice(0, sliceSize)
      var shortLastname = lastName.slice(0, sliceSize)
      var letterVariant = 97
      var lettersIndex = 0
      while (!stopSearchingUsername) {
        candidate = (shortFirstname + shortLastname).toLowerCase()
        if (!this.allUsernames.includes(candidate)) {
          return candidate
        } else {
          shortLastname = shortLastname.slice(0, shortLastname.length - 1) + String.fromCharCode(letterVariant + lettersIndex++)
        }

        if (lettersIndex >= 26) {
          stopSearchingUsername = true
        }
      }

      // Fallback if no unique username can be generated
      // random number between 100 and 999
      return Math.floor((Math.random() * 899) + 100)
    },
    genUsernameLabel: function () {
      const un = this.username
      const ln = this.lastName

      return (un == null || un.length === 0) && ln && ln.length > 1
        ? this.$vuetify.t(
          '$vuetify.AdminUsers.formLoginSuggestion',
          this.genUsername()
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
    resetCSVForm: function () {
      this.csvUsers = null
      this.csvErrors = []
    },
    closeCSVDialog: function () {
      this.csvDialog = false
      this.resetCSVForm()
      this.cancel()
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
    handleFileSelected: function (selection) {
      this.resetCSVForm()
      Papa.parse(selection, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            results.errors.map(error =>
              this.csvErrors.push(
                `Es gab einen Fehler beim Lesen der Tabelle: ${error.message}`
              )
            )
          }

          const headersComplete = ['Vorname', 'Nachname']
            .every(field => results.meta.fields.includes(field))

          if (!headersComplete) {
            this.csvErrors.push(this.$vuetify.t(
              '$vuetify.AdminUsers.csvFormatError'
            ))
            return
          }

          const entryHasNames = entry =>
            entry['Vorname'].length > 0 &&
              entry['Nachname'].length > 0

          if (!results.data.every(entryHasNames)) {
            this.csvErrors.push(
              'Einträge konnten z.T. nicht geladen werden, da Vor- oder Nachname fehlen.')
          }

          this.csvUsers = results.data
            .filter(entryHasNames)
            .map(entry => ({
              first_name: entry['Vorname'],
              last_name: entry['Nachname'],
              email: entry['Email'],
              username: this.genUsername(entry['Vorname'], entry['Nachname'])
            }))
        },
        error: (err) => {
          this.showSnackbar = true
          this.snackbarMsg = 'Es gab einen Fehler beim Laden der CSV-Datei.' + err.message
        }
      })
    },
    saveCSV: function () {
      if (this.csvUsers.length === 0) {
        this.snackbarMsg = 'Bitte lade erst eine Tabelle mit Schülern'
        this.showSnackbar = true
        return
      }

      const rolesRequiringIdeaSpace = ['student', 'class_guest', 'moderator']
      if (rolesRequiringIdeaSpace.includes(this.usergroup) && this.ideaSpace == null) {
        this.errors.add({
          field: 'ideaSpace',
          msg: this.$vuetify.t(
            '$vuetify.AdminUsers.formRoleRequiresSpace',
            this.usergroup
          )
        })
        return
      }

      const usersWithRoles = this.csvUsers.map(user =>
        Object.assign({}, user, {
          user_group: this.usergroup,
          idea_space: this.ideaSpace
        })
      )

      this.isLoading = true
      Promise.all(usersWithRoles.map(api.user.create))
        .then((responses) => {
          this.isLoading = false
          const success = responses.every(res => res.status < 400)

          if (success) {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t(
              '$vuetify.AdminUsers.snackbarCreated', responses.length)
            this.closeCSVDialog()
            this.handleSuccess()
          } else {
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t(
              '$vuetify.Snackbar.serverError')
          }
        })
        .catch(() => {
          this.showSnackbar = true
          this.snackbarMsg = this.$vuetify.t(
            '$vuetify.Snackbar.clientError')
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
            : this.genUsername()

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
                  ? this.$vuetify.t('$vuetify.AdminUsers.snackbarCreated', 1)
                  : this.$vuetify.t('$vuetify.AdminUsers.snackbarSaved')
                this.handleSuccess()
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
.editor-title {
  justify-content: space-between;
}
.csv-button {
  display: inline;
  padding-right: 0;
}
</style>
