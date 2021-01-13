<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',

}
</script>

<style>
  .tab_router_view-enter-active, .tab_router_view-leave-active {
    transition: opacity .8s;
  }

  .tab_router_view-enter, .tab_router_view-leave-to {
    opacity: 0;
  }

  .tab_router_view-enter-to, .tab_router_view-leave {
    opacity: 1;
  }
</style>
