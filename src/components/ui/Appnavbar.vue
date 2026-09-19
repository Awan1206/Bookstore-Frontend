<script setup>
import { useChatStore } from '@/stores/chat'

const props = defineProps({
  authStore:         { type: Object, required: true },
  cartStore:         { type: Object, required: true },
  showUserDropdown:  { type: Boolean, required: true },
  showChatDrawer:    { type: Boolean, required: true },
})

const emit = defineEmits([
  'update:showUserDropdown',
  'update:showChatDrawer',
  'toggle-cart',
  'go-to',
  'scroll-to-top',
  'logout',
])

const chatStore = useChatStore()
</script>

<template>
  <header class="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E3DA] transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

      <!-- Logo -->
      <div class="flex items-center space-x-3 cursor-pointer group" @click="emit('scroll-to-top')">
        <div class="w-9 h-9 bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center rounded-sm font-serif font-bold text-lg group-hover:bg-[#8B331A] transition-colors duration-300 shadow-xs">
          F
        </div>
        <div class="flex flex-col">
          <span class="font-serif font-bold text-xl tracking-tight text-[#1C1917]">FOLIO PRESS</span>
          <span class="text-[9px] uppercase tracking-widest text-[#78716C] -mt-1 font-sans">EST. 2024 • PUBLISHING</span>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-[#44403C]">
        <button type="button" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all" @click="emit('go-to', 'landing')">Home</button>
        <button type="button" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all" @click="emit('go-to', 'our-story')">Our Story</button>
        <button type="button" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all" @click="emit('go-to', 'journal')">Journal</button>
        <button type="button" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all" @click="emit('go-to', 'books.index')">Catalog</button>
        <button type="button" class="hover:text-[#8B331A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#8B331A] hover:after:w-full after:transition-all" @click="emit('go-to', 'contact')">Contact</button>
      </nav>

      <!-- Auth Actions -->
      <div class="flex items-center space-x-3">

        <!-- Chat Button (authenticated users only) -->
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          aria-label="Open live chat"
          class="p-2 text-[#44403C] hover:text-[#8B331A] transition-colors relative rounded-full hover:bg-[#EAE5DC]"
          @click="emit('update:showChatDrawer', !showChatDrawer)"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span
            v-if="chatStore.unreadCount > 0"
            class="absolute top-1 right-1 bg-[#8B331A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
          >
            {{ chatStore.unreadCount > 9 ? '9+' : chatStore.unreadCount }}
          </span>
        </button>

        <!-- Cart Icon -->
        <button
          type="button"
          aria-label="Open shopping cart"
          class="p-2 text-[#44403C] hover:text-[#8B331A] transition-colors relative rounded-full hover:bg-[#EAE5DC]"
          @click="emit('toggle-cart')"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span
            v-if="cartStore.count > 0"
            class="absolute top-1 right-1 bg-[#8B331A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
          >
            {{ cartStore.count }}
          </span>
        </button>

        <!-- Logged Out -->
        <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-2">
          <button
            type="button"
            class="px-5 py-2 text-xs font-semibold uppercase tracking-wider bg-[#1C1917] text-[#FAF8F5] rounded-xs hover:bg-[#8B331A] transition-all shadow-xs active:scale-95 flex items-center space-x-2"
            @click="emit('go-to', 'login')"
          >
            <span>Login</span>
          </button>
        </div>

        <!-- Logged In User Pill -->
        <div v-else class="relative">
          <button
            type="button"
            class="flex items-center space-x-2 px-3 py-1.5 bg-[#EAE5DC] hover:bg-[#E2DDD3] rounded-full border border-[#DCD5C9] transition-all"
            @click="emit('update:showUserDropdown', !showUserDropdown)"
          >
            <div class="w-7 h-7 rounded-full bg-[#8B331A] text-white flex items-center justify-center font-bold text-xs">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <span class="text-xs font-medium text-[#1C1917] max-w-[100px] truncate">{{ authStore.user?.name }}</span>
            <svg
              class="w-3.5 h-3.5 text-[#78716C] transition-transform"
              :class="showUserDropdown ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Profile Dropdown -->
          <transition name="fade-slide">
            <div v-if="showUserDropdown" class="absolute right-0 mt-2 w-56 bg-white border border-[#E8E3DA] rounded-lg shadow-xl py-2 z-50">
              <div class="px-4 py-2 border-b border-[#F0EBE1]">
                <p class="text-xs font-semibold text-[#1C1917] truncate">{{ authStore.user?.name }}</p>
                <p class="text-[11px] text-[#78716C] truncate">{{ authStore.user?.email }}</p>
                <span v-if="authStore.isAdmin" class="inline-block mt-1 px-2 py-0.5 bg-[#8B331A]/10 text-[#8B331A] font-bold text-[9px] uppercase tracking-wider rounded">
                  Admin Access
                </span>
              </div>
              <button
                v-if="authStore.isAdmin"
                type="button"
                class="w-full text-left px-4 py-2 text-xs font-bold text-[#8B331A] hover:bg-[#FAF8F5] flex items-center justify-between"
                @click="emit('update:showUserDropdown', false); emit('go-to', 'admin.dashboard')"
              >
                <span>Portal Admin Dashboard</span>
                <span>→</span>
              </button>
              <button
                type="button"
                class="w-full text-left px-4 py-2 text-xs text-[#44403C] hover:bg-[#FAF8F5] hover:text-[#8B331A]"
                @click="emit('update:showUserDropdown', false); emit('go-to', 'books.index')"
              >
                Book Catalog
              </button>
              <button
                type="button"
                class="w-full text-left px-4 py-2 text-xs text-red-700 hover:bg-red-50 flex items-center justify-between"
                @click="emit('logout')"
              >
                <span>Sign Out</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </transition>
        </div>

      </div>
    </div>
  </header>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.15s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>