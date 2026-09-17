<script setup>
import { useBooksPage } from '@/composables/admin/useBooks'

const {
  books,
  loading,
  error,
  fetchBooks,
  search,
  handleSearch,
  clearSearch,
  meta,
  currentPage,
  lastPage,
  total,
  goToPage,
  formatCurrency,
  categories,
  formDialog,
  formMode,
  formData,
  formError,
  submitting,
  titleInputRef,
  imagePreview,
  handleImageChange,
  removeImage,
  openCreateDialog,
  openEditDialog,
  closeFormDialog,
  resetFormError,
  handleSubmit,
  deleteDialog,
  bookToDelete,
  deleting,
  deleteError,
  openDeleteDialog,
  closeDeleteDialog,
  resetDeleteError,
  confirmDelete,
} = useBooksPage()
</script>

<template>
  <div class="p-6 lg:p-8 space-y-8">

    <!-- Page header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">MANAJEMEN</p>
        <h2 class="text-2xl font-serif font-bold text-[#1C1917] mt-0.5">Buku</h2>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#1C1917] text-white rounded-lg hover:bg-[#8B331A] transition-colors self-start sm:self-auto"
        @click="openCreateDialog"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tambah Buku</span>
      </button>
    </div>

    <!-- Error banner -->
    <div
      v-if="error && !loading"
      class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700"
    >
      <span>{{ error }}</span>
      <button type="button" class="ml-4 font-bold hover:text-red-900" @click="fetchBooks(currentPage)">
        Coba Lagi
      </button>
    </div>

    <!-- Search -->
    <div class="max-w-xs">
      <label class="sr-only" for="book-search">Cari buku</label>
      <div class="relative">
        <svg class="w-4 h-4 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          id="book-search"
          v-model="search"
          type="search"
          placeholder="Cari judul buku..."
          class="w-full pl-9 pr-9 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          @keyup.enter="handleSearch"
        >
        <button
          v-if="search"
          type="button"
          aria-label="Hapus pencarian"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917] transition-colors"
          @click="clearSearch"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading skeleton grid -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div v-for="n in 8" :key="`skeleton-${n}`" class="bg-white border border-[#E8E3DA] rounded-2xl overflow-hidden">
        <div class="aspect-[3/4] bg-[#F0EBE1] animate-pulse"></div>
        <div class="p-4 space-y-2">
          <div class="h-4 w-3/4 bg-[#F0EBE1] rounded animate-pulse"></div>
          <div class="h-3 w-1/2 bg-[#F0EBE1] rounded animate-pulse"></div>
          <div class="h-3 w-1/3 bg-[#F0EBE1] rounded animate-pulse mt-3"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="books.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center"
    >
      <svg class="w-12 h-12 text-[#D6CFC4] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <p class="text-sm text-[#78716C]">
        {{ search ? 'Buku tidak ditemukan.' : 'Belum ada buku. Tambahkan buku pertama.' }}
      </p>
    </div>

    <!-- Card grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="book in books"
        :key="book.id"
        class="bg-white border border-[#E8E3DA] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
      >
        <!-- Book cover -->
        <div class="aspect-[3/4] bg-[#F5F2EC] relative overflow-hidden">
          <img
            v-if="book.image_url"
            :src="book.image_url"
            :alt="book.title"
            class="w-full h-full object-cover"
            loading="lazy"
          >
          <!-- Placeholder when no image -->
          <div v-else class="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
            <svg class="w-10 h-10 text-[#D6CFC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span class="text-[10px] text-[#A8A29E] text-center leading-snug line-clamp-2 font-medium">
              {{ book.title }}
            </span>
          </div>

          <!-- Stock badge -->
          <span
            :class="[
              book.stock > 0 ? 'bg-[#1C1917] text-white' : 'bg-red-600 text-white',
              'absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full'
            ]"
          >
            {{ book.stock > 0 ? `Stok ${book.stock}` : 'Habis' }}
          </span>
        </div>

        <!-- Card body -->
        <div class="p-4 flex flex-col flex-1">
          <!-- Category -->
          <span class="text-[10px] font-semibold text-[#A8A29E] uppercase tracking-wider">
            {{ book.category?.name ?? '-' }}
          </span>

          <!-- Title -->
          <h3 class="text-sm font-bold text-[#1C1917] mt-1 leading-snug line-clamp-2 flex-1">
            {{ book.title }}
          </h3>

          <!-- Year + Price -->
          <div class="mt-3 space-y-1">
            <p class="text-xs text-[#A8A29E]">{{ book.publish_year ?? '-' }}</p>
            <p class="text-sm font-bold text-[#1C1917]">{{ formatCurrency(book.sell_price) }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 mt-4 pt-3 border-t border-[#F0EBE1]">
            <button
              type="button"
              title="Edit buku"
              class="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] rounded-lg transition-colors"
              @click="openEditDialog(book)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              type="button"
              title="Hapus buku"
              class="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#78716C] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              @click="openDeleteDialog(book)"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && books.length > 0"
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
    >
      <p class="text-xs text-[#78716C]">
        Total <span class="font-semibold text-[#1C1917]">{{ total }}</span> buku
      </p>
      <div class="flex items-center gap-1">
        <button
          type="button"
          :disabled="currentPage === 1"
          class="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#E8E3DA] transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Halaman sebelumnya"
          @click="goToPage(currentPage - 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <template v-for="page in lastPage" :key="page">
          <button
            v-if="page === 1 || page === lastPage || Math.abs(page - currentPage) <= 1"
            type="button"
            :class="[
              'min-w-[2rem] h-8 px-2 text-xs font-semibold rounded-lg transition-colors',
              page === currentPage
                ? 'bg-[#1C1917] text-white'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#E8E3DA]'
            ]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <span
            v-else-if="page === currentPage - 2 || page === currentPage + 2"
            class="px-1 text-xs text-[#A8A29E]"
          >…</span>
        </template>

        <button
          type="button"
          :disabled="currentPage === lastPage"
          class="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#E8E3DA] transition-colors disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Halaman berikutnya"
          @click="goToPage(currentPage + 1)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Dialog: Tambah / Edit Buku -->
    <dialog
      ref="formDialog"
      class="backdrop:bg-[#1C1917]/40 rounded-2xl border border-[#E8E3DA] shadow-xl w-full max-w-lg p-0 m-auto"
      @close="resetFormError"
    >
      <form method="dialog" class="p-6 space-y-5" @submit.prevent="handleSubmit">
        <div>
          <p class="text-[10px] font-mono uppercase tracking-widest text-[#A8A29E]">
            {{ formMode === 'create' ? 'BUKU BARU' : 'EDIT BUKU' }}
          </p>
          <h3 class="text-lg font-serif font-bold text-[#1C1917] mt-0.5">
            {{ formMode === 'create' ? 'Tambah Buku' : 'Ubah Buku' }}
          </h3>
        </div>

        <!-- Judul -->
        <div>
          <label for="book-title" class="block text-xs font-semibold text-[#44403C] mb-1.5">
            Judul Buku <span class="text-red-600">*</span>
          </label>
          <input
            id="book-title"
            ref="titleInputRef"
            v-model="formData.title"
            type="text"
            placeholder="contoh: Laskar Pelangi"
            class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
          >
        </div>

        <!-- Kategori + Tahun -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="book-category" class="block text-xs font-semibold text-[#44403C] mb-1.5">
              Kategori
            </label>
            <select
              id="book-category"
              v-model="formData.category_id"
              class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
            >
              <option value="">Pilih kategori</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label for="book-date">Tanggal Terbit</label>
            <input
            id="book-date"
            v-model="formData.publish_date"
            type="date"
            >
          </div>
        </div>

        <!-- Stok + Harga Beli + Harga Jual -->
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label for="book-stock" class="block text-xs font-semibold text-[#44403C] mb-1.5">
              Stok
            </label>
            <input
              id="book-stock"
              v-model.number="formData.stock"
              type="number"
              placeholder="0"
              min="0"
              class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
            >
          </div>
          <div>
            <label for="book-cost" class="block text-xs font-semibold text-[#44403C] mb-1.5">
              Harga Beli
            </label>
            <input
              id="book-cost"
              v-model.number="formData.cost_price"
              type="number"
              placeholder="0"
              min="0"
              class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
            >
          </div>
          <div>
            <label for="book-sell" class="block text-xs font-semibold text-[#44403C] mb-1.5">
              Harga Jual
            </label>
            <input
              id="book-sell"
              v-model.number="formData.sell_price"
              type="number"
              placeholder="0"
              min="0"
              class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors"
            >
          </div>
        </div>

        <!-- Foto Sampul -->
        <div>
          <label class="block text-xs font-semibold text-[#44403C] mb-1.5">Foto Sampul</label>

          <!-- Preview -->
          <div v-if="imagePreview" class="relative mb-2 inline-block">
            <img
              :src="imagePreview"
              alt="Preview sampul"
              class="h-32 w-auto rounded-lg border border-[#E8E3DA] object-cover"
            >
            <button
              type="button"
              aria-label="Hapus gambar"
              class="absolute -top-2 -right-2 bg-white border border-[#E8E3DA] rounded-full p-0.5 text-[#78716C] hover:text-red-700 hover:border-red-300 transition-colors shadow-sm"
              @click="removeImage"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- File input -->
          <label
            class="flex items-center gap-2 w-full px-3 py-2 text-sm border border-dashed border-[#D6CFC4] rounded-lg cursor-pointer hover:border-[#1C1917] hover:bg-[#F5F2EC] transition-colors text-[#78716C]"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{{ imagePreview ? 'Ganti gambar' : 'Pilih gambar' }}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="sr-only"
              @change="handleImageChange"
            >
          </label>
          <p class="mt-1 text-[10px] text-[#A8A29E]">JPG, PNG, atau WebP. Maks 2MB.</p>
        </div>

        <!-- Deskripsi -->
        <div>
          <label for="book-description" class="block text-xs font-semibold text-[#44403C] mb-1.5">
            Deskripsi
          </label>
          <textarea
            id="book-description"
            v-model="formData.description"
            rows="3"
            placeholder="Deskripsi singkat buku..."
            class="w-full px-3 py-2 text-sm bg-white border border-[#E8E3DA] rounded-lg placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-colors resize-none"
          ></textarea>
        </div>

        <!-- Form error -->
        <p v-if="formError" class="text-xs text-red-700">{{ formError }}</p>

        <div class="flex items-center justify-end gap-2 pt-1">
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
          <h3 class="text-lg font-serif font-bold text-[#1C1917] mt-0.5">Hapus Buku</h3>
        </div>

        <p class="text-sm text-[#44403C]">
          Yakin ingin menghapus buku
          <span class="font-semibold text-[#1C1917]">"{{ bookToDelete?.title }}"</span>?
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