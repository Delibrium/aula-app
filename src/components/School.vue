<template>
  <v-container fluid grid-list-md>
    <v-slide-y-transition mode="out-in">
      <v-layout column wrap>
        <v-flex d-flex xs12 sm4 pa-2>
          <v-data-table
            :headers="headers"
            :items="schools"
            class="elevation-1"
          >
          <template slot="items" slot-scope="props">
            <td  :class="{'green lighten-3': $store.getters.selected_school === props.item.id}" @click="selectSchool(props.item)">{{ props.item.name }}</td>
          </template>
          </v-data-table>
        </v-flex>

        <v-flex d-flex xs12 sm4 pa-2>
          <v-card class="elevation-1">
            <v-card-text>
                <v-text-field
                  name="description"
                  v-model="schoolConfig.mainSpaceName"
                  v-validate="'required'"
                 :label="this.$vuetify.t('$vuetify.AdminCommunity.mainSpaceName')"
                  required
                ></v-text-field>

                <v-btn
                  @click="openEditPage('terms')"
                >{{ $vuetify.t('$vuetify.AdminCommunity.termsEdit') }}</v-btn>

                <v-btn
                  @click="openEditPage('impressum')"
                >{{ $vuetify.t('$vuetify.AdminCommunity.impressumEdit') }}</v-btn>

                <v-btn
                  @click="updateSchool"
                >{{ $vuetify.t('$vuetify.Form.save') }}</v-btn>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-dialog v-model="editPage" v-if="canEditMainPages && pageName !== ''">
          <PageEditor :pageName="pageName" @close-page-editor="editPage = false"/>
        </v-dialog>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import api from '@/api'
import { isUserMemberOf } from '../utils/permissions'
import PageEditor from '@/components/PageEditor'

export default {
  name: 'School',
  components: { PageEditor },
  data: function () {
    return {
      schools: [],
      schoolConfig: this.$store.getters.schoolConfig,
      editPage: false,
      pageName: '',
      headers: [
        {
          text: this.$vuetify.t('$vuetify.AdminCommunity.tableHeaderName'),
          align: 'left',
          sortable: true,
          value: 'schoolName'
        }]
    }
  },

  props: {
  },

  computed: {
    canEditMainPages: function () {
      return isUserMemberOf(['admin'])
    }
  },

  methods: {
    submit: function () {
    },

    openEditPage: function (pageName) {
      this.pageName = pageName
      this.editPage = true
    },

    selectSchool: function (school) {
      this.$store.commit('SET_SELECTED_SCHOOL', school.id)
      this.$store.commit('SET_SCHOOL_NAME', school.name)
      api.school.getConfig(school.id).then((res) => {
        this.$store.commit('SET_SCHOOL_CONFIG', res.data)
        this.$emit('selectedSchool')
      })
    },

    updateSchool: function () {
      api.school.updateConfig(this.$store.getters.school_id, 'mainSpaceName', this.schoolConfig.mainSpaceName)
    }
  },

  beforeMount: function () {
    api.school.get().then((res) => {
      this.schools = res.data
    })
  }
}
</script>
