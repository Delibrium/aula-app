<template></template>
<script>
export default {
  beforeCreate () {
    console.log(this.$route)
    const path = this.$route.params.path
    this.$router.push(path)
  }
}
</script>
