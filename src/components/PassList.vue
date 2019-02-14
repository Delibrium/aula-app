<template>
  <v-container grid-list-md class='page-container'>
    <v-layout class="no-print">
      <v-flex sm12 my-5 pa-3 d-block elevation-9>
        <h1>{{ $vuetify.t('$vuetify.AdminPassList.title') }}</h1>

        <v-autocomplete
          name="group"
          prepend-icon="group"
          :loading="isLoading"
          :items="filterOptions"
          :label="$vuetify.t('$vuetify.AdminPassList.selectLabel')"
          v-model="selectedGroup"
        ></v-autocomplete>
        <v-btn
        :disabled="isLoading"
          color="primary"
          @click="printPage"
        >{{ $vuetify.t('$vuetify.AdminPassList.buttonPrint') }}</v-btn>
        <v-btn to="/admin">{{ $vuetify.t('$vuetify.AdminPassList.buttonBack') }}</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="print">
      <v-flex v-for="(user, i) in filteredUsers" :key="user.login" class="user-card">
        <v-card tile flat>
          <v-card-text>
            <table>
              <tr>
                <td>
                  <h2>{{ user.first_name }} {{ user.last_name }}</h2>
                  <ul>
                    <li>
                      <strong>{{ $vuetify.t('$vuetify.AdminPassList.labelUsername') }}:</strong>
                      <span class="monospace">{{ user.login }}</span>
                    </li>
                    <li v-if="user.config.temp_password == null">
                      <em>{{ $vuetify.t('$vuetify.AdminPassList.labelNoPassword') }}</em>
                    </li>
                    <li v-else>
                      <strong>{{ $vuetify.t('$vuetify.AdminPassList.labelPassword') }}:</strong>
                      <span class="monospace">{{ user.config.temp_password }}</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '@/api'

export default {
  name: 'PasswordList',
  data: function () {
    return {
      isLoading: true,
      users: [],
      groups: [],
      selectedGroup: null
    }
  },

  beforeMount: function () {
    this.getUsers()
    this.getGroups()
  },

  computed: {
    filteredUsers: function () {
      if (this.selectedGroup == null) {
        return this.users
      } else {
        const selectedGroupNumber = parseInt(this.selectedGroup, 10)
        return this.users
          .filter(user => user.groups
            .filter(
              group => parseInt(group[1], 10) === selectedGroupNumber)
            .length > 0)
      }
    },
    filterOptions: function () {
      const options = this.groups
      options.push({
        text: 'Alle Benutzer',
        value: null
      })
      return options
    }
  },

  methods: {
    printPage: function () {
      window.print()
    },
    getGroups: function () {
      api.ideaSpace.getIdeaSpaces(this.$store.getters.selected_school)
        .then(res => {
          this.groups = res.data.map(group => ({
            text: group.title,
            value: group.id
          }))
        })
    },
    getUsers: function () {
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

      var schoolId = null
      if (this.$store.getters.selected_school) {
        schoolId = this.$store.getters.selected_school
      }
      api.user.getListing(schoolId)
        .then((res) => {
          this.users = res.data
            .map(parseConfig)
            .map(parseGroups)
            .map(checkTempPassword)
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="scss">
ul {
  list-style-type: none;
}
.page-container {
  max-width: 960px;
}
.monospace {
  font-family: "Lucida Console", Monaco, monospace;
}
  .user-card {
    width: 50%;
    height: 9em;
    page-break-inside: avoid;
    position: relative;
    display: block;
    border: 1px dashed #999;
  }
@media print {
  .v-toolbar,
  .no-print {
    display: none;
  }
  body {
    overflow: visible !important;
  }
  .print {
    overflow: visible !important;
    height: 100% !important;
    position: relative !important;
  }
  * {
     overflow: visible !important;
  }
  .v-content,
  .container {
    padding: 0 !important;
  }
  .v-card-text {
    page-break-inside: avoid !important;
    position: relative;
  }
}
</style>

