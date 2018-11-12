import service from '@/api/service'

function get (topicId) {
  const params = {
    id: `eq.${topicId}`
  }
  return service.get('/topic', { params })
}

export default {
  get
}
