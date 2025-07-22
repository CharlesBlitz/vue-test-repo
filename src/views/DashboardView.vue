<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-white p-6 rounded-xl shadow-elevation-1">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Welcome back, {{ authStore.user?.name }}</h1>
          <p class="text-gray-600 mt-1">Here's an overview of your surveys and knowledge base</p>
        </div>
        <div class="flex items-center space-x-3">
          <router-link 
            v-if="authStore.isManager"
            to="/surveys/create" 
            class="btn-accent"
          >
            Create Survey
          </router-link>
          <router-link 
            to="/knowledge" 
            class="btn-secondary"
          >
            Company KB
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Active Surveys</dt>
              <dd class="text-lg font-medium text-gray-900">{{ activeSurveys.length }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Responses</dt>
              <dd class="text-lg font-medium text-gray-900">{{ totalResponses }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V8z" clip-rule="evenodd"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Draft Responses</dt>
              <dd class="text-lg font-medium text-gray-900">{{ draftResponses.length }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
              </svg>
            </div>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Knowledge Items</dt>
              <dd class="text-lg font-medium text-gray-900">{{ knowledgeItems }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Surveys -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Recent Surveys</h3>
          <router-link to="/surveys" class="text-gray-600 hover:text-gray-900 text-sm font-medium">
            View all
          </router-link>
        </div>
        <div class="space-y-4">
          <div 
            v-for="survey in recentSurveys" 
            :key="survey.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h4 class="font-medium text-gray-900">{{ survey.title }}</h4>
              <p class="text-sm text-gray-600">{{ survey.completedCount }} / {{ survey.totalTargeted }} completed</p>
            </div>
            <div class="flex items-center space-x-2">
              <span 
                :class="getStatusClass(survey.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ survey.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <router-link 
            to="/knowledge" 
            class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Search Knowledge Base</p>
              <p class="text-sm text-gray-600">Find answers from past employees</p>
            </div>
          </router-link>

          <router-link 
            v-if="authStore.isManager"
            to="/surveys/create" 
            class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Create New Survey</p>
              <p class="text-sm text-gray-600">Set up an exit interview survey</p>
            </div>
          </router-link>

          <router-link 
            v-if="authStore.isManager"
            to="/analytics" 
            class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">View Analytics</p>
              <p class="text-sm text-gray-600">Check survey statistics</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useSurveyStore } from '../stores/surveys';

const authStore = useAuthStore();
const surveyStore = useSurveyStore();

const activeSurveys = computed(() => surveyStore.activeSurveys);
const draftResponses = computed(() => surveyStore.draftResponses);

const totalResponses = computed(() => {
  return surveyStore.surveys.reduce((total, survey) => total + survey.completedCount, 0);
});

const knowledgeItems = computed(() => {
  // Mock data - in real app, this would come from knowledge base
  return 247;
});

const recentSurveys = computed(() => {
  return surveyStore.surveys.slice(0, 3);
});

const getStatusClass = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>