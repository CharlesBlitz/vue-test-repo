<template>
  <div class="media-recorder">
    <!-- Audio Recording -->
    <div v-if="type === 'audio'" class="space-y-4">
      <div class="bg-gray-50 rounded-lg p-6 text-center">
        <div v-if="!isRecording && !audioBlob" class="space-y-4">
          <svg class="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="text-gray-600 mb-2">Click to start recording</p>
            <button 
              @click="startRecording"
              class="btn-primary"
            >
              Start Recording
            </button>
          </div>
        </div>
        
        <div v-else-if="isRecording" class="space-y-4">
          <div class="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
            <div class="w-6 h-6 bg-white rounded-full animate-pulse"></div>
          </div>
          <div>
            <p class="text-gray-600 mb-2">Recording... {{ formatTime(recordingTime) }}</p>
            <button 
              @click="stopRecording"
              class="btn-secondary"
            >
              Stop Recording
            </button>
          </div>
        </div>
        
        <div v-else class="space-y-4">
          <svg class="w-16 h-16 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <div>
            <p class="text-gray-600 mb-2">Recording complete ({{ formatTime(recordingTime) }})</p>
            <div class="flex items-center justify-center space-x-2">
              <button 
                @click="playRecording"
                class="btn-secondary"
              >
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                </svg>
                Play
              </button>
              <button 
                @click="resetRecording"
                class="btn-ghost"
              >
                Re-record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Recording -->
    <div v-else-if="type === 'video'" class="space-y-4">
      <div class="bg-gray-50 rounded-lg p-6 text-center">
        <div v-if="!isRecording && !videoBlob" class="space-y-4">
          <svg class="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
          </svg>
          <div>
            <p class="text-gray-600 mb-2">Click to start video recording</p>
            <button 
              @click="startRecording"
              class="btn-primary"
            >
              Start Video Recording
            </button>
          </div>
        </div>
        
        <div v-else-if="isRecording" class="space-y-4">
          <div class="relative">
            <video 
              ref="videoPreview"
              autoplay 
              muted 
              class="w-full max-w-md mx-auto rounded-lg"
            ></video>
            <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              REC {{ formatTime(recordingTime) }}
            </div>
          </div>
          <button 
            @click="stopRecording"
            class="btn-secondary"
          >
            Stop Recording
          </button>
        </div>
        
        <div v-else class="space-y-4">
          <video 
            ref="videoPlayback"
            controls 
            class="w-full max-w-md mx-auto rounded-lg"
          ></video>
          <div>
            <p class="text-gray-600 mb-2">Video recorded ({{ formatTime(recordingTime) }})</p>
            <button 
              @click="resetRecording"
              class="btn-ghost"
            >
              Re-record
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- File Upload -->
    <div v-else-if="type === 'file'" class="space-y-4">
      <div 
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
      >
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
        <p class="text-gray-600 mb-4">Drag and drop files here, or click to select</p>
        <input 
          ref="fileInput"
          type="file"
          multiple
          @change="handleFileSelect"
          class="hidden"
        >
        <button 
          @click="fileInput?.click()"
          class="btn-secondary"
        >
          Choose Files
        </button>
      </div>
      
      <div v-if="uploadedFiles.length > 0" class="space-y-2">
        <h4 class="font-medium text-gray-900">Uploaded Files:</h4>
        <div 
          v-for="file in uploadedFiles" 
          :key="file.name"
          class="flex items-center justify-between p-3 bg-white rounded-lg border"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
            </svg>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button 
            @click="removeFile(file)"
            class="text-red-600 hover:text-red-800"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, useTemplateRef } from 'vue';

interface Props {
  type: 'audio' | 'video' | 'file';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'media-recorded': [blob: Blob, type: string];
  'files-uploaded': [files: File[]];
}>();

const isRecording = ref(false);
const recordingTime = ref(0);
const audioBlob = ref<Blob | null>(null);
const videoBlob = ref<Blob | null>(null);
const uploadedFiles = ref<File[]>([]);
const mediaRecorder = ref<MediaRecorder | null>(null);
const recordingInterval = ref<number | null>(null);
const videoPreview = ref<HTMLVideoElement>();
const videoPlayback = ref<HTMLVideoElement>();
const fileInput = useTemplateRef('fileInput');

const startRecording = async () => {
  try {
    const constraints = props.type === 'audio' 
      ? { audio: true }
      : { video: true, audio: true };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    if (props.type === 'video' && videoPreview.value) {
      videoPreview.value.srcObject = stream;
    }
    
    mediaRecorder.value = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.value.onstop = () => {
      const blob = new Blob(chunks, { 
        type: props.type === 'audio' ? 'audio/wav' : 'video/webm' 
      });
      
      if (props.type === 'audio') {
        audioBlob.value = blob;
      } else {
        videoBlob.value = blob;
        if (videoPlayback.value) {
          videoPlayback.value.src = URL.createObjectURL(blob);
        }
      }
      
      emit('media-recorded', blob, props.type);
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
    };
    
    mediaRecorder.value.start();
    isRecording.value = true;
    recordingTime.value = 0;
    
    recordingInterval.value = window.setInterval(() => {
      recordingTime.value++;
    }, 1000);
    
  } catch (error) {
    console.error('Error starting recording:', error);
    alert('Could not access microphone/camera. Please check permissions.');
  }
};

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
    
    if (recordingInterval.value) {
      clearInterval(recordingInterval.value);
      recordingInterval.value = null;
    }
  }
};

const playRecording = () => {
  if (audioBlob.value) {
    const audio = new Audio(URL.createObjectURL(audioBlob.value));
    audio.play();
  }
};

const resetRecording = () => {
  audioBlob.value = null;
  videoBlob.value = null;
  recordingTime.value = 0;
  
  if (videoPlayback.value) {
    videoPlayback.value.src = '';
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    uploadedFiles.value.push(...files);
    emit('files-uploaded', files);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files);
    uploadedFiles.value.push(...files);
    emit('files-uploaded', files);
  }
};

const removeFile = (fileToRemove: File) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file !== fileToRemove);
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

onBeforeUnmount(() => {
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value);
  }
  if (mediaRecorder.value && isRecording.value) {
    stopRecording();
  }
});
</script>