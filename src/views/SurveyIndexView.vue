<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Surveys</h1>
        <p class="text-gray-600 mt-1">Manage and complete exit surveys</p>
      </div>
      <router-link 
        v-if="authStore.isManager"
        to="/surveys/create" 
        class="btn-accent"
      >
        Create Survey
      </router-link>
    </div>

    <!-- Draft Responses -->
    <div v-if="draftResponses.length > 0" class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">Continue Your Surveys</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="response in draftResponses" 
          :key="response.id"
          class="card p-6 border-l-4 border-l-accent-500"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-gray-900">{{ getSurveyTitle(response.surveyId) }}</h3>
            <span class="text-xs bg-accent-100 text-accent-800 px-2 py-1 rounded-full">Draft</span>
          </div>
          <ProgressBar 
            :current="response.progress" 
            :total="100" 
            title="Progress"
            class="mb-4"
          />
          <button 
            @click="continueSurvey(response.surveyId)"
            class="btn-accent w-full"
          >
            Continue Survey
          </button>
        </div>
      </div>
    </div>

    <!-- Available Surveys -->
    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">Available Surveys</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SurveyCard 
          v-for="survey in activeSurveys" 
          :key="survey.id"
          :survey="survey"
          @take-survey="takeSurvey"
          @edit-survey="editSurvey"
        />
      </div>
    </div>

    <!-- Survey Instances -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">Survey Responses</h2>
        <div class="flex items-center space-x-2">
          <select v-model="selectedSurveyFilter" class="input-field text-sm">
            <option value="">All Surveys</option>
            <option 
              v-for="survey in surveyStore.surveys" 
              :key="survey.id"
              :value="survey.id"
            >
              {{ survey.title }}
            </option>
          </select>
          <select v-model="selectedDepartmentFilter" class="input-field text-sm">
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Product">Product</option>
          </select>
        </div>
      </div>
      
      <div v-if="filteredInstances.length === 0" class="text-center py-8 text-gray-500">
        <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V8z" clip-rule="evenodd"/>
        </svg>
        <p>No survey responses found</p>
        <p class="text-sm mt-1">Survey responses will appear here once team members complete their surveys</p>
      </div>
      
      <div class="space-y-4">
        <SurveyInstanceCard 
          v-for="instance in filteredInstances" 
          :key="instance.id"
          :instance="instance"
        />
      </div>
    </div>

    <!-- All Surveys (for managers) -->
    <div v-if="authStore.isManager" class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-900">All Surveys</h2>
      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">Survey Management</h3>
            <div class="flex items-center space-x-2">
              <select class="input-field text-sm">
                <option>All Status</option>
                <option>Active</option>
                <option>Draft</option>
                <option>Completed</option>
              </select>
              <select class="input-field text-sm">
                <option>All Teams</option>
                <option>Engineering</option>
                <option>Sales</option>
                <option>Marketing</option>
              </select>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Survey
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="survey in surveyStore.surveys" :key="survey.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ survey.title }}</div>
                    <div class="text-sm text-gray-500">{{ survey.questions.length }} questions</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ survey.targetAudience.value }}</div>
                  <div class="text-sm text-gray-500">{{ survey.targetAudience.type }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ survey.completedCount }} / {{ survey.totalTargeted }}</div>
                  <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      class="bg-primary-600 h-2 rounded-full transition-all duration-500"
                      :style="{ width: `${getSurveyProgress(survey)}%` }"
                    ></div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="getStatusClass(survey.status)"
                    class="px-2 py-1 text-xs font-medium rounded-full"
                  >
                    {{ survey.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="editSurvey(survey)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    @click="viewAnalytics(survey)"
                    class="text-gray-600 hover:text-gray-900"
                  >
                    Analytics
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSurveyStore } from '../stores/surveys';
import SurveyCard from '../components/SurveyCard.vue';
import ProgressBar from '../components/ProgressBar.vue';
import SurveyInstanceCard from '../components/SurveyInstanceCard.vue';
import type { Survey } from '../types';

const router = useRouter();
const authStore = useAuthStore();
const surveyStore = useSurveyStore();

const selectedSurveyFilter = ref('');
const selectedDepartmentFilter = ref('');

const activeSurveys = computed(() => surveyStore.activeSurveys);
const draftResponses = computed(() => surveyStore.draftResponses);

const filteredInstances = computed(() => {
  let instances = surveyStore.surveyInstances;
  
  // Filter by survey
  if (selectedSurveyFilter.value) {
    instances = instances.filter(instance => instance.surveyId === selectedSurveyFilter.value);
  }
  
  // Filter by department
  if (selectedDepartmentFilter.value) {
    instances = instances.filter(instance => instance.respondent.department === selectedDepartmentFilter.value);
  }
  
  // Filter by access permissions
  if (!authStore.isManager) {
    // Non-managers can only see instances from their own department or surveys they're targeted for
    instances = instances.filter(instance => {
      const survey = surveyStore.getSurveyById(instance.surveyId);
      if (!survey) return false;
      
      // Check if user is in target audience
      const userDepartment = authStore.user?.department;
      return (
        instance.respondent.department === userDepartment ||
        (survey.targetAudience.type === 'team' && survey.targetAudience.value === userDepartment) ||
        survey.targetAudience.type === 'company'
      );
    });
  }
  
  // Sort by submission date (newest first)
  return instances.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
});

const getSurveyTitle = (surveyId: string) => {
  const survey = surveyStore.getSurveyById(surveyId);
  return survey?.title || 'Unknown Survey';
};

const getSurveyProgress = (survey: Survey) => {
  if (survey.totalTargeted === 0) return 0;
  return Math.round((survey.completedCount / survey.totalTargeted) * 100);
};

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

const takeSurvey = (survey: Survey) => {
  router.push(`/surveys/${survey.id}`);
};

const editSurvey = (survey: Survey) => {
  router.push(`/surveys/${survey.id}/edit`);
};

const continueSurvey = (surveyId: string) => {
  router.push(`/surveys/${surveyId}`);
};

const viewAnalytics = (survey: Survey) => {
  router.push(`/analytics?survey=${survey.id}`);
};
</script>