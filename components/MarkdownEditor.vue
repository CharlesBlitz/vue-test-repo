<template>
  <div class="markdown-editor">
    <!-- Toolbar -->
    <div class="editor-toolbar">
      <!-- Text Formatting -->
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor?.isActive('bold') }"
        class="editor-button"
        type="button"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h6a4 4 0 014 4v.5a4.5 4.5 0 01-2.4 3.99A5 5 0 0115 16v1a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm8 6V7a2 2 0 00-2-2H6v4h3a2 2 0 002-2zm-2 4H6v3h3a2 2 0 000-4z"/>
        </svg>
      </button>
      
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor?.isActive('italic') }"
        class="editor-button"
        type="button"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 4a1 1 0 00-1 1v2H7a1 1 0 000 2h2v6H7a1 1 0 100 2h6a1 1 0 100-2h-2V9h2a1 1 0 100-2h-2V5a1 1 0 00-1-1z"/>
        </svg>
      </button>
      
      <button
        @click="editor?.chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor?.isActive('code') }"
        class="editor-button"
        type="button"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <div class="editor-divider"></div>

      <!-- Headings -->
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
        class="editor-button"
        type="button"
      >
        H1
      </button>
      
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
        class="editor-button"
        type="button"
      >
        H2
      </button>
      
      <button
        @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
        class="editor-button"
        type="button"
      >
        H3
      </button>

      <div class="editor-divider"></div>

      <!-- Lists -->
      <button
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor?.isActive('bulletList') }"
        class="editor-button"
        type="button"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
        </svg>
      </button>
      
      <button
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor?.isActive('orderedList') }"
        class="editor-button"
        type="button"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
        </svg>
      </button>

      <div class="editor-divider"></div>

      <!-- Blockquote -->
      <button
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor?.isActive('blockquote') }"
        class="editor-button"
        type="button"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 6a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 14a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
        </svg>
      </button>

      <!-- Code Block -->
      <button
        @click="editor?.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor?.isActive('codeBlock') }"
        class="editor-button"
        type="button"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <div class="editor-divider"></div>

      <!-- Media -->
      <button
        @click="$emit('upload-file')"
        class="editor-button"
        type="button"
        title="Upload File"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>

      <button
        @click="$emit('record-audio')"
        class="editor-button"
        type="button"
        title="Record Audio"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"/>
        </svg>
      </button>

      <button
        @click="$emit('record-video')"
        class="editor-button"
        type="button"
        title="Record Video"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
        </svg>
      </button>
    </div>

    <!-- Editor -->
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

interface Props {
  modelValue: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start typing your response...'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'upload-file': [];
  'record-audio': [];
  'record-video': [];
}>();

const editor = ref<Editor>();

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: props.modelValue,
    editorProps: {
      attributes: {
        placeholder: props.placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML());
    },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue);
  }
});
</script>