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
  updateConfig
}
