<template>
   <v-menu bottom right>
     <v-btn v-if="$auth.check()"
       slot="activator"
     >
     <v-icon>menu</v-icon>
     </v-btn>

     <v-btn v-else
       slot="activator"
       color="primary"
     >
     <v-icon>perm_identity</v-icon>
       Login
     </v-btn>


     <v-list v-if="$auth.check()">
       <router-link  tag="v-list-tile" :to="`/user/${$store.getters.userId}`">{{ $vuetify.t('$vuetify.Menu.profileView') }}</router-link>
       <router-link  tag="v-list-tile" :to="`/user/settings`">
         Einstellungen
       </router-link>
        <router-link v-if="($auth.user().role) && ($auth.user().role.indexOf('admin') >= 0 || $auth.user().role.indexOf('school_admin') >= 0)" tag="v-list-tile" to="/admin">Prozessverwaltung</router-link>
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
      console.log(this.$auth.user())
    },

    methods: {
      logout: function () {
        this.$auth.logout({ redirect: '/login' })
      }
    }
  }
</script>
