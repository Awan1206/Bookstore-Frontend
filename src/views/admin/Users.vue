<script setup>
import { useUsersPage } from '@/composables/admin/useUsers'

const {
  // list
  users,
  loading,
  error,
  fetchUsers,
  // search
  search,
  handleSearch,
  clearSearch,
  // pagination
  currentPage,
  lastPage,
  total,
  goToPage,
  // helpers
  formatDate,
  // form dialog
  roles,
  formDialog,
  formData,
  formError,
  submitting,
  nameInputRef,
  openEditDialog,
  closeFormDialog,
  resetFormError,
  handleSubmit,
  // delete dialog
  deleteDialog,
  userToDelete,
  deleting,
  deleteError,
  openDeleteDialog,
  closeDeleteDialog,
  resetDeleteError,
  confirmDelete,
} = useUsersPage()
</script>

<template>
  <div class="p-6 lg:p-8 space-y-8">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">MANAJEMEN</p>
        <h2 class="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">Pengguna</h2>
      </div>
    </div>

    <!-- Error banner -->
    <div
      v-if="error && !loading"
      class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
    >
      <span>{{ error }}</span>
      <button type="button" class="ml-4 font-bold hover:text-red-900" @click="fetchUsers(currentPage)">
        Coba Lagi
      </button>
    </div>

    <!-- Search -->
    <div class="max-w-xs">
      <label class="sr-only" for="user-search">Cari pengguna</label>
      <div class="relative">
        <svg class="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          id="user-search"
          v-model="search"
          type="search"
          placeholder="Cari nama, username, atau email..."
          class="w-full pl-9 pr-8 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          @keyup.enter="handleSearch"
        >
        <button
          v-if="search"
          type="button"
          title="Bersihkan pencarian"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917] transition-colors"
          @click="clearSearch"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#E8E3DA] rounded-2xl overflow-hidden shadow-sm">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-[#E8E3DA] bg-[#F5F2EC]">
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold w-12">
              No
            </th>
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Nama
            </th>
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Username
            </th>
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Email
            </th>
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Role
            </th>
            <th class="text-right px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#F0EBE1]">
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="n in 5" :key="`skeleton-${n}`">
              <td class="px-6 py-4"><div class="h-4 w-6 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-32 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-24 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-40 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-16 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-16 bg-[#F0EBE1] rounded animate-pulse ml-auto"></div></td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="users.length === 0">
            <td colspan="6" class="px-6 py-12 text-center">
              <p class="text-sm text-[#78716C]">
                {{ search ? 'Pengguna tidak ditemukan.' : 'Belum ada pengguna.' }}
              </p>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="(user, index) in users"
            v-else
            :key="user.id"
            class="hover:bg-[#F5F2EC]/60 transition-colors"
          >
            <td class="px-6 py-4 text-[#A8A29E] text-sm tabular-nums">
              {{ (currentPage - 1) * 15 + index + 1 }}
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-[#1C1917]">{{ user.name }}</p>
            </td>
            <td class="px-6 py-4 text-[#44403C]">
              {{ user.username }}
            </td>
            <td class="px-6 py-4 text-[#44403C]">
              {{ user.email }}
            </td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0EBE1] text-[#44403C]"
              >
                {{ user.role?.name ?? '-' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  title="Edit pengguna"
                  class="p-2 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] transition-colors"
                  @click="openEditDialog(user)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  title="Hapus pengguna"
                  class="p-2 rounded-lg text-[#78716C] hover:text-red-700 hover:bg-red-50 transition-colors"
                  @click="openDeleteDialog(user)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="!loading && users.length > 0"
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-[#E8E3DA] bg-[#F5F2EC]"
      >
        <p class="text-xs text-[#78716C]">
          Menampilkan halaman <span class="font-semibold text-[#1C1917]">{{ currentPage }}</span>
          dari <span class="font-semibold text-[#1C1917]">{{ lastPage }}</span>
          ({{ total }} pengguna)
        </p>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            :disabled="currentPage <= 1"
            class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#44403C] bg-white border border-[#E8E3DA] rounded-lg hover:bg-[#F0EBE1] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            @click="goToPage(currentPage - 1)"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            :disabled="currentPage >= lastPage"
            class="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#44403C] bg-white border border-[#E8E3DA] rounded-lg hover:bg-[#F0EBE1] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            @click="goToPage(currentPage + 1)"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog: Edit Pengguna -->
    <dialog
      ref="formDialog"
      class="backdrop:bg-[#1C1917]/40 rounded-2xl border border-[#E8E3DA] shadow-xl w-full max-w-md p-0 m-auto"
      @close="resetFormError"
    >
      <form method="dialog" class="p-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">EDIT PENGGUNA</p>
          <h3 class="text-lg font-serif font-bold text-[#1C1917] mt-0.5">Ubah Pengguna</h3>
        </div>

        <div>
          <label for="user-name" class="block text-xs font-semibold text-[#44403C] mb-1.5">
            Nama
          </label>
          <input
            id="user-name"
            ref="nameInputRef"
            v-model="formData.name"
            type="text"
            placeholder="Nama lengkap"
            class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          >
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="user-username" class="block text-xs font-semibold text-[#44403C] mb-1.5">
              Username
            </label>
            <input
              id="user-username"
              v-model="formData.username"
              type="text"
              placeholder="username"
              class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
            >
          </div>
          <div>
            <label for="user-phone" class="block text-xs font-semibold text-[#44403C] mb-1.5">
              Telepon
            </label>
            <input
              id="user-phone"
              v-model="formData.phone"
              type="text"
              placeholder="08xxxxxxxxxx"
              class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
            >
          </div>
        </div>

        <div>
          <label for="user-email" class="block text-xs font-semibold text-[#44403C] mb-1.5">
            Email
          </label>
          <input
            id="user-email"
            v-model="formData.email"
            type="email"
            placeholder="nama@email.com"
            class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          >
        </div>

        <div>
          <label for="user-role" class="block text-xs font-semibold text-[#44403C] mb-1.5">
            Role
          </label>
          <select
            id="user-role"
            v-model="formData.role_id"
            class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          >
            <option value="">- Pilih Role -</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <div class="pt-2 border-t border-[#F0EBE1]">
          <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] mb-3">
            UBAH PASSWORD (opsional)
          </p>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="user-password" class="block text-xs font-semibold text-[#44403C] mb-1.5">
                Password Baru
              </label>
              <input
                id="user-password"
                v-model="formData.password"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
                class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
              >
            </div>
            <div>
              <label for="user-password-confirmation" class="block text-xs font-semibold text-[#44403C] mb-1.5">
                Konfirmasi
              </label>
              <input
                id="user-password-confirmation"
                v-model="formData.password_confirmation"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
                class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
              >
            </div>
          </div>
        </div>

        <p v-if="formError" class="text-xs text-red-700">
          {{ formError }}
        </p>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
            @click="closeFormDialog"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </dialog>

    <!-- Dialog: Konfirmasi Hapus -->
    <dialog
      ref="deleteDialog"
      class="backdrop:bg-[#1C1917]/40 rounded-2xl border border-[#E8E3DA] shadow-xl w-full max-w-sm p-0 m-auto"
      @close="resetDeleteError"
    >
      <div class="p-6 space-y-4">
        <div>
          <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">KONFIRMASI</p>
          <h3 class="text-lg font-serif font-bold text-[#1C1917] mt-0.5">Hapus Pengguna</h3>
        </div>

        <p class="text-sm text-[#44403C]">
          Yakin ingin menghapus pengguna
          <span class="font-semibold text-[#1C1917]">"{{ userToDelete?.name }}"</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <p v-if="deleteError" class="text-xs text-red-700">{{ deleteError }}</p>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#78716C] hover:text-[#1C1917] transition-colors"
            @click="closeDeleteDialog"
          >
            Batal
          </button>
          <button
            type="button"
            :disabled="deleting"
            class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors disabled:opacity-50"
            @click="confirmDelete"
          >
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </dialog>

  </div>
</template>