<template>
  <div id="app">
    <AppLayout v-if="authStore.isAuthenticated" />
    <div v-else class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900">ExitKnowledge</h1>
          <p class="text-gray-600 mt-2">Sign in to continue</p>
        </div>
        <div class="card p-8">
          <button 
            @click="authStore.login({ email: 'demo@company.com', password: 'demo' })"
            class="btn-primary w-full"
          >
            Sign In (Demo)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth';
import AppLayout from './components/AppLayout.vue';

const authStore = useAuthStore();
</script>