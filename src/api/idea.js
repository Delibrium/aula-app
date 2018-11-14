import service from '@/api/service'

function getIdea (ideaId) {
  const params = {
    id: 'eq.' + ideaId,
    select: 'id,title,description,idea_space,created_by(id,first_name),created_at,category(id,name),topic(id,title,phase)'
  }
  return service.get('/idea', { params })
}

function getVotes (ideaId) {
  // Return all yes-votes
  const params = {
    idea: 'eq.' + ideaId,
    val: 'eq.yes'
  }
  return service.get('/idea_vote', { params })
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
  getQuorumInfo
}
