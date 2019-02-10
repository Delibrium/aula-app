<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout wrap align-center justify-center>
        <v-flex d-flex md10 xs12 sm12 pa-2 align-content-center justify-center>
          <v-card>
            <v-card-text>
              <v-layout row wrap align-center>
                <v-flex d-flex xs12 sm12 pa-2>

                  <v-expansion-panel v-model="openPanel">

                    <v-expansion-panel-content v-if="$auth.user().role.indexOf('admin') >= 0">
                      <div slot="header">{{ $vuetify.t('$vuetify.AdminCommunity.community') }}<span v-if="hasSelectedSchool">: {{ $store.getters.schoolName }}</span></div>
                      <School></School>
                    </v-expansion-panel-content>

                  <!-- Pages -->
                    <v-expansion-panel-content :disabled="!hasSelectedSchool">
                      <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.pages')}}</div>
                      <PagesAdmin></PagesAdmin>
                    </v-expansion-panel-content>

                  <!-- Idea Spaces -->
                    <v-expansion-panel-content :disabled="!hasSelectedSchool">
                      <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.ideaSpace')}}</div>
                      <IdeaSpaceAdmin></IdeaSpaceAdmin>
                    </v-expansion-panel-content>

                  <!-- Phase duration -->
                    <v-expansion-panel-content :disabled="!hasSelectedSchool">
                      <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.phaseDuration')}}</div>
                      <Phase></Phase>
                    </v-expansion-panel-content>

                    <v-expansion-panel-content :disabled="!hasSelectedSchool">
                      <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.categories')}}</div>
                      <Categories></Categories>
                    </v-expansion-panel-content>

                  <!-- Quorum -->
                    <v-expansion-panel-content :disabled="!hasSelectedSchool">
                      <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.quorum')}}</div>
                      <Quorum></Quorum>
                    </v-expansion-panel-content>

                  <!-- Vacation mode -->
                    <v-expansion-panel-content :disabled="!hasSelectedSchool">
                      <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.holidays')}}</div>
                      <Vacation></Vacation>
                    </v-expansion-panel-content>

                  <!-- User and Groups -->
                    <v-expansion-panel-content :disabled="!hasSelectedSchool">
                      <div slot="header">{{ $vuetify.t('$vuetify.AdminMenu.users')}}</div>
                      <GroupsUsers></GroupsUsers>
                    </v-expansion-panel-content>

                  </v-expansion-panel>

                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import IdeaSpaceAdmin from '@/components/IdeaSpaceAdmin'
import PagesAdmin from '@/components/PagesAdmin'
import Phase from '@/components/Phase'
import Quorum from '@/components/Quorum'
import Categories from '@/components/Categories'
import Vacation from '@/components/Vacation'
import School from '@/components/School'
import GroupsUsers from '@/components/GroupsUsers'

export default {
  name: 'Admin',
  components: {
    IdeaSpaceAdmin,
    PagesAdmin,
    Phase,
    Quorum,
    Categories,
    Vacation,
    GroupsUsers,
    School
  },
  data: function () {
    return {
      openPanel: null
    }
  },

  computed: {
    hasSelectedSchool: function () { return this.$store.getters.selected_school >= 0 }
  },

  props: {
  },

  methods: {
  }
}
</script>
