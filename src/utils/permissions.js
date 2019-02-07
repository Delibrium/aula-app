import Store from '../store'

export function isUserMemberOf (allowedRoles) {
  if (Store.getters.user.profile.role == null) return false

  for (var role of Store.getters.user.profile.role) {
    console.log(role)
    if (allowedRoles.indexOf(role) >= 0) return true
  }
  return false
}
