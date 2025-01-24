<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import Toaster from "@/components/ui/toast/Toaster.vue";

const isLoading = ref(true);
const authStore = useAuthStore();

onMounted(async () => {
  try {
    await authStore.checkAuth();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <main class="w-full">
    <Toaster />
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
    <router-view v-else v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
