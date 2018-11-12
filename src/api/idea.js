import service from '@/api/service'

function getIdea (ideaId) {
  const params = {
    id: 'eq.' + ideaId,
    select: 'id,title,description,created_by(id,first_name),created_at,category(id,name),topic(id,title,phase)'
  }

  return service.get('/idea', { params })
}

function getVotes (ideaId) {
  const params = {
    idea: 'eq.' + ideaId,
    val: 'eq.yes'
  }
  return service.get('/idea_vote', { params })
}

function getComments (ideaId) {
  const params = {
    parent_idea: 'eq.' + ideaId,
    select: 'id,created_by(id,first_name),created_at,text,parent_comment(id)'
  }
  return service.get('/comment', { params })
}

export default {
  getIdea,
  getVotes,
  getComments
}
