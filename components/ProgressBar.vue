<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-gray-700">{{ title }}</span>
      <span class="text-sm text-gray-500">{{ current }} / {{ total }}</span>
    </div>
    <div class="progress-bar">
      <div 
        class="progress-bar-fill"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
    <div class="mt-1 text-xs text-gray-500">{{ percentage }}% complete</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  current: number;
  total: number;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Progress'
});

const percentage = computed(() => {
  if (props.total === 0) return 0;
  return Math.round((props.current / props.total) * 100);
});
</script>