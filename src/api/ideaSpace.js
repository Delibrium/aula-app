import service from '@/api/service'

export function getIdeaSpaces (schoolId) {
  return service.get('/idea_space', {params: {school_id: `eq.${schoolId}`}})
}

export function getIdeas (schoolId, ideaSpaceId = null, topic) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    select: '*,' +
      'category(id,name,image),' +
      'created_by(id,first_name,last_name),' +
      'comment(count),' +
      'idea_vote(created_by)'
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
