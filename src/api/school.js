import service from '@/api/service'

export function getSchools () {
  return service.get('/school')
}

export function getSchoolConfig (schoolId) {
  return service.post('/rpc/config', {'space_id': schoolId})
}

export function updateSchoolConfig (schoolId, configKey, configValue) {
  console.log(schoolId)
  return service.post('/rpc/config_update',
    {
      space_id: schoolId,
      key: configKey,
      value: configValue
    })
}
