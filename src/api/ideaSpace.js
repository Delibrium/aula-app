import service from '@/api/service'

export function getIdeaSpaces (schoolId) {
  return service.get('/idea_space', {params: {school_id: `eq.${schoolId}`, order: 'title'}})
}

export function getIdeas (schoolId, ideaSpaceId = null, topic) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    select: '*,' +
      'category(id,name,image),' +
      'created_by(id,username),' +
      'comment(count),' +
        ((topic) ? 'idea_vote(created_by)' : 'idea_vote:idea_like(created_by)')
  }
  if (ideaSpaceId !== null) {
    queryParams['idea_space'] = `eq.${ideaSpaceId}`
  } else {
    queryParams['idea_space'] = `is.null`
  }
  if (!topic) {
    queryParams['topic'] = 'is.null'
  }
  return service.get('/idea', {params: queryParams})
}

export function getIdea (ideaId) {
  var queryParams = {id: `eq.${ideaId}`}
  return service.get('/idea', {params: queryParams})
}

export function getSpace (schoolId, spaceSlug) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    slug: `eq.${spaceSlug}`
  }
  return service.get('/idea_space', {params: queryParams})
}

export function createIdeaSpace (ideaSpace) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/idea_space', ideaSpace, config)
}

export function updateIdeaSpace (ideaSpace) {
  return service({
    method: 'patch',
    url: '/idea_space',
    data: ideaSpace,
    params: {
      id: `eq.${ideaSpace.id}`
    },
    headers: {
      PREFER: 'return=representation'
    }
  })
}

export function createIdea (idea) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/idea', idea, config)
}

export function updateIdea (idea) {
  return service({
    method: 'patch',
    url: '/idea',
    data: idea,
    params: {
      id: `eq.${idea.id}`
    },
    headers: {
      PREFER: 'return=representation'
    }
  })
}

export function getUsers (schoolId, ideaSpaceId) {
  var queryParams = {}
  if (!ideaSpaceId) {
    queryParams['school_id'] = `eq.${schoolId}`
    queryParams['config->>deleted'] = 'is.null'
    return service.get('/users', {params: queryParams})
  } else {
    queryParams['spaceid'] = ideaSpaceId
    return service.post('/rpc/ideas_space_user', queryParams)
  }
}

export function deleteIdeaSpace (schoolId, ideaSpaceId) {
  var queryParams = {
    school_id: schoolId,
    space_id: ideaSpaceId
  }
  return service.post('/rpc/delete_space', queryParams)
}

export function getTopics (schoolId, ideaSpaceId) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    select: '*,idea(count)'
  }
  if (ideaSpaceId !== null) {
    queryParams['idea_space'] = `eq.${ideaSpaceId}`
  } else {
    queryParams['idea_space'] = `is.null`
  }
  return service.get('/topic', {params: queryParams})
}
