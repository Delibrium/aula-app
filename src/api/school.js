import service from '@/api/service'

function get () {
  return service.get('/school')
}

function update (schoolId, data) {
  const params = {
    id: `eq.${schoolId}`
  }
  return service.patch('/school', data, { params })
}

function getImage (schoolId) {
  const params = {
    id: `eq.${schoolId}`,
    select: 'image'
  }

  return service.get('/school', { params })
}

function getPublic () {
  return service.get('/rpc/school_listing')
}

function getConfig (schoolId) {
  return service.post('/rpc/config', {'space_id': schoolId})
}

function addPage (newPage) {
  const config = {
    headers: {
      PREFER: 'return=representation'
    }
  }

  return service.post('/page', newPage, config)
}

function deletePage (pageId) {
  const params = { id: 'eq.' + pageId }
  return service.delete('/page', { params })
}

function getPages (schoolId) {
  const params = {
    school_id: 'eq.' + schoolId
  }

  return service.get('/page', { params })
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
      value: JSON.stringify(configValue)
    })
}

export default {
  get,
  update,
  getImage,
  getPublic,
  getConfig,
  updateConfig,
  getPage,
  addPage,
  deletePage,
  getPages,
  updatePage
}
