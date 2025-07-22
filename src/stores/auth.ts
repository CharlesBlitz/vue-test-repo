import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'manager',
    department: 'Engineering',
    position: 'Senior Manager',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
  });

  const isAuthenticated = computed(() => user.value !== null);
  const isManager = computed(() => user.value?.role === 'manager' || user.value?.role === 'admin');
  const isAdmin = computed(() => user.value?.role === 'admin');

  const login = (credentials: { email: string; password: string }) => {
    // TODO: Implement Keycloak authentication
    console.log('Login:', credentials);
  };

  const logout = () => {
    user.value = null;
  };

  return {
    user: computed(() => user.value),
    isAuthenticated,
    isManager,
    isAdmin,
    login,
    logout
  };
});