import service from '@/api/service'

function get () {
  return service.get('/school')
}

function getPublic () {
  return service.get('/rpc/school_listing')
}

function getConfig (schoolId) {
  return service.post('/rpc/config', {'space_id': schoolId})
}

function getPage (schoolId, page) {
  const params = {
    school_id: 'eq.' + schoolId,
    name: 'eq.' + page
  }

  return service.get('/page', { params })
}

function updatePage (schoolId, page, content) {
  const params = {
    school_id: 'eq.' + schoolId,
    name: 'eq.' + page
  }

  return service.patch('/page', {'content': content}, { params })
}

function updateConfig (schoolId, configKey, configValue) {
  return service.post('/rpc/config_update',
    {
      space_id: schoolId,
      key: configKey,
      value: configValue
    })
}

export default {
  get,
  getPublic,
  getConfig,
  updateConfig,
  getPage,
  updatePage
}
