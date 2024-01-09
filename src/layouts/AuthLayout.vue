<template>
  <q-layout class="login-layout">
    <q-page-container class="q-px-lg">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.q-page-container {
  height: 100vh;
}
</style>

<script>
export default {
  name: 'AuthLayout',
  setup() {
    return {};
  }
}
</script>
