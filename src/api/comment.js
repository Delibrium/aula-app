import service from '@/api/service'

function get (ideaId) {
  const params = {
    parent_idea: 'eq.' + ideaId,
    select: 'id,created_by(id,first_name,picture),changed_by(id,first_name),created_at,changed_at,text,parent_comment,is_deleted,votes:comment_vote(created_by,val)'
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

function remove (commentId) {
  // "Deletes" comments by setting their text field to an empty string
  // and setting the `is_deleted` flag
  const comment = {
    text: '',
    is_deleted: true
  }
  const params = {
    id: `eq.${commentId}`
  }
  return service.patch('/comment', comment, { params })
}

function postVote (vote) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }

  return service.post('/comment_vote', vote, config)
}

function patchVote (vote) {
  const params = {
    comment: `eq.${vote.comment}`
  }
  return service.patch('/comment_vote', vote, { params })
}

function deleteVote (userId, commentId) {
  const params = {
    created_by: `eq.${userId}`,
    comment: `eq.${commentId}`
  }
  return service.delete('/comment_vote', { params })
}

export default {
  get,
  create,
  patch,
  remove,
  postVote,
  patchVote,
  deleteVote
}
