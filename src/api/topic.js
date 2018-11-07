import service from '@/api/service'

export function createTopic (topic) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }
  return service.post('/topic', topic, config)
}

export function getTopics (schoolId, ideaSpaceId) {
  var queryParams = {
    school_id: `eq.${schoolId}`,
    idea_space: `eq.${ideaSpaceId}`
  }
  return service.get('/topic', {params: queryParams})
}
