<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Create Survey</h1>
        <p class="text-gray-600 mt-1">Set up a new exit interview survey</p>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          @click="saveDraft"
          class="btn-secondary"
        >
          Save Draft
        </button>
        <button 
          @click="publishSurvey"
          class="btn-accent"
        >
          Publish Survey
        </button>
      </div>
    </div>

    <!-- Survey Form -->
    <div class="card p-6 space-y-6">
      <!-- Basic Information -->
      <div class="space-y-4">
        <h2 class="text-lg font-semibold text-gray-900">Basic Information</h2>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Survey Title
          </label>
          <input 
            v-model="surveyData.title"
            type="text" 
            class="input-field"
            placeholder="e.g., Engineering Exit Survey"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea 
            v-model="surveyData.description"
            class="input-field"
            rows="3"
            placeholder="Provide a brief description of the survey purpose..."
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Target Audience Type
            </label>
            <select 
              v-model="surveyData.targetAudience.type"
              class="input-field"
            >
              <option value="person">Specific Person</option>
              <option value="position">Position</option>
              <option value="team">Team</option>
              <option value="company">Whole Company</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Target Value
            </label>
            <input 
              v-model="surveyData.targetAudience.value"
              type="text" 
              class="input-field"
              :placeholder="getTargetPlaceholder()"
            >
          </div>
        </div>
      </div>

      <!-- Questions -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Questions</h2>
          <button 
            @click="addQuestion"
            class="btn-secondary"
          >
            Add Question
          </button>
        </div>

        <div 
          v-for="(question, index) in surveyData.questions" 
          :key="question.id"
          class="bg-gray-50 rounded-lg p-4 space-y-4"
        >
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-gray-900">Question {{ index + 1 }}</h3>
            <button 
              @click="removeQuestion(index)"
              class="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Question Text
            </label>
            <textarea 
              v-model="question.text"
              class="input-field"
              rows="2"
              placeholder="Enter your question..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea 
              v-model="question.description"
              class="input-field"
              rows="2"
              placeholder="Provide additional context or instructions..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Response Type
              </label>
              <select 
                v-model="question.type"
                class="input-field"
              >
                <option value="text">Text Response</option>
                <option value="audio">Audio Recording</option>
                <option value="video">Video Recording</option>
                <option value="file">File Upload</option>
              </select>
            </div>

            <div class="flex items-center">
              <label class="flex items-center">
                <input 
                  v-model="question.required"
                  type="checkbox" 
                  class="mr-2"
                >
                <span class="text-sm font-medium text-gray-700">Required</span>
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Expectations
            </label>
            <div class="space-y-2">
              <div 
                v-for="(_, expIndex) in question.expectations"
                :key="expIndex"
                class="flex items-center space-x-2"
              >
                <input 
                  v-model="question.expectations[expIndex]"
                  type="text" 
                  class="input-field flex-1"
                  placeholder="What do you expect in the answer?"
                >
                <button 
                  @click="removeExpectation(index, expIndex)"
                  class="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
              <button 
                @click="addExpectation(index)"
                class="btn-ghost text-sm"
              >
                + Add Expectation
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Acceptance Criteria
            </label>
            <textarea 
              v-model="question.acceptanceCriteria"
              class="input-field"
              rows="2"
              placeholder="What criteria should the AI use to evaluate the response?"
            ></textarea>
          </div>
        </div>

        <div v-if="surveyData.questions?.length === 0" class="text-center py-8 text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
          </svg>
          <p>No questions added yet</p>
          <button 
            @click="addQuestion"
            class="btn-accent mt-2"
          >
            Add Your First Question
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSurveyStore } from '../stores/surveys';
import type { SurveyCreate, Question } from '../types';

const router = useRouter();
const surveyStore = useSurveyStore();

const surveyData = ref<SurveyCreate>({
  title: '',
  description: '',
  targetAudience: {
    type: 'team',
    value: ''
  },
  questions: []
});

const getTargetPlaceholder = () => {
  switch (surveyData.value.targetAudience?.type) {
    case 'person':
      return 'Enter person name or email';
    case 'position':
      return 'Enter position title';
    case 'team':
      return 'Enter team name';
    case 'company':
      return 'All employees';
    default:
      return 'Enter target value';
  }
};

const addQuestion = () => {
  const newQuestion: Question = {
    id: Date.now().toString(),
    text: '',
    description: '',
    type: 'text',
    required: true,
    expectations: [''],
    acceptanceCriteria: '',
    order: surveyData.value.questions?.length || 0
  };
  
  if (!surveyData.value.questions) {
    surveyData.value.questions = [];
  }
  
  surveyData.value.questions.push(newQuestion);
};

const removeQuestion = (index: number) => {
  if (surveyData.value.questions) {
    surveyData.value.questions.splice(index, 1);
  }
};

const addExpectation = (questionIndex: number) => {
  if (surveyData.value.questions?.[questionIndex]) {
    surveyData.value.questions[questionIndex].expectations.push('');
  }
};

const removeExpectation = (questionIndex: number, expectationIndex: number) => {
  if (surveyData.value.questions?.[questionIndex]) {
    surveyData.value.questions[questionIndex].expectations.splice(expectationIndex, 1);
  }
};

const saveDraft = () => {
  const survey = surveyStore.createSurvey({
    ...surveyData.value,
    status: 'draft'
  });
  console.log(survey);
  
  router.push('/surveys');
};

const publishSurvey = () => {
  // Validate required fields
  if (!surveyData.value.title || !surveyData.value.description || !surveyData.value.questions?.length) {
    alert('Please fill in all required fields and add at least one question.');
    return;
  }
  
  const survey = surveyStore.createSurvey({
    ...surveyData.value,
    status: 'active'
  });
  console.log(survey);
  
  router.push('/surveys');
};
</script>