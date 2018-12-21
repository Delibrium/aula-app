<template>
  <v-flex md10 xs12 offset-md1 mb-5 color="primary" class="tab-nav">
    <v-card dark :color="active == 0 ? 'primary' : 'gray'" width="50%" style="float: left" height="100%">
      <router-link
        :to="{ name: 'Ideas', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}"
      >
        <v-card-text
          class="text-md-center text-xs-center"
        >{{ $vuetify.t('$vuetify.Space.wildIdeas') }}</v-card-text>
      </router-link>
    </v-card>
    <v-card dark :color="active == 1 ? 'primary' : 'gray'" width="50%" style="float: left" height="100%">
      <router-link
        :to="{ name: 'Topics', params: {spaceSlug:$route.params['spaceSlug'], spaceId: spaceId}}"
      >
        <v-card-text
          class="text-md-center text-xs-center"
        >{{ $vuetify.t('$vuetify.Space.ideaTopics') }}</v-card-text>
      </router-link>
    </v-card>
  </v-flex>
</template>

<script>
export default {
  name: 'NavigationTabs',
  props: [ 'spaceId', 'active' ]
}
</script>

<style scoped lang="scss">
  .tab-nav {
    margin-bottom: 2em;
  }

  .tab-nav a {
    font-size: 1.4em;
    color: white;
    text-decoration: none;
  }
</style>
