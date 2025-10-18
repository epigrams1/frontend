<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link :to="{ name: 'dashboard' }">
        <img src="@/assets/images/themis-logo.png" class="logo" alt="Logo" />
      </router-link>
    </div>

    <div class="navbar-center">
      <div class="navbar-item" :class="{ active: $route.name === 'dashboard' }">
        <router-link :to="{ name: 'dashboard' }" class="navbar-link">
          <img src="@/assets/images/leftNavBar/home.svg" class="navbar-icon" alt="Home Icon" />
          <p class="navbar-text">Home</p>
        </router-link>
      </div>
    </div>

    <div class="navbar-right dropdown">
      <a
        class="dropdown-toggle link-body-emphasis d-flex align-items-center text-decoration-none"
        aria-expanded="false"
        data-bs-toggle="dropdown"
        role="button"
      >
        <img
          class="rounded-circle"
          alt=""
          width="32"
          height="32"
          src="@/assets/images/leftNavBar/user-profile.svg"
        />
      </a>
      <div class="dropdown-menu shadow text-small" data-popper-placement="bottom-start">
        <router-link :to="{ name: 'profile' }" class="router-link">
          <a class="dropdown-item">Profile</a>
        </router-link>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" @click="authStore.logout">Sign out</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 58px;
  padding: 0 2rem;
  transition: all 0.3s ease;
}

.logo {
  width: 2rem;
  height: 2rem;
}

.navbar-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  height: 100%;
}

.navbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  min-width: 75px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.navbar-item:hover {
  transform: translateY(-2px);
}

.navbar-link {
  text-decoration: none;
  color: #22335a;
  font-weight: 600;
  font-size: 0.78rem;
  text-align: center;
  line-height: 1.1;
  transition: color 0.2s ease;
}

.navbar-icon {
  margin-top: 1rem;
  width: 1.3rem;
  height: 1.3rem;
  transition: transform 0.3s ease;
}

.navbar-item:hover .navbar-icon {
  transform: scale(1.1);
}

/* Animated underline */
.navbar-item::after {
  content: "";
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  width: 60%;
  height: 3px;
  background-color: #22335a;
  border-radius: 2px;
  transition: transform 0.3s ease;
}

.navbar-item.active::after,
.navbar-item:hover::after {
  transform: translateX(-50%) scaleX(1);
}

/* Active color */
.navbar-item.active .navbar-link {
  color: #22335a;
}

.navbar-right {
  display: flex;
  align-items: center;
}



</style>
