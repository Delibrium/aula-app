<template>
   <v-menu bottom right>
     <v-btn
       slot="activator"
       flat
       class="menu"
     >
     {{ currentLocaleName }}
     </v-btn>

     <v-list>
        <v-list-tile @click="setLanguage('de')">
          Deutsch
       </v-list-tile>
        <v-list-tile @click="setLanguage('en')">
          English
       </v-list-tile>
     </v-list>
   </v-menu>
</template>

<script>
  export default {
    name: 'LanguageMenu',
    data: function () {
      return {
        languages: [
          {'name': 'De', 'code': 'de'},
          {'name': 'En', 'code': 'en'}
        ]
      }
    },

    props: {
    },

    mounted: function () {
    },

    computed: {
      currentLocaleName: function () {
        var localeName = this.languages.find(l => l.code === this.$store.getters.locale)
        return localeName.name
      }
    },

    methods: {
      setLanguage: function (language) {
        this.$vuetify.lang.current = language
        this.$store.commit('SET_LOCALE', language)
      }
    }
  }
</script>

<style scoped scss>
.menu {
   min-width: 0;
}
</style>
