<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="text-center pb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Company Knowledge Base</h1>
      <p class="text-gray-600">Search through insights from past employees</p>
    </div>

    <!-- Chat Interface -->
    <div class="bg-white rounded-xl shadow-elevation-2 overflow-hidden">
      <!-- Messages -->
      <div 
        ref="messagesContainer"
        class="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50"
      >
        <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
          </svg>
          <p class="text-lg font-medium">Ask a question to get started</p>
          <p class="text-sm mt-1">Try: "What challenges did engineers face with deployment?"</p>
        </div>

        <div 
          v-for="message in messages" 
          :key="message.id"
          :class="[
            'flex',
            message.type === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div 
            :class="[
              'max-w-3xl px-4 py-3 rounded-2xl',
              message.type === 'user' 
                ? 'bg-primary-600 text-white' 
                : 'bg-white shadow-elevation-1 text-gray-900'
            ]"
          >
            <div v-if="message.type === 'assistant'" class="flex items-start space-x-3">
              <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1">
                <p 
                  v-if="message.streaming"
                  class="text-sm text-gray-900 leading-relaxed"
                  v-html="message.content + (message.streaming ? `<span class='animate-pulse'>&nbsp;</span>` : '')"
                ></p>
                <p 
                  v-else
                  class="text-sm text-gray-900 leading-relaxed"
                  v-html="message.content"
                ></p>
              </div>
            </div>
            <p 
              v-else
              class="text-sm leading-relaxed"
            >
              {{ message.content }}
            </p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="border-t border-gray-200 p-4">
        <div class="flex items-end space-x-3">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <div class="flex items-center space-x-1">
                <span class="text-xs text-gray-500">Tags:</span>
                <span 
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full"
                >
                  {{ tag }}
                  <button 
                    @click="removeTag(tag)"
                    class="ml-1 hover:text-primary-900"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
            <textarea
              v-model="currentMessage"
              @keydown.enter.exact.prevent="sendMessage"
              @keydown.shift.enter.prevent="currentMessage += '\n'"
              placeholder="Ask about company knowledge... Use # for roles, @ for people"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows="2"
            ></textarea>
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center space-x-2 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="clearChat"
                  class="btn-ghost text-xs"
                >
                  Clear
                </button>
                <button 
                  @click="sendMessage"
                  :disabled="!currentMessage.trim() || isLoading"
                  class="btn-accent text-sm"
                >
                  <svg v-if="isLoading" class="w-4 h-4 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div 
      v-if="isLoading"
      class="fixed top-4 right-4 bg-white rounded-full p-2 shadow-elevation-2"
    >
      <div class="loading-spinner"></div>
    </div>

    <!-- Quick Suggestions -->
    <div v-if="messages.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="card p-4">
        <h3 class="font-medium text-gray-900 mb-2">Sample Questions</h3>
        <div class="space-y-2">
          <button 
            v-for="suggestion in quickSuggestions"
            :key="suggestion"
            @click="currentMessage = suggestion"
            class="block w-full text-left text-sm text-gray-600 hover:text-gray-900 p-2 rounded hover:bg-gray-50"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
      
      <div class="card p-4">
        <h3 class="font-medium text-gray-900 mb-2">Search Tips</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <p><span class="text-gray-900 font-medium">#</span> Use hashtags for roles (e.g., #engineer, #sales)</p>
          <p><span class="text-gray-900 font-medium">@</span> Mention specific people or teams</p>
          <p><span class="text-gray-900 font-medium">?</span> Ask open-ended questions for better insights</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import type { ChatMessage } from '../types';

const messagesContainer = ref<HTMLElement>();
const currentMessage = ref('');
const messages = ref<ChatMessage[]>([]);
const isLoading = ref(false);
const selectedTags = ref<string[]>([]);

const quickSuggestions = [
  'What challenges did engineers face with deployment?',
  'How did the sales team handle difficult customers?',
  'What tools were most effective for project management?',
  'What would you recommend for new hires in marketing?'
];

const parseMessage = (message: string) => {
  // Extract hashtags for roles
  const roleMatches = message.match(/#(\w+)/g);
  if (roleMatches) {
    roleMatches.forEach(match => {
      const role = match.substring(1);
      if (!selectedTags.value.includes(role)) {
        selectedTags.value.push(role);
      }
    });
  }
  
  // Extract @ mentions
  const mentionMatches = message.match(/@(\w+)/g);
  if (mentionMatches) {
    mentionMatches.forEach(match => {
      const mention = match.substring(1);
      if (!selectedTags.value.includes(mention)) {
        selectedTags.value.push(mention);
      }
    });
  }
  
  return message;
};

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;
  
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    content: currentMessage.value,
    type: 'user',
    timestamp: new Date().toISOString()
  };
  
  messages.value.push(userMessage);
  
  // Parse message for tags
  parseMessage(currentMessage.value);
  
  const query = currentMessage.value;
  currentMessage.value = '';
  isLoading.value = true;
  
  // Add assistant message placeholder
  const assistantMessage: ChatMessage = {
    id: (Date.now() + 1).toString(),
    content: '',
    type: 'assistant',
    timestamp: new Date().toISOString(),
    streaming: true
  };
  
  messages.value.push(assistantMessage);
  
  // Simulate streaming response
  await simulateStreamingResponse(assistantMessage, query);
  
  isLoading.value = false;
};

const simulateStreamingResponse = async (message: ChatMessage, query: string) => {
  // Mock knowledge base response
  console.log(query);
  const responses = [
    'Based on feedback from former engineers, the main deployment challenges included inconsistent environment configurations and lack of automated testing pipelines. Several team members recommended implementing Docker containerization and setting up CI/CD workflows to address these issues.',
    'Sales team insights reveal that difficult customers often resulted from unclear expectations during onboarding. Former sales reps suggest developing better qualification processes and implementing a customer success handoff protocol.',
    'Project management tools that received positive feedback include Notion for documentation, Linear for issue tracking, and Slack for communication. The key was having integrated workflows rather than multiple disconnected tools.',
    'For new marketing hires, former team members emphasized the importance of understanding the target audience through customer interviews and data analysis. They recommend starting with competitive research and brand positioning exercises.'
  ];
  
  const response = responses[Math.floor(Math.random() * responses.length)];
  const words = response.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    message.content = words.slice(0, i + 1).join(' ');
    await scrollToBottom();
  }
  
  message.streaming = false;
};

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag);
};

const clearChat = () => {
  messages.value = [];
  selectedTags.value = [];
  currentMessage.value = '';
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

watch(messages, () => {
  scrollToBottom();
}, { deep: true });
</script>