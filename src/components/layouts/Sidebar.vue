<template>
    <div class="bg-white border-end vh-100 p-3" style="width: 220px;">
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link to="/" class="nav-link text-dark">Dashboard</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/books" class="nav-link text-dark">Master Buku</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/students" class="nav-link text-dark">Master Mahasiswa</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/inventory" class="nav-link text-dark">Rak Inventory</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link to="/transactions" class="nav-link text-dark">Transaksi</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .router-link-active {
    font-weight: bold;
  }
  </style>
  