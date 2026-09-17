<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/ui/Sidebar.vue'
import AdminNavbar from '@/components/ui/Navbar.vue'

const sidebarCollapsed = ref(false)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="flex h-screen bg-[#F4F0E8] overflow-hidden font-sans">

    <!-- Sidebar -->
    <AdminSidebar :collapsed="sidebarCollapsed" />

    <!-- Main area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">

      <!-- Top navbar -->
      <AdminNavbar @toggle-sidebar="toggleSidebar" />

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>

    </div>
  </div>
</template>