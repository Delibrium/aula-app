<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-data-table :headers="headers" :items="users" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.login }}</td>
          <td>{{ props.item.first_name }}</td>
          <td>{{ props.item.last_name }}</td>
          <td>{{ props.item.hasSetPassword }}</td>
        </template>
      </v-data-table>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import api from '@/api'

export default {
  name: 'GroupsUsers',

  data: () => ({
    headers: [
      {
        text: 'Benutzername',
        align: 'left',
        sortable: true,
        value: 'login'
      },
      {
        text: 'Vorname',
        align: 'left',
        sortable: true,
        value: 'first_name'
      },
      {
        text: 'Nachname',
        align: 'left',
        sortable: true,
        value: 'last_name'
      },
      {
        text: 'Passwort gesetzt',
        sortable: true,
        value: 'hasSetPassword'
      }
    ],
    users: []
  }),

  beforeMount: function () {
    this.getUsers()
  },

  methods: {
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
    }
  }
}
</script>
