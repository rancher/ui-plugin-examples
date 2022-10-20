<script>
export default {
  name:   'NweHomePage',
  layout: 'plain'
};
</script>
<template>
  <div>
    <h1>Welcome to Rancher</h1>
    <img src="./assets/rancher-logo.svg" height="64" />
    <h3>Home Page Extension 0.3.0</h3>
    <img src="./assets/rancher-home-animated.svg" />
  </div>
</template>
<style lang="scss" scoped>
  h1, h3 {
    margin: 20px 0;
    text-align: center;
  }

  h3 {
    color: #2553FF;
    font-weight: bold;
  }
</style>
