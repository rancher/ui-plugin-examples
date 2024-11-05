<script>
export default { name: 'LargeExtension' };

</script>
<template>
  <div class="container-ext">
    <h1>Large extension demo (> 30mb) - cache testing</h1>
    <img src="./assets/img/susecon_20204.jpg" />
  </div>
</template>

<style lang="scss" scoped>
  .container-ext {
    align-items: center;
    display: flex;
    justify-content: center;

    h1 {
      text-align: center;
      margin-bottom: 40px;
    }
  }
</style>
