<template>
  <div class="card p-6 hover:shadow-elevation-2 transition-all duration-300">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ survey.title }}</h3>
        <p class="text-gray-600 mb-4">{{ survey.description }}</p>
        
        <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            <span>{{ survey.targetAudience.type }}: {{ survey.targetAudience.value }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            <span>{{ formatDate(survey.createdAt) }}</span>
          </div>
        </div>

        <div class="mb-4">
          <div class="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Audience Progress</span>
            <span>{{ survey.completedCount }} / {{ survey.totalTargeted }}</span>
          </div>
          <div class="progress-bar">
            <div 
              class="h-full bg-gray-700 transition-all duration-500 ease-out" 
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div class="flex items-center space-x-2 ml-4">
        <span 
          :class="statusClasses"
          class="px-2 py-1 text-xs font-medium rounded-full"
        >
          {{ survey.status }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-between pt-4 border-t border-gray-200">
      <div class="flex items-center space-x-2">
        <button 
          @click="$emit('take-survey', survey)"
          class="btn-accent text-sm"
        >
          Take Survey
        </button>
        <button 
          v-if="canEdit"
          @click="$emit('edit-survey', survey)"
          class="btn-secondary text-sm"
        >
          Edit
        </button>
      </div>
      
      <div class="flex items-center space-x-2 text-sm text-gray-500">
        <span>{{ survey.questions.length }} questions</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Survey } from '../types';
import { useAuthStore } from '../stores/auth';

interface Props {
  survey: Survey;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

defineEmits<{
  'take-survey': [survey: Survey];
  'edit-survey': [survey: Survey];
}>();

const progressPercentage = computed(() => {
  if (props.survey.totalTargeted === 0) return 0;
  return Math.round((props.survey.completedCount / props.survey.totalTargeted) * 100);
});

const statusClasses = computed(() => {
  switch (props.survey.status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
});

const canEdit = computed(() => {
  return authStore.isManager && props.survey.createdBy === authStore.user?.id;
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>