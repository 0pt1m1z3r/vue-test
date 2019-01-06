<template lang="pug">
.error
  h1(v-if="error.statusCode === 404") Page not found
  h1(v-else-if="error.statusCode === 500") Server error
  h1(v-else) Something went wrong
  nuxt-link(to="/") Go to home page
</template>

<style lang="scss" scoped>
.error {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
</style>


<script>
export default {
  props: [
    'error'
  ]
}
</script>
