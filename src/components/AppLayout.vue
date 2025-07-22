<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-elevation-1 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900">ExitKnowledge</span>
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.href"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                $route.path === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-3">
              <img 
                :src="authStore.user?.avatar" 
                :alt="authStore.user?.name"
                class="w-8 h-8 rounded-full"
              >
              <div class="hidden md:block">
                <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500">{{ authStore.user?.role }}</p>
              </div>
            </div>
            
            <button
              @click="authStore.logout"
              class="btn-ghost text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const navigationItems = computed(() => {
  const items = [
    { name: 'Dashboard', href: '/' },
    { name: 'Surveys', href: '/surveys' },
    { name: 'Company KB', href: '/knowledge' }
  ];

  if (authStore.isManager) {
    items.push({ name: 'Analytics', href: '/analytics' });
  }

  return items;
});
</script>