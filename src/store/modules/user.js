const user = {
  state: {
    profile: {},
    locale: 'de'
  },

  mutations: {
    SET_USER: (state, user) => {
      state.profile = user
    },
    SET_LOCALE: (state, locale) => {
      state.locale = locale
    }
  },

  actions: {
  }
}

export default user
