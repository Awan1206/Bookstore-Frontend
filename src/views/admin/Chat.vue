<script setup>
import { useChatPage } from '@/composables/admin/useChat'

const {
  conversations,
  loadingConversations,
  conversationsError,
  fetchConversations,
  search,
  filteredConversations,
  activeConversation,
  messages,
  loadingMessages,
  messagesError,
  messageListRef,
  selectConversation,
  newMessage,
  sending,
  sendError,
  sendMessage,
  isOwnMessage,
  formatTime,
} = useChatPage()
</script>

<template>
  <div class="h-[calc(100vh-4rem)] flex overflow-hidden">

    <!-- Conversation list -->
    <aside class="w-72 shrink-0 border-r border-[#E8E3DA] bg-white flex flex-col">
      <div class="p-4 border-b border-[#E8E3DA]">
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">LIVE CHAT</p>
        <h2 class="text-lg font-serif font-bold text-[#1C1917] mt-0.5">Percakapan</h2>

        <div class="relative mt-3">
          <svg class="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <label class="sr-only" for="chat-search">Cari percakapan</label>
          <input
            id="chat-search"
            v-model="search"
            type="search"
            placeholder="Cari pelanggan..."
            class="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F2EC] border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          >
        </div>
      </div>

      <!-- Error -->
      <div v-if="conversationsError" class="p-4 text-xs text-red-700 bg-red-50 border-b border-red-200 flex items-center justify-between">
        <span>{{ conversationsError }}</span>
        <button type="button" class="font-bold hover:text-red-900" @click="fetchConversations">Coba Lagi</button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loadingConversations && conversations.length === 0" class="p-4 space-y-3">
        <div v-for="n in 5" :key="`conv-skeleton-${n}`" class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#F0EBE1] animate-pulse shrink-0"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 w-2/3 bg-[#F0EBE1] rounded animate-pulse"></div>
            <div class="h-2.5 w-1/2 bg-[#F0EBE1] rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!loadingConversations && filteredConversations.length === 0"
        class="flex-1 flex flex-col items-center justify-center text-center p-6"
      >
        <svg class="w-10 h-10 text-[#D6CFC4] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm text-[#78716C]">
          {{ search ? 'Percakapan tidak ditemukan.' : 'Belum ada percakapan masuk.' }}
        </p>
      </div>

      <!-- List -->
      <ul v-else class="flex-1 overflow-y-auto">
        <li v-for="conv in filteredConversations" :key="conv.user.id">
          <button
            type="button"
            :class="[
              activeConversation?.user?.id === conv.user.id ? 'bg-red-50' : 'hover:bg-[#F5F2EC]',
              'w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[#F0EBE1] transition-colors'
            ]"
            @click="selectConversation(conv)"
          >
            <div class="w-10 h-10 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-bold text-xs shrink-0">
              {{ conv.user?.name?.charAt(0).toUpperCase() ?? '?' }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-semibold text-[#1C1917] truncate">{{ conv.user?.name }}</p>
                <span v-if="conv.last_message_at" class="text-[10px] text-[#A8A29E] shrink-0">
                  {{ formatTime(conv.last_message_at) }}
                </span>
              </div>
              <div class="flex items-center justify-between gap-2 mt-0.5">
                <p class="text-xs text-[#78716C] truncate">{{ conv.last_message ?? 'Belum ada pesan' }}</p>
                <span
                  v-if="conv.unread_count"
                  class="ml-auto text-[10px] font-semibold bg-[#8B331A] text-white rounded-full px-1.5 py-0.5 leading-none shrink-0"
                >
                  {{ conv.unread_count }}
                </span>
              </div>
            </div>
          </button>
        </li>
      </ul>
    </aside>

    <!-- Thread -->
    <section class="flex-1 flex flex-col min-w-0 bg-[#FAF8F4]">

      <!-- No conversation selected -->
      <div v-if="!activeConversation" class="flex-1 flex flex-col items-center justify-center text-center p-6">
        <svg class="w-12 h-12 text-[#D6CFC4] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p class="text-sm text-[#78716C]">Pilih percakapan untuk mulai membalas pesan.</p>
      </div>

      <template v-else>
        <!-- Thread header -->
        <header class="h-16 shrink-0 px-5 flex items-center gap-3 border-b border-[#E8E3DA] bg-white">
          <div class="w-9 h-9 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {{ activeConversation.user?.name?.charAt(0).toUpperCase() ?? '?' }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-[#1C1917] truncate leading-none">{{ activeConversation.user?.name }}</p>
            <p class="text-[11px] text-[#78716C] truncate mt-0.5">{{ activeConversation.user?.email }}</p>
          </div>
        </header>

        <!-- Messages error -->
        <div v-if="messagesError" class="px-5 py-2 text-xs text-red-700 bg-red-50 border-b border-red-200 flex items-center justify-between">
          <span>{{ messagesError }}</span>
          <button type="button" class="font-bold hover:text-red-900" @click="selectConversation(activeConversation)">
            Coba Lagi
          </button>
        </div>

        <!-- Message list -->
        <div ref="messageListRef" class="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          <div v-if="loadingMessages && messages.length === 0" class="space-y-3">
            <div
              v-for="n in 4"
              :key="`msg-skeleton-${n}`"
              :class="['h-10 w-2/3 bg-[#F0EBE1] rounded-2xl animate-pulse', n % 2 === 0 ? 'ml-auto' : '']"
            ></div>
          </div>

          <p v-else-if="messages.length === 0" class="text-center text-xs text-[#A8A29E] py-8">
            Belum ada pesan. Mulai percakapan dengan {{ activeConversation.user?.name }}.
          </p>

          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="['flex', isOwnMessage(msg) ? 'justify-end' : 'justify-start']"
          >
            <div
              :class="[
                isOwnMessage(msg)
                  ? 'bg-[#1C1917] text-white rounded-br-sm'
                  : 'bg-white border border-[#E8E3DA] text-[#1C1917] rounded-bl-sm',
                'max-w-[75%] px-3.5 py-2 rounded-2xl'
              ]"
            >
              <p class="text-sm whitespace-pre-wrap break-words">{{ msg.message }}</p>
              <p :class="[isOwnMessage(msg) ? 'text-white/60' : 'text-[#A8A29E]', 'text-[10px] mt-1 text-right']">
                {{ formatTime(msg.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Composer -->
        <form class="shrink-0 border-t border-[#E8E3DA] bg-white p-3 flex items-end gap-2" @submit.prevent="sendMessage">
          <label class="sr-only" for="chat-message">Tulis pesan</label>
          <textarea
            id="chat-message"
            v-model="newMessage"
            rows="1"
            placeholder="Tulis balasan..."
            class="flex-1 resize-none px-3.5 py-2.5 text-sm bg-[#F5F2EC] border border-[#E8E3DA] rounded-xl placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors max-h-32"
            @keydown.enter.exact.prevent="sendMessage"
          ></textarea>
          <button
            type="submit"
            :disabled="sending || !newMessage.trim()"
            class="inline-flex items-center justify-center w-10 h-10 shrink-0 bg-[#1C1917] text-white rounded-xl hover:bg-[#8B331A] transition-colors disabled:opacity-50"
            aria-label="Kirim pesan"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        <p v-if="sendError" class="shrink-0 px-5 pb-2 text-xs text-red-700 bg-white">{{ sendError }}</p>
      </template>
    </section>
  </div>
</template>