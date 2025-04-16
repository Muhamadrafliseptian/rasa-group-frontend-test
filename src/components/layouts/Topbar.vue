<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <span class="navbar-brand fw-bold text-primary">📚 Perpustakaan</span>

      <div class="d-flex align-items-center gap-2">
        <span class="me-2">Halo, Rafi</span>
        <router-link to="/profile">
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="Profile"
            class="rounded-circle border"
            style="width: 40px; height: 40px; object-fit: cover;"
          />
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>
