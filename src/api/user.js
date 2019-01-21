import service from '@/api/service'

function get (userId) {
  var params = {
    id: `eq.${userId}`
  }

  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }

  return service.get('/users', { params }, config)
}

function getGroups (userId) {
  const params = {
    user_id: `eq.${userId}`
  }
  const url = '/user_group?select=group_id,idea_space(id,title,description)'
  return service.get(url, { params })
}

function addGroup (group) {
  return service.post('/user_group', group)
}

function removeGroup (userId, groupName) {
  const params = {
    user_id: `eq.${userId}`,
    group_id: `eq.${groupName}`
  }
  return service.delete('/user_group', { params })
}

function create (user) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/rpc/add_user', user, config)
}

function update (user) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/rpc/update_user', user, config)
}

function updateProfilePicture (userId, userPicture) {
  const params = {
    id: `eq.${userId}`
  }
  return service.patch('/users', { picture: userPicture }, { params })
}

function remove (userId) {
  const params = {
    id: `eq.${userId}`
  }
  return service.delete('/users', { params })
}

function getListing (schoolId) {
  return service.post('/rpc/user_listing')
}

export default {
  get,
  addGroup,
  removeGroup,
  getGroups,
  create,
  update,
  remove,
  getListing,
  updateProfilePicture
}
