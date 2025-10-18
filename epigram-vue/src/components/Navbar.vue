<template>
  <nav class="nav">
    <router-link to="/" class="brand">
      <img src="/epigramia-logo.svg" alt="Epigramia" class="logo" />
    </router-link>
    <div class="links">
      <router-link
        to="/"
        :class="{ disabled: !auth.loggedIn }"
        @click.prevent="guard($event)"
        >Home</router-link
      >
      <router-link
        to="/saved"
        :class="{ disabled: !auth.loggedIn }"
        @click.prevent="guard($event)"
        >Saved</router-link
      >
      <router-link
        to="/my"
        :class="{ disabled: !auth.loggedIn }"
        @click.prevent="guard($event)"
        >My Epigrams</router-link
      >
      <router-link
        to="/settings"
        :class="{ disabled: !auth.loggedIn }"
        @click.prevent="guard($event)"
        >Settings</router-link
      >
      <button class="login" @click="toggleAuth">
        {{ auth.loggedIn ? "Logout" : "Login" }}
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();

function guard(e: MouseEvent) {
  if (!auth.loggedIn) {
    e.preventDefault();
    e.stopPropagation();
  }
}
function toggleAuth() {
  auth.loggedIn ? auth.logout() : auth.login();
}
</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}
.links a {
  margin-left: 12px;
}
.links a.disabled {
  pointer-events: none;
  opacity: 0.4;
}
.brand .logo {
  height: 28px;
  display: block;
}
.links .login {
  margin-left: 12px;
  padding: 6px 10px;
  border: 1px solid #111827;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
}
.links .login:hover { background: #0e1625; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
.links .login:active { transform: translateY(1px); }
.brand {
  font-weight: 600;
}
</style>
