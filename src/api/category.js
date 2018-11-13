import service from '@/api/service'

function get (schoolId) {
  const params = {
    school_id: `eq.${schoolId}`
  }
  return service.get('/category', params)
}

export function create (category) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/category', category, config)
}

export default {
  get,
  create
}
