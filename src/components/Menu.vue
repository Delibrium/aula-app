<template>
   <v-menu bottom right>
     <v-btn
       slot="activator"
       class="light-green"
     >
     <v-icon>more_vert</v-icon>
       User
     </v-btn>

     <v-list>
       <v-list-tile>
         Profile anzeigen
       </v-list-tile>
       <v-list-tile>
         Einstellungen
       </v-list-tile>
       <v-list-tile v-if="$auth.user().role.indexOf('admin') >= 0 || $auth.user().role.indexOf('school_admin') >= 0">
         <router-link to="/admin">Prozessverwaltung</router-link>
       </v-list-tile>
        <v-list-tile @click="logout">
          Logout
       </v-list-tile>
     </v-list>
   </v-menu>
</template>

<script>
  export default {
    name: 'Menu',
    data: () => ({
    }),

    props: {
    },

    mounted: function () {
      console.log(this.$auth.user().role)
    },

    methods: {
      logout: function () {
        this.$auth.logout({ redirect: '/login' })
      }
    }
  }
</script>
