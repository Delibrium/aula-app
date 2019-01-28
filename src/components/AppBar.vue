<template>
  <v-toolbar md10 fixed app class="white">
      <router-link to="/">
        <img class="header_logo" src="../static/img/Aula_Logo.svg"/>
      </router-link>
      <v-spacer></v-spacer>
      <Menu v-if="$auth.ready()"></Menu>
    </v-toolbar>
</template>

<script>
import Menu from '@/components/Menu'

export default {
  components: { Menu }
}
</script>

<style scoped lang="scss">

.v-toolbar {
  box-shadow: none;
}

</style>

