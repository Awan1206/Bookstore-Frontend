<script setup>
import { useCategoriesPage } from '@/composables/admin/useCategories'

const {
  loading,
  error,
  search,
  filteredCategories,
  formatDate,
  fetchCategories,
  formDialog,
  formMode,
  nameInput,
  nameInputRef,
  formError,
  submitting,
  openCreateDialog,
  openEditDialog,
  closeFormDialog,
  resetFormError,
  handleSubmit,
  deleteDialog,
  categoryToDelete,
  deleting,
  deleteError,
  openDeleteDialog,
  closeDeleteDialog,
  resetDeleteError,
  confirmDelete,
} = useCategoriesPage()
</script>

<template>
  <div class="p-6 lg:p-8 space-y-8">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">MANAJEMEN</p>
        <h2 class="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">Kategori</h2>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors self-start sm:self-auto"
        @click="openCreateDialog"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tambah Kategori</span>
      </button>
    </div>

    <!-- Error banner -->
    <div
      v-if="error && !loading"
      class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
    >
      <span>{{ error }}</span>
      <button type="button" class="ml-4 font-bold hover:text-red-900" @click="fetchCategories">
        Coba Lagi
      </button>
    </div>

    <!-- Search -->
    <div class="max-w-xs">
      <label class="sr-only" for="category-search">Cari kategori</label>
      <div class="relative">
        <svg class="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          id="category-search"
          v-model="search"
          type="search"
          placeholder="Cari nama kategori..."
          class="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
        >
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
              Category Name
            </th>
            <th class="text-left px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Books Total
            </th>
            <th class="text-right px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-[#A8A29E] font-semibold">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#F0EBE1]">
          <!-- Loading skeleton -->
          <template v-if="loading">
            <tr v-for="n in 4" :key="`skeleton-${n}`">
              <td class="px-6 py-4"><div class="h-4 w-6 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-32 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-16 bg-[#F0EBE1] rounded animate-pulse"></div></td>
              <td class="px-6 py-4"><div class="h-4 w-16 bg-[#F0EBE1] rounded animate-pulse ml-auto"></div></td>
            </tr>
          </template>

          <!-- Empty state -->
          <tr v-else-if="filteredCategories.length === 0">
            <td colspan="4" class="px-6 py-12 text-center">
              <p class="text-sm text-[#78716C]">
                {{ search ? 'Kategori tidak ditemukan.' : 'Belum ada kategori. Tambahkan kategori pertama.' }}
              </p>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="(category, index) in filteredCategories"
            v-else
            :key="category.id"
            class="hover:bg-[#F5F2EC]/60 transition-colors"
          >
            <td class="px-6 py-4 text-[#A8A29E] text-sm tabular-nums">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-[#1C1917]">{{ category.name }}</p>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  category.books_count > 0
                    ? 'bg-[#1C1917] text-white'
                    : 'bg-[#F0EBE1] text-[#78716C]',
                  'inline-flex items-center justify-center min-w-[1.75rem] px-2 py-0.5 rounded-full text-[11px] font-semibold'
                ]"
              >
                {{ category.books_count }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  title="Edit kategori"
                  class="p-2 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] transition-colors"
                  @click="openEditDialog(category)"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  :disabled="category.books_count > 0"
                  :title="category.books_count > 0 ? 'Tidak bisa dihapus, kategori masih memiliki buku' : 'Hapus kategori'"
                  class="p-2 rounded-lg text-[#78716C] hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  @click="openDeleteDialog(category)"
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
    </div>

    <!-- Dialog: Tambah / Edit Kategori -->
    <dialog
      ref="formDialog"
      class="backdrop:bg-[#1C1917]/40 rounded-2xl border border-[#E8E3DA] shadow-xl w-full max-w-sm p-0 m-auto"
      @close="resetFormError"
    >
      <form method="dialog" class="p-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">
            {{ formMode === 'create' ? 'KATEGORI BARU' : 'EDIT KATEGORI' }}
          </p>
          <h3 class="text-lg font-serif font-bold text-[#1C1917] mt-0.5">
            {{ formMode === 'create' ? 'Tambah Kategori' : 'Ubah Kategori' }}
          </h3>
        </div>

        <div>
          <label for="category-name" class="block text-xs font-semibold text-[#44403C] mb-1.5">
            Nama Kategori
          </label>
          <input
            id="category-name"
            ref="nameInputRef"
            v-model="nameInput"
            type="text"
            placeholder="contoh: Fiksi Ilmiah"
            :aria-describedby="formError ? 'category-name-error' : undefined"
            class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          >
          <p v-if="formError" id="category-name-error" class="mt-1.5 text-xs text-red-700">
            {{ formError }}
          </p>
        </div>

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
          <h3 class="text-lg font-serif font-bold text-[#1C1917] mt-0.5">Hapus Kategori</h3>
        </div>

        <p class="text-sm text-[#44403C]">
          Yakin ingin menghapus kategori
          <span class="font-semibold text-[#1C1917]">"{{ categoryToDelete?.name }}"</span>?
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