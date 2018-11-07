import Store from '../store'

export function isUserMemberOf (allowedRoles) {
  if (Store.getters.user.role == null) return false

  Store.getters.user.role.forEach(role => {
    if (allowedRoles.indexOf(role) > 0) return true
  })
  return false
}
