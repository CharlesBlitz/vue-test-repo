<template>
  <div class="max-w-3xl mx-auto space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900">{{ survey?.title }}</h1>
      <p class="text-gray-600 mt-1">{{ survey?.description }}</p>
    </div>

    <!-- Progress Bar -->
    <div class="card p-6">
      <ProgressBar 
        :current="currentQuestionIndex + 1"
        :total="survey?.questions.length || 0"
        :title="`Question ${currentQuestionIndex + 1} of ${survey?.questions.length || 0}`"
      />
    </div>

    <!-- Question Card -->
    <div v-if="currentQuestion" class="card p-8 space-y-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          {{ currentQuestion.text }}
        </h2>
        <p v-if="currentQuestion.description" class="text-gray-600 mb-6">
          {{ currentQuestion.description }}
        </p>
        
        <!-- Expectations -->
        <div v-if="currentQuestion.expectations.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-blue-900 mb-2">What we're looking for:</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li v-for="expectation in currentQuestion.expectations" :key="expectation" class="flex items-start">
              <span class="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
              {{ expectation }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Answer Input -->
      <div class="space-y-4">
        <div v-if="currentQuestion.type === 'text'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Your Answer
          </label>
          <MarkdownEditor 
            v-model="currentAnswer"
            placeholder="Type your detailed response here..."
            @upload-file="showMediaRecorder('file')"
            @record-audio="showMediaRecorder('audio')"
            @record-video="showMediaRecorder('video')"
          />
        </div>

        <div v-else-if="currentQuestion.type === 'audio'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Audio Response
          </label>
          <MediaRecorder 
            type="audio"
            @media-recorded="handleMediaRecorded"
          />
        </div>

        <div v-else-if="currentQuestion.type === 'video'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Video Response
          </label>
          <MediaRecorder 
            type="video"
            @media-recorded="handleMediaRecorded"
          />
        </div>

        <div v-else-if="currentQuestion.type === 'file'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            File Upload
          </label>
          <MediaRecorder 
            type="file"
            @files-uploaded="handleFilesUploaded"
          />
        </div>
      </div>

      <!-- Media Recorder Modal -->
      <div v-if="showMediaModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ mediaModalType === 'audio' ? 'Record Audio' : mediaModalType === 'video' ? 'Record Video' : 'Upload Files' }}
            </h3>
            <button 
              @click="closeMediaModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
          <MediaRecorder 
            :type="mediaModalType"
            @media-recorded="handleMediaRecorded"
            @files-uploaded="handleFilesUploaded"
          />
          <div class="flex justify-end mt-4">
            <button 
              @click="closeMediaModal"
              class="btn-secondary"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <!-- Feedback -->
      <div v-if="feedback" class="border rounded-lg p-4 bg-blue-50 border-blue-200">
        <div class="flex items-start space-x-3">
          <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <div>
            <h4 class="font-medium text-blue-900">AI Feedback</h4>
            <p class="text-blue-800 mt-1">{{ feedback }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="flex items-center justify-between pt-6 border-t border-gray-200">
        <button 
          @click="previousQuestion"
          :disabled="currentQuestionIndex === 0"
          class="btn-secondary"
        >
          Previous
        </button>
        
        <div class="flex items-center space-x-3">
          <button 
            @click="saveProgress"
            class="btn-ghost"
          >
            Save Progress
          </button>
          <button 
            @click="nextQuestion"
            :disabled="!canProceed"
            class="btn-accent"
          >
            {{ isLastQuestion ? 'Submit Survey' : 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useSurveyStore } from '../stores/surveys';
import ProgressBar from '../components/ProgressBar.vue';
import MarkdownEditor from '../components/MarkdownEditor.vue';
import MediaRecorder from '../components/MediaRecorder.vue';
import type { Survey } from '../types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const surveyStore = useSurveyStore();

const survey = ref<Survey | null>(null);
const currentQuestionIndex = ref(0);
const surveyResponses = ref<{ questionId: string; answer: string; type: string }[]>([]);
const currentAnswer = ref('');
const feedback = ref('');
const showMediaModal = ref(false);
const mediaModalType = ref<'audio' | 'video' | 'file'>('audio');
const attachedMedia = ref<{ type: string; blob?: Blob; files?: File[] }[]>([]);

const currentQuestion = computed(() => {
  if (!survey.value) return null;
  return survey.value.questions[currentQuestionIndex.value];
});

const isLastQuestion = computed(() => {
  if (!survey.value) return false;
  return currentQuestionIndex.value === survey.value.questions.length - 1;
});

const canProceed = computed(() => {
  if (!currentQuestion.value) return false;
  if (!currentQuestion.value.required) return true;
  
  switch (currentQuestion.value.type) {
    case 'text':
      return currentAnswer.value.trim().length > 0;
    case 'audio':
      return attachedMedia.value.some(media => media.type === 'audio');
    case 'video':
      return attachedMedia.value.some(media => media.type === 'video');
    case 'file':
      return attachedMedia.value.some(media => media.type === 'file');
    default:
      return false;
  }
});

onMounted(() => {
  const surveyId = route.params.id as string;
  const foundSurvey = surveyStore.getSurveyById(surveyId);
  
  if (!foundSurvey) {
    router.push('/surveys');
    return;
  }
  
  survey.value = foundSurvey;
  
  // Initialize responses array
  surveyResponses.value = survey.value.questions.map(question => ({
    questionId: question.id,
    answer: '',
    type: question.type
  }));
  
  // Load current answer if exists
  loadCurrentAnswer();
});

const loadCurrentAnswer = () => {
  if (!survey.value) return;
  const response = surveyResponses.value.find(r => r.questionId === currentQuestion.value?.id);
  if (response) {
    currentAnswer.value = response.answer;
  }
};

const saveCurrentAnswer = () => {
  if (!currentQuestion.value) return;
  
  const responseIndex = surveyResponses.value.findIndex(r => r.questionId === currentQuestion.value?.id);
  if (responseIndex !== -1) {
    // Handle different response types
    let answerContent = '';
    
    if (currentQuestion.value.type === 'text') {
      answerContent = currentAnswer.value;
    } else {
      // For media responses, create a summary
      const mediaItems = attachedMedia.value.filter(media => media.type === currentQuestion.value?.type);
      if (mediaItems.length > 0) {
        answerContent = `<p>${mediaItems.length} ${currentQuestion.value.type} file(s) uploaded</p>`;
      }
    }
    
    surveyResponses.value[responseIndex].answer = answerContent;
  }
};

const showMediaRecorder = (type: 'audio' | 'video' | 'file') => {
  mediaModalType.value = type;
  showMediaModal.value = true;
};

const closeMediaModal = () => {
  showMediaModal.value = false;
};

const handleMediaRecorded = (blob: Blob, type: string) => {
  attachedMedia.value.push({ type, blob });
  closeMediaModal();
};

const handleFilesUploaded = (files: File[]) => {
  attachedMedia.value.push({ type: 'file', files });
  closeMediaModal();
};

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    saveCurrentAnswer();
    currentQuestionIndex.value--;
    loadCurrentAnswer();
    resetMediaAndFeedback();
  }
};

const nextQuestion = async () => {
  if (!canProceed.value) return;
  
  // Save current answer
  saveCurrentAnswer();
  
  // Simulate AI feedback
  await generateFeedback();
  
  if (isLastQuestion.value) {
    await submitSurvey();
  } else {
    currentQuestionIndex.value++;
    loadCurrentAnswer();
    resetMediaAndFeedback();
  }
};

const submitSurvey = async () => {
  if (!survey.value || !authStore.user) return;
  
  try {
    // Submit the survey response
    const submittedInstance = surveyStore.submitSurveyResponse(
      survey.value.id,
      surveyResponses.value,
      authStore.user.id
    );
    
    if (submittedInstance) {
      // Show success message
      alert('Survey submitted successfully! Thank you for your feedback.');
      router.push('/surveys');
    } else {
      throw new Error('Failed to submit survey');
    }
  } catch (error) {
    console.error('Error submitting survey:', error);
    alert('There was an error submitting your survey. Please try again.');
  }
};

const generateFeedback = async () => {
  if (currentQuestion.value?.type === 'text' && currentAnswer.value.trim()) {
    // Simulate AI processing
    feedback.value = 'Your response covers the key points well. Consider adding more specific examples to strengthen your feedback.';
    
    // Show feedback for 3 seconds
    setTimeout(() => {
      feedback.value = '';
    }, 3000);
  }
};

const resetMediaAndFeedback = () => {
  feedback.value = '';
  attachedMedia.value = [];
};

const saveProgress = () => {
  saveCurrentAnswer();
  console.log('Progress saved');
  alert('Progress saved! You can continue this survey later.');
};
</script>