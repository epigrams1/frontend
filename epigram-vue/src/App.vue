<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="layout">
    <Navbar />
    <RouterView />
  </div>
  
  
  
  
</template>

<style scoped>
.layout{display:flex;flex-direction:column;min-height:100vh}
</style>
