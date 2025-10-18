<script setup>
import Login from "@/views/Login.vue";
import { onMounted } from "vue";
import { useAuth } from "@/stores/auth.js";
import SideBar from "@/components/general/navigation-bar/SideBar.vue";

const authStore = useAuth();

onMounted(() => {
  authStore.fetchUserData();
});
</script>

<template>
  <!-- <div v-if="authStore.isAuth" class="main"> -->
  <div class="main">

    <SideBar />
    <router-view />
  </div>
  <!-- <login to="/login" v-else></login> -->
</template>

<style>
@import "assets/project.css";
</style>
