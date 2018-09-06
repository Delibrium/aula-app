const user = {
  state: {
    user: {},
    roles: []
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
  }
}

export default user
