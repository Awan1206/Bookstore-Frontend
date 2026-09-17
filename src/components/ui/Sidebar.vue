<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  {
    label: 'Dashboard',
    name: 'admin.dashboard',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    label: 'Book',
    name: 'admin.books',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    label: 'Category',
    name: 'admin.categories',
    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z'
  },
  {
    label: 'Pengguna',
    name: 'admin.users',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    label: 'Kasir',
    name: 'admin.cashier',
    icon: 'M9 7H7a2 2 0 00-2 2v9a2 2 0 002 2h10a2 2 0 002-2V9a2 2 0 00-2-2h-2M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7h6M9 12h.01M13 12h.01M9 16h.01M13 16h.01'
  },
  {
    label: 'Pesanan',
    name: 'admin.orders',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    badge: null
  },
  {
    label: 'Live Chat',
    name: 'admin.chats',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    badge: null
  },
]

const availableNavItems = computed(() =>
  navItems.filter(item => router.hasRoute(item.name))
)

function isActive(name) {
  return route.name === name
}
</script>

<template>
  <aside
    :class="[
      collapsed ? 'w-16' : 'w-56',
      'h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shrink-0 sticky top-0'
    ]"
  >
    <!-- Logo -->
    <div
      :class="[
        collapsed ? 'justify-center px-0' : 'px-5',
        'h-16 flex items-center border-b border-gray-100 shrink-0'
      ]"
    >
      <div class="w-8 h-8 bg-[#1C1917] text-white flex items-center justify-center rounded-lg font-serif font-bold text-sm shrink-0">
        F
      </div>
      <transition name="fade-text">
        <div v-if="!collapsed" class="ml-3 overflow-hidden">
          <span class="font-semibold text-sm text-[#1C1917] tracking-tight block leading-none">Folio Press</span>
          <span class="text-[10px] text-gray-400 mt-0.5 block">Admin Portal</span>
        </div>
      </transition>
    </div>

    <!-- Nav Items -->
    <nav class="flex-1 py-3 overflow-y-auto overflow-x-hidden">
      <ul class="space-y-0.5 px-3">
        <li v-for="item in availableNavItems" :key="item.name">
          <RouterLink
            :to="{ name: item.name }"
            :title="collapsed ? item.label : ''"
            :class="[
              isActive(item.name)
                ? 'bg-red-50 text-[#1C1917]'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
              collapsed ? 'justify-center px-0' : 'px-3',
              'flex items-center gap-3 h-10 rounded-lg transition-all duration-150 group relative'
            ]"
          >
            <svg
              class="w-5 h-5 shrink-0"
              :class="isActive(item.name) ? 'text-[#1C1917]' : 'text-gray-400 group-hover:text-gray-600'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" :d="item.icon" />
            </svg>

            <transition name="fade-text">
              <span v-if="!collapsed" class="text-sm font-medium truncate flex-1">
                {{ item.label }}
              </span>
            </transition>

            <!-- Badge -->
            <transition name="fade-text">
              <span
                v-if="!collapsed && item.badge"
                class="ml-auto text-[11px] font-semibold bg-[#8B331A] text-white rounded-full px-2 py-0.5 leading-none"
              >
                {{ item.badge }}
              </span>
            </transition>

            <!-- Tooltip saat collapsed -->
            <div
              v-if="collapsed"
              class="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1C1917] text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-xl z-50"
            >
              {{ item.label }}
            </div>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- User Info + Logout -->
    <div class="border-t border-gray-100 p-3 shrink-0">
      <div
        :class="[
          collapsed ? 'justify-center' : '',
          'flex items-center gap-3'
        ]"
      >
        <!-- Avatar -->
        <div class="w-8 h-8 rounded-full bg-[#1C1917] text-white flex items-center justify-center font-bold text-xs shrink-0">
          {{ authStore.user?.name?.charAt(0).toUpperCase() ?? 'A' }}
        </div>

        <transition name="fade-text">
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <p class="text-xs font-semibold text-[#1C1917] truncate leading-none">{{ authStore.user?.name }}</p>
            <p class="text-[10px] text-gray-400 truncate mt-0.5">{{ authStore.user?.email }}</p>
          </div>
        </transition>

        <transition name="fade-text">
          <button
            v-if="!collapsed"
            type="button"
            title="Logout"
            class="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            @click="authStore.logout()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </transition>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.fade-text-enter-active,
.fade-text-leave-active {
  transition: opacity 0.15s ease;
}
.fade-text-enter-from,
.fade-text-leave-to {
  opacity: 0;
}
</style>