<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-card>
        <v-card-title>
          <h1>Benutzer und Gruppen</h1>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            :label="$vuetify.t('$vuetify.AdminUsers.searchLabel')"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.login }}</td>
              <td>{{ props.item.first_name }}</td>
              <td>{{ props.item.last_name }}</td>
              <td>{{ $vuetify.t('$vuetify.roles.' + props.item.group_id) }}</td>
              <td>{{ props.item.idea_space_title }}</td>
              <td>{{ $vuetify.t('$vuetify.AdminUsers.columnHasSetPassword-' + props.item.hasSetPassword) }}</td>
              <td>
                <v-icon
                  small
                  class="mr-2"
                  @click="() => edit(props.item.id)"
                >
                  edit
                </v-icon>
                <v-icon
                  small
                  @click="() => remove(props.item.id)"
                >
                  delete
                </v-icon>
              </td>
            </template>
            <v-alert slot="no-results" :value="true" color="info" icon="warning">
              {{ $vuetify.t('$vuetify.AdminUsers.searchNoResults', search) }}
            </v-alert>

            <v-card v-if="toDelete != null" slot="footer">
              <v-card-title>
                <h3>{{ $vuetify.t('$vuetify.AdminUsers.deleteHeader') }}</h3>
              </v-card-title>
              <v-card-text>
                <p>{{
                  $vuetify.t(
                    '$vuetify.AdminUsers.deleteText',
                    getUserById(this.toDelete).login
                  )
                }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="deleteUser" color="error">
                  {{ $vuetify.t('$vuetify.AdminUsers.deleteConfirm') }}
                </v-btn>
                <v-btn @click="reset">
                  {{ $vuetify.t('$vuetify.AdminUsers.deleteCancel') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <GroupsUsersEdit
            :user="toEdit"
            :handleCancel="reset"
            :handleSuccess="handleNewUser"
            slot="footer"
          />
        </v-card-actions>
      </v-card>
    </v-slide-y-transition>

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
  </v-container>
</template>

<script>
import api from '@/api'
import GroupsUsersEdit from '@/components/GroupsUsersEdit'

export default {
  name: 'GroupsUsers',
  components: {
    GroupsUsersEdit
  },
  data: function () {
    return {
      headers: [
        {
          text: this.$vuetify.t('$vuetify.AdminUsers.formLogin'),
          align: 'left',
          sortable: true,
          value: 'login'
        },
        {
          text: this.$vuetify.t('$vuetify.AdminUsers.formFirstName'),
          align: 'left',
          sortable: true,
          value: 'first_name'
        },
        {
          text: this.$vuetify.t('$vuetify.AdminUsers.formLastName'),
          align: 'left',
          sortable: true,
          value: 'last_name'
        },
        {
          text: this.$vuetify.t('$vuetify.AdminUsers.formGroup'),
          align: 'left',
          sortable: true,
          value: 'group_id'
        },
        {
          text: this.$vuetify.t('$vuetify.AdminUsers.formIdeaSpace'),
          align: 'left',
          sortable: true,
          value: 'idea_space'
        },
        {
          text: this.$vuetify.t('$vuetify.AdminUsers.columnHasSetPassword'),
          sortable: true,
          value: 'hasSetPassword'
        },
        {
          text: this.$vuetify.t('$vuetify.AdminUsers.columnActions'),
          align: 'center',
          value: null,
          sortable: false
        }
      ],
      users: [],
      toEdit: null,
      toDelete: null,
      search: '',
      showSnackbar: false,
      snackbarMsg: ''
    }
  },

  beforeMount: function () {
    this.getUsers()
  },

  methods: {
    edit: function (id) {
      this.toEdit = this.getUserById(id)
    },
    remove: function (id) {
      this.toDelete = id
    },
    reset: function () {
      this.toEdit = null
      this.toDelete = null
    },
    getUserById: function (id) {
      return this.users.filter(u => u.id === id).shift()
    },
    getUsers: function () {
      const parseConfig = entry => Object.assign({}, entry, {
        config: JSON.parse(entry.config)
      })
      const checkTempPassword = entry => Object.assign({}, entry, {
        hasSetPassword: entry.config.temp_password == null
      })

      api.user.getListing().then((res) => {
        this.users = res.data
          .map(parseConfig)
          .map(checkTempPassword)
      })
    },
    handleNewUser: function (data) {
      this.reset()
      this.getUsers()
    },
    deleteUser: function () {
      api.user.remove(this.toDelete)
        .then(res => {
          if (res.status < 400) {
            this.reset()
            this.getUsers()
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t(
              '$vuetify.AdminUsers.snackbarDeleted')
          } else {
            this.reset()
            this.showSnackbar = true
            this.snackbarMsg = this.$vuetify.t(
              '$vuetify.AdminUsers.snackbarDeleteFailed')
          }
        })
    }
  }
}
</script>
