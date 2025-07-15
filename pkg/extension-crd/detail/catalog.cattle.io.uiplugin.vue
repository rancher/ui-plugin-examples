<script>
export default {
  props: {
    value: {
      type:     Object,
      required: true
    }
  }
};
</script>
<template>
  <div>
    <h1>{{ value.name }}</h1>
    <h3>{{ value.version }}</h3>
  </div>
</template>
<style lang="scss" scoped>
</style>
