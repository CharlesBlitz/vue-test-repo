<template>
  <div class="card p-6 space-y-6">
    <!-- Respondent Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <img 
          :src="instance.respondent.avatar" 
          :alt="instance.respondent.name"
          class="w-10 h-10 rounded-full"
        >
        <div>
          <h3 class="font-semibold text-gray-900">{{ instance.respondent.name }}</h3>
          <p class="text-sm text-gray-600">{{ instance.respondent.position }} • {{ instance.respondent.department }}</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-500">{{ formatDate(instance.submittedAt) }}</span>
        <button 
          @click="toggleExpanded"
          class="btn-secondary text-sm"
        >
          {{ isExpanded ? 'Collapse' : 'View Responses' }}
        </button>
      </div>
    </div>

    <!-- Responses (when expanded) -->
    <div v-if="isExpanded" class="space-y-6">
      <div 
        v-for="response in instance.responses" 
        :key="response.questionId"
        class="border-l-4 border-l-gray-200 pl-4 space-y-3"
      >
        <div>
          <h4 class="font-medium text-gray-900 mb-2">{{ getQuestionText(response.questionId) }}</h4>
          <div 
            class="prose prose-sm max-w-none text-gray-700"
            v-html="response.answer"
          ></div>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="border-t border-gray-200 pt-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-medium text-gray-900">
            Comments ({{ totalCommentsCount }})
          </h4>
        </div>

        <!-- Comment List -->
        <div class="space-y-4">
          <div 
            v-for="comment in instance.comments" 
            :key="comment.id"
            class="space-y-3"
          >
            <!-- Main Comment -->
            <div class="flex space-x-3">
              <img 
                :src="comment.userAvatar" 
                :alt="comment.userName"
                class="w-8 h-8 rounded-full flex-shrink-0"
              >
              <div class="flex-1 min-w-0">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="font-medium text-gray-900 text-sm">{{ comment.userName }}</span>
                    <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="text-sm text-gray-700">{{ comment.content }}</p>
                </div>
                <div class="flex items-center space-x-2 mt-2">
                  <button 
                    @click="toggleReply(comment.id)"
                    class="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>

            <!-- Replies -->
            <div v-if="comment.replies && comment.replies.length > 0" class="ml-11 space-y-3">
              <div 
                v-for="reply in comment.replies" 
                :key="reply.id"
                class="flex space-x-3"
              >
                <img 
                  :src="reply.userAvatar" 
                  :alt="reply.userName"
                  class="w-7 h-7 rounded-full flex-shrink-0"
                >
                <div class="flex-1 min-w-0">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="font-medium text-gray-900 text-sm">{{ reply.userName }}</span>
                      <span class="text-xs text-gray-500">{{ formatDate(reply.createdAt) }}</span>
                    </div>
                    <p class="text-sm text-gray-700">{{ reply.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply Form -->
            <div v-if="replyingTo === comment.id" class="ml-11">
              <div class="flex space-x-3">
                <img 
                  :src="authStore.user?.avatar" 
                  :alt="authStore.user?.name"
                  class="w-7 h-7 rounded-full flex-shrink-0"
                >
                <div class="flex-1">
                  <textarea
                    v-model="replyContent"
                    placeholder="Write a reply..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows="2"
                  ></textarea>
                  <div class="flex items-center justify-end space-x-2 mt-2">
                    <button 
                      @click="cancelReply"
                      class="btn-ghost text-xs"
                    >
                      Cancel
                    </button>
                    <button 
                      @click="submitReply(comment.id)"
                      :disabled="!replyContent.trim()"
                      class="btn-accent text-xs"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- New Comment Form -->
        <div class="mt-6">
          <div class="flex space-x-3">
            <img 
              :src="authStore.user?.avatar" 
              :alt="authStore.user?.name"
              class="w-8 h-8 rounded-full flex-shrink-0"
            >
            <div class="flex-1">
              <textarea
                v-model="newComment"
                placeholder="Leave a comment..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="3"
              ></textarea>
              <div class="flex items-center justify-end space-x-2 mt-2">
                <button 
                  @click="submitComment"
                  :disabled="!newComment.trim()"
                  class="btn-accent text-sm"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useSurveyStore } from '../stores/surveys';
import type { SurveyInstance } from '../types';

interface Props {
  instance: SurveyInstance;
}

const props = defineProps<Props>();
const authStore = useAuthStore();
const surveyStore = useSurveyStore();

const isExpanded = ref(false);
const newComment = ref('');
const replyingTo = ref<string | null>(null);
const replyContent = ref('');

const totalCommentsCount = computed(() => {
  let count = props.instance.comments.length;
  props.instance.comments.forEach(comment => {
    if (comment.replies) {
      count += comment.replies.length;
    }
  });
  return count;
});

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const getQuestionText = (questionId: string) => {
  const survey = surveyStore.getSurveyById(props.instance.surveyId);
  const question = survey?.questions.find(q => q.id === questionId);
  return question?.text || 'Question not found';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

const submitComment = () => {
  if (!newComment.value.trim() || !authStore.user) return;
  
  surveyStore.addComment(
    props.instance.id,
    newComment.value.trim(),
    authStore.user.id,
    authStore.user.name,
    authStore.user.avatar || ''
  );
  
  newComment.value = '';
};

const toggleReply = (commentId: string) => {
  if (replyingTo.value === commentId) {
    replyingTo.value = null;
    replyContent.value = '';
  } else {
    replyingTo.value = commentId;
    replyContent.value = '';
  }
};

const submitReply = (parentId: string) => {
  if (!replyContent.value.trim() || !authStore.user) return;
  
  surveyStore.addComment(
    props.instance.id,
    replyContent.value.trim(),
    authStore.user.id,
    authStore.user.name,
    authStore.user.avatar || '',
    parentId
  );
  
  replyContent.value = '';
  replyingTo.value = null;
};

const cancelReply = () => {
  replyingTo.value = null;
  replyContent.value = '';
};
</script>