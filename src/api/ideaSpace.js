import service from '@/api/service'

export function getIdeas (schoolId) {
  return service.get(`/idea_space?school_id=eq.${schoolId}`)
}
