<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap align-center>
        <v-flex d-flex xs12 sm12 pa-2>

          <!-- Phase duration -->
          <v-expansion-panel>
            <v-expansion-panel-content>
              <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.phaseDuration')}}</div>
              <Phase></Phase>
            </v-expansion-panel-content>

          <!-- Quorum -->
            <v-expansion-panel-content>
              <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.quorum')}}</div>
              <Quorum></Quorum>
            </v-expansion-panel-content>

          <!-- Vacation mode -->
            <v-expansion-panel-content>
              <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.holidays')}}</div>
              <Vacation></Vacation>
            </v-expansion-panel-content>

          <!-- User and Groups -->
            <v-expansion-panel-content>
              <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.users')}}</div>
              <GroupsUsers></GroupsUsers>
            </v-expansion-panel-content>

          </v-expansion-panel>

        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import Phase from '@/components/Phase'
import Quorum from '@/components/Quorum'
import Vacation from '@/components/Vacation'
import GroupsUsers from '@/components/GroupsUsers'

export default {
  name: 'Admin',
  components: {
    Phase,
    Quorum,
    Vacation,
    GroupsUsers
  },
  data: () => ({
  }),

  props: {
  },

  methods: {
  }
}
</script>
