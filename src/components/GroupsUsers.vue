<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-card>
        <v-card-text>
          <v-toolbar>
            <v-toolbar-title>{{ users.length }} Benutzer</v-toolbar-title>
            <v-btn to="/admin/password-printout">
              <v-icon left>print</v-icon> Passwortliste
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              :label="$vuetify.t('$vuetify.AdminUsers.searchLabel')"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>

          <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
            :loading="isLoading"
            class="elevation-1"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.login }}</td>
              <td>{{ props.item.first_name }}</td>
              <td>{{ props.item.last_name }}</td>
              <td>
                <ul v-if="props.item.groups.length > 1">
                  <li v-for="group in props.item.groups">
                    {{ $vuetify.t(
                    '$vuetify.rolesCompound.' + group[0],
                    group[2])
                    }}
                  </li>
                </ul>
                <span v-else-if="props.item.groups.length === 1">
                  {{ $vuetify.t(
                  '$vuetify.rolesCompound.' + props.item.groups[0][0],
                  props.item.groups[0][2])
                  }}
                </span>
                <span v-else>{{ $vuetify.t('$vuetify.rolesCompound.noRoles') }}</span>
              </td>
              <td>
                {{ $vuetify.t('$vuetify.AdminUsers.columnHasSetPassword-' +
                props.item.hasSetPassword) }}
              </td>
              <td>
                <v-icon small class="mr-2" @click="() => edit(props.item.id)">edit</v-icon>
                <v-icon small @click="() => remove(props.item.id)">delete</v-icon>
              </td>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="info"
              icon="warning"
            >{{ $vuetify.t('$vuetify.AdminUsers.searchNoResults', search) }}</v-alert>

            <v-card v-if="toDelete != null" slot="footer">
              <v-card-title>
                <h3>{{ $vuetify.t('$vuetify.AdminUsers.deleteHeader') }}</h3>
              </v-card-title>
              <v-card-text>
                <p>
                  {{
                  $vuetify.t(
                  '$vuetify.AdminUsers.deleteText',
                  getUserById(this.toDelete).login
                  )
                  }}
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  @click="deleteUser"
                  color="error"
                >{{ $vuetify.t('$vuetify.AdminUsers.deleteConfirm') }}</v-btn>
                <v-btn @click="reset">{{ $vuetify.t('$vuetify.AdminUsers.deleteCancel') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-data-table>

          <v-layout row wrap mt-3>
            <v-flex xs12 sm6>
              <GroupsUsersEdit
                :user="toEdit"
                :users="users"
                :handleCancel="reset"
                :handleSuccess="handleNewUser"
              />
            </v-flex>
            <v-flex xs12 sm6>
              <GroupEditor
                v-if="toEdit != null"
                :user="toEdit"
                :handleSuccess="handleGroupsUpdated"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-slide-y-transition>

    <v-snackbar v-model="showSnackbar" :bottom="true">
      {{ snackbarMsg }}
      <v-btn
        color="pink"
        flat
        @click="showSnackbar = false"
      >{{ $vuetify.t('$vuetify.Snackbar.close') }}</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from '@/api'
import GroupsUsersEdit from '@/components/GroupsUsersEdit'
import GroupEditor from '@/components/GroupEditor'

export default {
  name: 'GroupsUsers',
  components: {
    GroupsUsersEdit,
    GroupEditor
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
      isLoading: true,
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
      this.isLoading = true

      const parseConfig = entry => Object.assign({}, entry, {
        config: JSON.parse(entry.config)
      })

      // Groups are returned from Postgrest as a composite value, which means
      // they're strings that need to be unpacked
      const parseGroups = entry => Object.assign({}, entry, {
        groups: entry.groups[0] === '(,,)' // Postgres return value for 'no groups'
          ? []
          : entry.groups.map(val => {
            // Remove outer parantheses and split into
            // group_name, space_id, space_name
            let rv = val.slice(1, -1).split(',')

            // If space name exists, remove quotes
            if (rv.length === 3) {
              rv[2] = rv[2].slice(1, -1)
            }
            return rv
          })
      })

      // Insert a boolean field that indicates whether the config field
      // contains a temporary password
      const checkTempPassword = entry => Object.assign({}, entry, {
        hasSetPassword: entry.config.temp_password == null
      })

      api.user.getListing()
        .then((res) => {
          this.users = res.data
            .map(parseConfig)
            .map(parseGroups)
            .map(checkTempPassword)
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    handleNewUser: function () {
      this.isLoading = true
      this.reset()
      this.getUsers()
    },
    handleGroupsUpdated: function (data) {
      this.isLoading = true
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
