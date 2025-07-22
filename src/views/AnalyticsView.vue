<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
        <p class="text-gray-600 mt-1">Survey statistics and insights</p>
      </div>
      <div class="flex items-center space-x-3">
        <select class="input-field">
          <option>All Surveys</option>
          <option>Engineering Exit Survey</option>
          <option>Sales Team Exit Survey</option>
        </select>
        <select class="input-field">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>Last year</option>
        </select>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Surveys</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalSurveys }}</p>
          </div>
          <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">+2 from last month</p>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Active Surveys</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeSurveys }}</p>
          </div>
          <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">No change</p>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Responses</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalResponses }}</p>
          </div>
          <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
        </div>
        <p class="text-xs text-green-600 mt-2">+15% from last month</p>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Completion Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ completionRate }}%</p>
          </div>
          <div class="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-accent-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1h-6a1 1 0 01-1-1V8z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
        <p class="text-xs text-green-600 mt-2">+3% from last month</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Survey Performance -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Survey Performance</h3>
        <div class="space-y-4">
          <div 
            v-for="survey in surveyPerformance" 
            :key="survey.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <h4 class="font-medium text-gray-900">{{ survey.title }}</h4>
              <p class="text-sm text-gray-600">{{ survey.responses }} responses</p>
            </div>
            <div class="w-32">
              <div class="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>{{ survey.completion }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gray-700 h-2 rounded-full transition-all duration-500"
                  :style="{ width: `${survey.completion}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Response Trends -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Response Trends</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">This week</span>
            <span class="text-sm font-medium text-gray-900">12 responses</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Last week</span>
            <span class="text-sm font-medium text-gray-900">8 responses</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">This month</span>
            <span class="text-sm font-medium text-gray-900">45 responses</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Last month</span>
            <span class="text-sm font-medium text-gray-900">39 responses</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Analytics -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Survey Details</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Survey
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responses
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Rate
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="survey in detailedSurveys" :key="survey.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ survey.title }}</div>
                <div class="text-sm text-gray-500">{{ survey.questions }} questions</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ survey.created }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ survey.responses }} / {{ survey.targeted }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ survey.completionRate }}%
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ survey.avgTime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="getStatusClass(survey.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ survey.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSurveyStore } from '../stores/surveys';

const surveyStore = useSurveyStore();

const totalSurveys = computed(() => surveyStore.surveys.length);
const activeSurveys = computed(() => surveyStore.activeSurveys.length);
const totalResponses = computed(() => 
  surveyStore.surveys.reduce((total, survey) => total + survey.completedCount, 0)
);
const completionRate = computed(() => {
  const total = surveyStore.surveys.reduce((sum, survey) => sum + survey.totalTargeted, 0);
  if (total === 0) return 0;
  return Math.round((totalResponses.value / total) * 100);
});

const surveyPerformance = computed(() => [
  {
    id: '1',
    title: 'Engineering Exit Survey',
    responses: 8,
    completion: 73
  },
  {
    id: '2',
    title: 'Sales Team Exit Survey',
    responses: 3,
    completion: 38
  }
]);

const detailedSurveys = computed(() => [
  {
    id: '1',
    title: 'Engineering Exit Survey',
    questions: 5,
    created: 'Jan 15, 2024',
    responses: 8,
    targeted: 15,
    completionRate: 73,
    avgTime: '12 min',
    status: 'active'
  },
  {
    id: '2',
    title: 'Sales Team Exit Survey',
    questions: 3,
    created: 'Jan 10, 2024',
    responses: 3,
    targeted: 8,
    completionRate: 38,
    avgTime: '8 min',
    status: 'active'
  }
]);

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