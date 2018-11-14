import service from '@/api/service'

function get (ideaId) {
  const params = {
    parent_idea: 'eq.' + ideaId,
    select: 'id,created_by(id,first_name),created_at,text,parent_comment(id)'
  }
  return service.get('/comment', { params })
}

function create (comment) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/comment', comment, config)
}

export default {
  get,
  create
}
