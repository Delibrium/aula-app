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
  return service.post('/rpc/get_page', {'space_id': schoolId, page_name: page})
}

function updatePage (schoolId, page, content) {
  return service.post('/rpc/update_page', {'space_id': schoolId, page: page, content: content})
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
