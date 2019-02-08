import Store from '../store'

export function isUserMemberOf (allowedRoles) {
  if (Store.getters.user.profile.roles == null) return false

  for (var role of Store.getters.user.profile.roles) {
    for (var arole of allowedRoles) {
      console.log(role, arole)
      if (typeof arole !== 'string' && role.length === 2) {
        if (arole[0] === role[0] && arole[1] === role[1]) {
          return true
        }
      } else if (arole === role[0]) {
        return true
      }
    }
  }
  return false
}
