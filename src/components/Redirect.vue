<template></template>
<script>
export default {
  beforeCreate () {
    const path = this.$route.params.path
    this.$router.push(path)
  }
}
</script>
