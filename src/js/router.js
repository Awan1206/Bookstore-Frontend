// src/js/router.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ── Public (guest) ────────────────────────────────────────────────
  // Bisa diakses tanpa login. Tidak perlu meta.requiresAuth.
  {
    path: '/',
    name: 'landing',
    component: () => import('@/views/landing-page/LandingPage.vue')
  },
  // {
  //   path: '/blog',
  //   name: 'blog',
  //   component: () => import('@/views/Blog.vue')
  // },
  // {
  //   path: '/contact',
  //   name: 'contact',
  //   component: () => import('@/views/Contact.vue')
  // },
  // {
  //   path: '/books',
  //   name: 'books.index',
  //   component: () => import('@/views/books/BookCatalog.vue')
  // },
  // {
  //   path: '/books/:id',
  //   name: 'books.show',
  //   component: () => import('@/views/books/BookDetail.vue')
  // },

  // ── Guest-only (tidak boleh diakses jika sudah login) ───────────────
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { guestOnly: true }
  },

  // // ── User (butuh login, role: user) ──────────────────────────────────
  // {
  //   path: '/cart',
  //   name: 'cart',
  //   component: () => import('@/views/user/Cart.vue'),
  //   meta: { requiresAuth: true, role: 'user' }
  // },
  // {
  //   path: '/orders',
  //   name: 'orders.index',
  //   component: () => import('@/views/user/OrderList.vue'),
  //   meta: { requiresAuth: true, role: 'user' }
  // },
  // {
  //   path: '/chat',
  //   name: 'chat',
  //   component: () => import('@/views/user/Chat.vue'),
  //   meta: { requiresAuth: true, role: 'user' }
  // },

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
  //     {
  //       path: 'chats',
  //       name: 'admin.chats',
  //       component: () => import('@/views/admin/ChatManagement.vue')
  //     }
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