<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Edit Survey</h1>
        <p class="text-gray-600 mt-1">Modify your exit interview survey</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="saveDraft"
          class="btn-secondary"
        >
          Save Draft
        </button>
        <button 
          @click="updateSurvey"
          class="btn-primary"
        >
          Update Survey
        </button>
      </div>
    </div>

    <!-- Survey editing form would go here -->
    <div class="card p-6">
      <p class="text-gray-600">Survey editing functionality will be implemented similar to CreateSurveyView...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSurveyStore } from '../stores/surveys';

const route = useRoute();
const router = useRouter();
const surveyStore = useSurveyStore();

onMounted(() => {
  const surveyId = route.params.id as string;
  const survey = surveyStore.getSurveyById(surveyId);
  
  if (!survey) {
    router.push('/surveys');
    return;
  }
  
  // Load survey data for editing
  console.log('Editing survey:', survey);
});

const saveDraft = () => {
  // Save as draft
  router.push('/surveys');
};

const updateSurvey = () => {
  // Update the survey
  router.push('/surveys');
};
</script>