<template>
   <v-menu bottom right>
     <v-btn v-if="$auth.check()"
       slot="activator"
       flat
       class="menu"
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
         {{ $vuetify.t('$vuetify.Menu.settings') }}
       </router-link>
        <router-link v-if="($auth.user().role) && ($auth.user().role.indexOf('admin') >= 0 || $auth.user().role.indexOf('school_admin') >= 0)" tag="v-list-tile" to="/admin">{{ $vuetify.t('$vuetify.Menu.administration') }}</router-link>
        <router-link v-if="($auth.user().role) && (!link.url.startsWith('http'))" tag="v-list-tile" v-for="(link,index) of menuLinks" :key="index" :to="link.url">{{ link.name }}</router-link>
        <div v-else>
        <a class="v-list__tile v-list__tile--link theme--light" :href="link.url" target="_blank">{{link.name}}</a>
        </div>
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
    },

    computed: {
      menuLinks: function () {
        if (this.$store.getters.schoolConfig.links) {
          return this.$store.getters.schoolConfig.links.sort((i1, i2) => (i1.position <= i2.position) ? -1 : 1)
        } else {
          return []
        }
      }
    },

    methods: {
      logout: function () {
        this.$auth.logout({ redirect: '/login' })
      }
    }
  }
</script>

<style scoped scss>
.menu {
   min-width: 0;
}
</style>
