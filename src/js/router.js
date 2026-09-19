// src/js/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ── Public (guest) ────────────────────────────────────────────────
  // Bisa diakses tanpa login. Tidak perlu meta.requiresAuth.
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/app/landing-page/LandingPage.vue')
  },
  {
    path: '/our-story',
    name: 'our-story',
    component: () => import('@/views/app/landing-page/OurStory.vue')
  },
  {
    path: '/journal',
    name: 'journal',
    component: () => import('@/views/app/landing-page/Journal.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/app/landing-page/Contact.vue')
  },
  {
    path: '/books',
    name: 'books.index',
    component: () => import('@/views/app/books/ExploreBooks.vue')
  },
  {
    path: '/books/:id',
    name: 'books.show',
    component: () => import('@/views/app/books/BookDetail.vue')
  },

  // ── Guest-only (tidak boleh diakses jika sudah login) ───────────────
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/app/auth/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/views/app/auth/ForgotPassword.vue'),
    meta: { guestOnly: true }
  },

  // ── Admin (butuh login, role: admin) ────────────────────────────────
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'books',
        name: 'admin.books',
        component: () => import('@/views/admin/Books.vue')
      },
      {
        path: 'categories',
        name: 'admin.categories',
        component: () => import('@/views/admin/Category.vue')
      },
      {
        path: 'users',
        name: 'admin.users',
        component: () => import('@/views/admin/Users.vue')
      },
      {
        path: 'reports',
        name: 'admin.reports',
        component: () => import('@/views/admin/Report.vue')
      },
      {
        path: 'cashier',
        name: 'admin.cashier',
        component: () => import('@/views/admin/Cashier.vue')
      },
      {
        path: 'chats',
        name: 'admin.chats',
        component: () => import('@/views/admin/Chat.vue')
      }
    ]
  },

  // ── Fallback ─────────────────────────────────────────────────────
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'not-found',
  //   component: () => import('@/views/NotFound.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Tentukan halaman "home" masing-masing role setelah login/redirect.
function homeRouteFor(authStore) {
  if (authStore.isAdmin) return { name: 'admin.dashboard' }
  return { name: 'landing' }
}

router.beforeEach((to) => {
  const authStore = useAuthStore()

  // 1. Guest-only (login page) tapi sudah login
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return homeRouteFor(authStore)
  }

  // 2. Butuh login tapi belum authenticated
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // 3. Butuh role tertentu tapi role tidak cocok
  // Hanya block jika sudah authenticated (token ada) tapi role salah
  if (to.meta.role && authStore.isAuthenticated && authStore.role !== null && authStore.role !== to.meta.role) {
    return homeRouteFor(authStore)
  }
})

export default router