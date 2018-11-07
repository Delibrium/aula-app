import service from '@/api/service'

export function createTopic (topic) {
  return service.post('/topic', topic)
}

export function getTopics (schoolId, ideaSpaceId) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    idea_space: `eq.${ideaSpaceId}`
  }
  return service.get('/topic', {params: queryParams})
}
