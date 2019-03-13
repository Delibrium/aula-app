const school = {
  state: {
    selectedSchool: -1,
    schoolConfig: {},
    phases: ['edit_topics', 'feasibility', 'vote', 'finished'],
    name: ''
  },

  mutations: {
    SET_SELECTED_SCHOOL: (state, schoolId) => {
      state.selectedSchool = schoolId
    },
    SET_SCHOOL_CONFIG: (state, schoolConfig) => {
      state.schoolConfig = schoolConfig
    },
    SET_SCHOOL_NAME: (state, schoolName) => {
      state.name = schoolName
    },
    UPDATE_SCHOOL_CONFIG_KEY: (state, {key, value}) => {
      state.schoolConfig[key] = value
    }

  },

  actions: {
  }
}

export default school
