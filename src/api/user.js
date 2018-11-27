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

function create (user) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/rpc/add_user', user, config)
}

function update (user) {
  return service({
    method: 'patch',
    url: '/users',
    data: user,
    params: {
      id: `eq.${user.id}`
    },
    headers: {
      PREFER: 'return=representation'
    }
  })
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
  create,
  update,
  remove,
  getListing
}
