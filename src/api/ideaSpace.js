import service from '@/api/service'

export function getIdeasSpaces (schoolId) {
  return service.get('/idea_space', {params: {school_id: `eq.${schoolId}`}})
}

export function getIdeas (schoolId, ideaSpaceId, topic) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    idea_space: `eq.${ideaSpaceId}`
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

export function createIdea (idea) {
  return service.post('/idea', idea)
}

export function getTopics (schoolId, ideaSpaceId) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    idea_space: `eq.${ideaSpaceId}`
  }
  return service.get('/topic', {params: queryParams})
}
