<template>
  <div class="d-flex flex-column min-vh-100">
    <Topbar />
    <div class="d-flex flex-grow-1">
      <Sidebar />
      <main class="flex-grow-1 p-4 bg-light">
        <router-view />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from './components/layouts/Footer.vue';
import Sidebar from './components/layouts/Sidebar.vue';
import Topbar from './components/layouts/Topbar.vue';
</script>

<style scoped>
main {
  min-height: 100vh;
}
</style>
