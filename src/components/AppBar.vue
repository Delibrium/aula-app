<template>
  <v-toolbar md10 fixed app class="white">
      <router-link to="/">
        <v-img class="header_logo" src="./static/img/Aula_Logo.svg" height="40" :contain="true"/>
      </router-link>
      <v-spacer></v-spacer>
      <LanguageMenu></LanguageMenu>
      <Menu v-if="$auth.ready()"></Menu>
    </v-toolbar>
</template>

<script>
import Menu from '@/components/Menu'
import LanguageMenu from '@/components/LanguageMenu'

export default {
  components: { Menu, LanguageMenu }
}
</script>

<style scoped lang="scss">

.v-toolbar {
  box-shadow: none;
}

</style>

