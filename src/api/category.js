import service from '@/api/service'

function get (schoolId) {
  const params = {
    school_id: `eq.${schoolId}`,
    order: 'name,id'
  }
  return service.get('/category', { params })
}

function create (category) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/category', category, config)
}

function update (category) {
  return service({
    method: 'patch',
    url: '/category',
    data: category,
    params: {
      id: `eq.${category.id}`
    },
    headers: {
      PREFER: 'return=representation'
    }
  })
}

function remove (categoryId) {
  const params = {
    id: `eq.${categoryId}`
  }
  return service.delete('/category', { params })
}

export default {
  get,
  create,
  update,
  remove
}
