const getters = {
  selected_school: state => state.school.selectedSchool,
  school_id: state => state.user.school_id,
  user_id: state => state.user.user_id,
  schoolName: state => state.school.name,
  schoolConfig: state => state.school.schoolConfig
}
export default getters
