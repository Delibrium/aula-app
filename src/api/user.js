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

function getListing (schoolId) {
  return service.post('/rpc/user_listing')
}

export default {
  get,
  getListing
}
