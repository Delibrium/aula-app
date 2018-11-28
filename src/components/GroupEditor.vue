<template>
  <v-card class='card'>
    <v-card-title>
      <h3>Benutzergruppen</h3>
    </v-card-title>
    <v-card-text>
      <v-list two-line>
        <v-list-tile v-for="group in usergroups">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ $vuetify.t('$vuetify.roles.' + group.group_id) }}
            </v-list-tile-title>
            <v-list-tile-sub-title v-if="group.idea_space != null">
              {{ group.idea_space.title }}
            </v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn icon ripple @click="() => remove(group.group_id)">
              <v-icon color="grey lighten-1">delete</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-select
            name='usergroup'
            v-model="form.usergroup"
            v-validate="'required'"
            :error-messages="errors.collect('usergroup')"
            :items="groups"
            :label="this.$vuetify.t('$vuetify.AdminUsers.formGroup')"
            required
          ></v-select>
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            name='ideaSpace'
            v-model="form.ideaSpace"
            v-validate=""
            :error-messages="errors.collect('ideaSpace')"
            :items="ideaSpaces"
            :label="this.$vuetify.t('$vuetify.AdminUsers.formIdeaSpace')"
          ></v-select>
        </v-flex>
        <v-flex class='text-xs-right'>
          <v-btn @click="addGroup">Rolle hinzufügen</v-btn>
        </v-flex>
      </v-layout>
    </v-card-text>
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

const rolesRequiringIdeaSpace = ['student', 'class_guest', 'moderator']

export default {
  $_veeValidate: { validator: 'new' },

  name: 'GroupEditor',
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

    return {
      groups: defaultGroups,
      ideaSpaces: [],
      usergroups: [],
      form: {
        usergroup: defaultGroups[0].value,
        ideaSpace: null
      },
      showSnackbar: false,
      snackbarMsg: ''
    }
  },

  beforeMount: function () {
    if (this.user == null) throw Error('GroupEditor requires a user prop')
    this.getGroups()
    this.getIdeaSpaces()
  },

  computed: {
    schoolId: function () { return this.$store.getters.selected_school }
  },

  props: ['handleSuccess', 'user'],

  watch: {
    user: function (next, prev) {
      if (next != null) {
        this.getGroups()
      }
    }
  },

  methods: {
    getGroups: function () {
      api.user.getGroups(this.user.id).then((res) => {
        this.usergroups = res.data
      })
    },
    getIdeaSpaces: function () {
      api.ideaSpace.getIdeaSpaces(this.schoolId).then((res) => {
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
    remove: function (groupName) {
      api.user.removeGroup(this.user.id, groupName)
        .then((res) => {
          this.showSnackbar = true
          this.snackbarMsg = this.$vuetify.t(
            '$vuetify.AdminUsers.snackbarRoleAdded')
          this.getGroups()
        })
    },
    addGroup: function () {
      this.$validator.validate()
        .then(isFormValid => {
          if (rolesRequiringIdeaSpace.indexOf(this.form.usergroup) >= 0) {
            this.errors.add({
              field: 'ideaSpace',
              msg: this.$vuetify.t(
                '$vuetify.AdminUsers.formRoleRequiresSpace',
                this.form.usergroup
              )
            })
            return
          }

          const group = {
            school_id: this.schoolId,
            user_id: this.user.id,
            group_id: this.form.usergroup,
            idea_space: this.form.ideaSpace || null
          }

          api.user.addGroup(group)
            .then((res) => {
              if (res.status < 400) {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.AdminUsers.snackbarSaved')
                this.getGroups()
                this.handleSuccess(res.data)
              } else {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.Snackbar.serverError')
                this.getGroups()
              }
            })
            .catch((err) => {
              // 23505 is the Postgrest error code for violations of
              // unique constraints
              if (err.response && err.response.data.code === '23505') {
                this.showSnackbar = true
                this.snackbarMsg = this.$vuetify.t(
                  '$vuetify.AdminUsers.snackbarDuplicateGroup')
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
