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
