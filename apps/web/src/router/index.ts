import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegistrationFlow.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: { requiresAuth: true, requiresCompleteRegistration: true },
    },
  ],
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();
  
  
  if (!to.meta.requiresAuth) {
    await authStore.checkAuth();
  }

  const { isAuthenticated, isRegistrationComplete } = authStore;

  if (!to.meta.requiresAuth) {
    if (to.name === 'login' && isAuthenticated) {
      return next({ name: 'dashboard' });
    }
    return next();
  }

  if (!isAuthenticated) {
    return next({ name: 'login' });
  }

  if (to.meta.requiresCompleteRegistration && !isRegistrationComplete) {
    return next({ name: 'register' });
  }

  next();
});

export default router;
