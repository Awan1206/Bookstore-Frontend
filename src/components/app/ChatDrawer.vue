<script setup>
import { watch } from 'vue'
import { useUserChat } from '@/composables/app/chat/useUserChat'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const {
  messages,
  loadingMessages,
  messagesError,
  messageListRef,
  fetchMessages,
  newMessage,
  sending,
  sendError,
  sendMessage,
  isOwnMessage,
  formatTime,
} = useUserChat()

// Scroll to bottom when drawer opens
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      chatStore.reset()  // ✅ reset badge saat drawer dibuka
      if (messages.value.length === 0) fetchMessages()
    }
  },
)
</script>

<template>
  <Transition name="chat-drawer">
    <div
      v-if="open"
      class="fixed bottom-20 right-4 sm:right-6 z-50 w-[22rem] max-w-[calc(100vw-2rem)] flex flex-col bg-white border border-[#E8E3DA] rounded-2xl shadow-2xl overflow-hidden"
      style="height: 28rem;"
    >
      <!-- Header -->
      <header class="shrink-0 h-14 px-4 flex items-center justify-between bg-[#1C1917] text-white">
        <div class="flex items-center gap-2.5">
          <!-- Admin avatar -->
          <div class="w-8 h-8 rounded-full bg-[#8B331A] flex items-center justify-center font-bold text-xs shrink-0">
            F
          </div>
          <div>
            <p class="text-sm font-semibold leading-none">Folio Press</p>
            <p class="text-[10px] text-white/60 mt-0.5">Tim Dukungan</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Tutup chat"
          class="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          @click="emit('close')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <!-- Error banner -->
      <div
        v-if="messagesError"
        class="shrink-0 px-4 py-2 text-xs text-red-700 bg-red-50 border-b border-red-200 flex items-center justify-between"
      >
        <span>{{ messagesError }}</span>
        <button type="button" class="font-bold hover:text-red-900 ml-2" @click="fetchMessages">
          Coba Lagi
        </button>
      </div>

      <!-- Message list -->
      <div ref="messageListRef" class="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 bg-[#FAF8F4]">

        <!-- Loading skeleton -->
        <template v-if="loadingMessages && messages.length === 0">
          <div class="flex justify-start">
            <div class="h-9 w-40 bg-[#F0EBE1] rounded-2xl animate-pulse"></div>
          </div>
          <div class="flex justify-end">
            <div class="h-9 w-32 bg-[#F0EBE1] rounded-2xl animate-pulse"></div>
          </div>
          <div class="flex justify-start">
            <div class="h-9 w-48 bg-[#F0EBE1] rounded-2xl animate-pulse"></div>
          </div>
        </template>

        <!-- Empty state -->
        <div
          v-else-if="messages.length === 0"
          class="h-full flex flex-col items-center justify-center text-center py-6"
        >
          <svg class="w-10 h-10 text-[#D6CFC4] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-xs text-[#78716C] max-w-[16rem]">
            Belum ada pesan. Kirim pertanyaan Anda — tim kami siap membantu.
          </p>
        </div>

        <!-- Messages -->
        <template v-else>
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['flex', isOwnMessage(msg) ? 'justify-end' : 'justify-start']"
          >
            <!-- Admin avatar on received messages -->
            <div
              v-if="!isOwnMessage(msg)"
              class="w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mr-1.5 mt-auto mb-0.5"
              aria-hidden="true"
            >
              F
            </div>

            <div
              :class="[
                isOwnMessage(msg)
                  ? 'bg-[#1C1917] text-white rounded-br-sm'
                  : 'bg-white border border-[#E8E3DA] text-[#1C1917] rounded-bl-sm',
                'max-w-[80%] px-3 py-2 rounded-2xl'
              ]"
            >
              <p class="text-sm whitespace-pre-wrap break-words leading-snug">{{ msg.message }}</p>
              <p :class="[isOwnMessage(msg) ? 'text-white/50' : 'text-[#A8A29E]', 'text-[9px] mt-1 text-right']">
                {{ formatTime(msg.created_at) }}
              </p>
            </div>
          </div>
        </template>
      </div>

      <!-- Send error -->
      <p v-if="sendError" class="shrink-0 px-4 py-1 text-[11px] text-red-700 bg-red-50 border-t border-red-100">
        {{ sendError }}
      </p>

      <!-- Composer -->
      <form
        class="shrink-0 border-t border-[#E8E3DA] bg-white p-2.5 flex items-end gap-2"
        @submit.prevent="sendMessage"
      >
        <label class="sr-only" for="user-chat-message">Tulis pesan</label>
        <textarea
          id="user-chat-message"
          v-model="newMessage"
          rows="1"
          placeholder="Tulis pesan..."
          class="flex-1 resize-none px-3 py-2 text-sm bg-[#F5F2EC] border border-[#E8E3DA] rounded-xl placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors max-h-28"
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>
        <button
          type="submit"
          :disabled="sending || !newMessage.trim()"
          aria-label="Kirim pesan"
          class="inline-flex items-center justify-center w-9 h-9 shrink-0 bg-[#1C1917] text-white rounded-xl hover:bg-[#8B331A] transition-colors disabled:opacity-40"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  </Transition>
</template>

<style scoped>
.chat-drawer-enter-active,
.chat-drawer-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.chat-drawer-enter-from,
.chat-drawer-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.97);
}
</style>