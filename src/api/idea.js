import service from '@/api/service'

function getIdea (ideaId) {
  const params = {
    id: 'eq.' + ideaId,
    select: 'id,title,description,idea_space,created_by(id,first_name),created_at,category(id,name),topic(id,title,phase)'
  }
  return service.get('/idea', { params })
}

function getVotes (ideaId) {
  const params = {
    idea: 'eq.' + ideaId
  }
  return service.get('/idea_vote', { params })
}

function deleteVote (userId, ideaId) {
  const params = {
    created_by: `eq.${userId}`,
    idea: `eq.${ideaId}`
  }
  return service.delete('/idea_vote', { params })
}

function postVote (vote) {
  return service.post('/idea_vote', vote)
}

function patchVote (vote) {
  const params = {
    idea: `eq.${vote.idea}`
  }
  return service.patch('/idea_vote', vote, { params })
}

function getComments (ideaId) {
  const params = {
    parent_idea: 'eq.' + ideaId,
    select: 'id,created_by(id,first_name),created_at,text,parent_comment(id)'
  }
  return service.get('/comment', { params })
}

function getQuorumInfo (schoolId, ideaSpaceId) {
  // Return quorum info for a space (or the school if param ideaSpaceId is not set)
  // Returns a dict with fields classQuorum, schoolQuorum, voteCount, totalVoters
  const body = {
    school_id: schoolId,
    space_id: ideaSpaceId
  }
  return service.post('/rpc/quorum_info', body)
}

export default {
  getIdea,
  getVotes,
  postVote,
  patchVote,
  deleteVote,
  getComments,
  getQuorumInfo
}
