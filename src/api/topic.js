import service from '@/api/service'

export function get (topicId) {
  const params = {
    id: `eq.${topicId}`,
    select: '*,' +
     'created_by(id,first_name,last_name),idea_space(id,title)'
  }
  return service.get('/topic', { params })
}

export function getIdeas (topicId) {
  const params = {
    topic: `eq.${topicId}`,
    select: '*,' +
      'created_by(id,first_name,last_name),' +
      'category(name, image),' +
      'comment(created_at),' +
      'idea_vote(created_by,val),' +
      'idea_like(created_by),' +
      'feasible(val)'
  }
  return service.get('/idea', { params })
}

export function getDelegate (topicId, userId) {
  const params = {
    context_topic: `eq.${topicId}`,
    from_user: `eq.${userId}`
  }
  return service.get('/delegation', { params })
}

export function createDelegate (schoolId, topicId, fromId, toId) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }

  const delegation = {
    created_by: fromId,
    context_topic: topicId,
    school_id: schoolId,
    from_user: fromId,
    to_user: toId
  }

  return service.post('/delegation', delegation, config)
}

export function updateDelegate (topicId, fromId, toId) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    },
    params: {
      context_topic: `eq.${topicId}`,
      from_user: `eq.${fromId}`
    }
  }

  const delegation = {
    to_user: toId
  }

  return service.patch('/delegation', delegation, config)
}

export function getIdeasCount (topicId) {
  const params = {
    topic: `eq.${topicId}`,
    select: 'count'
  }
  return service.get('/idea', { params })
}

export function createOrUpdate (topic, ideaIds) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  if (topic.id == null) {
    return service.post('/topic', topic, config)
  } else {
    config.params = {
      id: `eq.${topic.id}`
    }
    return service.patch('/topic', topic, config)
  }
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

export function deleteTopic (schoolId, topicId) {
  const params = {
    school_id: `eq.${schoolId}`,
    id: `eq.${topicId}`
  }
  return service.delete('/topic', { params })
}

export function getTopics (schoolId, ideaSpaceId = null) {
  var queryParams = {
    school_id: `eq.${schoolId}`
  }
  if (ideaSpaceId === null) {
    queryParams['idea_space'] = `is.null`
  } else {
    queryParams['idea_space'] = `eq.${ideaSpaceId}`
  }
  return service.get('/topic', { params: queryParams })
}

export function setPhase (topic, phase) {
  return service.post('/rpc/change_phase', { topic, phase })
}
