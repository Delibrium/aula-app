import service from '@/api/service'

export function getIdeasSpaces (schoolId) {
  return service.get(`/idea_space?school_id=eq.${schoolId}`)
}

export function getIdeas (schoolId, ideaSpaceId, topic) {
  var ideaQuery = `/idea?school_id=eq.${schoolId}&idea_space=eq.${ideaSpaceId}`
  if (!topic) {
    ideaQuery += '&topic=is.null'
  }
  return service.get(ideaQuery)
}

export function getIdea (ideaId) {
  return service.get(`/idea?id=eq.${ideaId}`)
}

export function getSpace (schoolId, spaceSlug) {
  return service.get(`idea_space?school_id=eq.${schoolId}&slug=eq.${spaceSlug}`)
}

export function createIdea (idea) {
  return service.post('/idea', idea)
}

export function getTopics (schoolId, ideaSpaceId) {
  return service.get(`topic?school_id=eq.${schoolId}&idea_space=eq.${ideaSpaceId}`)
}
