import Store from '../store'

export function isUserMemberOf (allowedRoles) {
  if (Store.getters.user.profile.role == null) return false

  let existingRoles = Store.getters.user.profile.role.filter(role => {
    if (allowedRoles.indexOf(role) >= 0) return true
  })
  return (existingRoles.length > 0)
}
