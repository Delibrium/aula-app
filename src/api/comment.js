import service from '@/api/service'

function get (ideaId) {
  const params = {
    parent_idea: 'eq.' + ideaId,
    select: 'id,created_by(id,first_name),created_at,text,parent_comment'
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

function patch (comment) {
  const params = {
    id: `eq.${comment.id}`
  }
  return service.patch('/comment', comment, { params })
}

export default {
  get,
  create,
  patch
}
