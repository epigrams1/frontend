import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue"
import Profile from "@/views/Profile.vue";
import NotFound from "@/views/NotFound.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    
    {
      path: "/",
      name: "dashboard",
      component: Dashboard
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
    },
    {
      path: "/:pathMatch(.*)",
      component: NotFound,
    },
  ],
});

export default router;
