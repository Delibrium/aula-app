const getters = {
  selected_school: state => state.school.selectedSchool,
  school_id: state => state.user.school_id,
  userId: state => state.user.profile.id,
  user: state => state.user,
  schoolName: state => state.school.name,
  schoolConfig: state => state.school.schoolConfig
}
export default getters
