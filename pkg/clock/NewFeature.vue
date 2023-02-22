<script>
import ClockComponent from './ClockComponent.vue';

export default {
  name: 'Clock',

  layout: 'plain',

  components: { ClockComponent }
};

</script>
<template>
  <div class="clock">
    <ClockComponent size="400px" border="5px solid #2553FF" color="#777" />
  </div>
</template>

<style lang="scss" scoped>
  h1 {
    text-align: center;
  }

  .clock {
    align-items: center;
    display: flex;
    justify-content: center;
  }
</style>
