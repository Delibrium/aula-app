import service from '@/api/service'

export function get (topicId) {
  const params = {
    id: `eq.${topicId}`,
    select: '*,' +
     'created_by(id,first_name,last_name)'
  }
  return service.get('/topic', { params })
}

export function getIdeas (topicId) {
  const params = {
    topic: `eq.${topicId}`,
    select: '*,' +
      'created_by(id,first_name,last_name),' +
      'comment(count),' +
      'idea_vote(created_by),' +
      'feasible(val)'
  }
  return service.get('/idea', { params })
}

export function create (topic, ideaIds) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/topic', topic, config)
}

export function assignIdeas (topicId, ideaIds) {
  if (ideaIds.length === 0) return Promise.resolve()

  // Makes a selector like `id.eq1,id.eq2,id.eq3` for horizontal filtering
  const ideaSelector = ideaIds.reduce(
    (acc, cur, i) => acc + `${i === 0 ? '' : ','}${cur}`,
    ''
  )

  return service({
    method: 'patch',
    url: '/idea',
    data: { topic: topicId },
    params: {
      id: 'in.(' + ideaSelector + ')'
    }
  })
}

export function getTopics (schoolId, ideaSpaceId) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    idea_space: `eq.${ideaSpaceId}`
  }
  return service.get('/topic', { params: queryParams })
}
