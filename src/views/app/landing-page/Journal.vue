<script setup>
import AppNavbar from '@/components/ui/AppNavbar.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { ref, computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const showUserDropdown = ref(false)
const showChatDrawer = ref(false)
const activeTag = ref('All')

function goTo(name) {
  if (router.hasRoute(name)) router.push({ name })
  else window.alert('Page not available yet.')
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

const featured = {
  tag: 'Reading',
  date: 'September 2026',
  title: 'Why short story collections are the best thing to read on a commute',
  excerpt: 'A novel asks you to remember where you left off. A short story just asks for twenty minutes. We have been recommending collections to commuters for years — here is what actually works.',
  author: 'Dira Kusuma',
  readTime: '6 min read',
}

const posts = [
  {
    tag: 'New Arrivals',
    date: 'September 2026',
    title: 'Ten books we just put on the shelves',
    excerpt: 'From a debut Indonesian novelist to a reprint of a 1970s travel memoir — what came in this week and why we ordered it.',
    author: 'Folio Team',
    readTime: '4 min read',
  },
  {
    tag: 'Reading',
    date: 'August 2026',
    title: 'Reading in a second language: harder and better than you think',
    excerpt: 'Three of our regulars read every book in English despite Indonesian being their first language. We asked them why.',
    author: 'Reza Mahendra',
    readTime: '7 min read',
  },
  {
    tag: 'Behind the Store',
    date: 'August 2026',
    title: 'How we decide what goes on the shelf',
    excerpt: 'We get asked this a lot. The short answer: someone on the team reads it first. The longer answer involves a whiteboard and occasional disagreements.',
    author: 'Dira Kusuma',
    readTime: '5 min read',
  },
  {
    tag: 'Recommendations',
    date: 'July 2026',
    title: 'If you liked Pachinko, try these five',
    excerpt: 'Multi-generational, emotionally honest, and impossible to put down. The category is bigger than you might think.',
    author: 'Anita Sari',
    readTime: '3 min read',
  },
  {
    tag: 'Recommendations',
    date: 'July 2026',
    title: 'Non-fiction that reads like a novel',
    excerpt: 'There is a small shelf in the back of the store we call the "trick section." Every book on it is technically non-fiction but nobody believes us.',
    author: 'Folio Team',
    readTime: '4 min read',
  },
  {
    tag: 'Behind the Store',
    date: 'June 2026',
    title: 'Six months with the reading room',
    excerpt: 'We opened it in December with four tables and a sign that said "no laptop meetings." Here is what we learned.',
    author: 'Reza Mahendra',
    readTime: '6 min read',
  },
]

const tags = computed(() => ['All', ...new Set(posts.map(p => p.tag))])
const filteredPosts = computed(() =>
  activeTag.value === 'All' ? posts : posts.filter(p => p.tag === activeTag.value)
)
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] text-[#1C1917]">
    <AppNavbar
      :auth-store="authStore"
      :cart-store="cartStore"
      :show-user-dropdown="showUserDropdown"
      :show-chat-drawer="showChatDrawer"
      @update:show-user-dropdown="showUserDropdown = $event"
      @update:show-chat-drawer="showChatDrawer = $event"
      @toggle-cart="() => {}"
      @go-to="goTo"
      @scroll-to-top="scrollToTop"
      @logout="() => {}"
    />

    <!-- PAGE HEADER -->
    <section class="border-b border-[#E8E3DA] py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-medium text-[#78716C] mb-3 tracking-wide">Journal</p>
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <h1 class="font-serif text-4xl sm:text-5xl text-[#1C1917] tracking-tight max-w-lg leading-tight">
            Notes on books, reading, and running a bookstore.
          </h1>
          <p class="text-sm text-[#78716C] max-w-xs leading-relaxed">
            Written by the people who work here. Published when we have something worth saying.
          </p>
        </div>
      </div>
    </section>

    <!-- FEATURED POST -->
    <section class="border-b border-[#E8E3DA]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12">

          <!-- Text -->
          <div class="lg:col-span-7 py-16 lg:pr-16 lg:border-r border-[#E8E3DA] flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 mb-8">
                <span class="text-[11px] font-medium text-[#8B331A] bg-[#8B331A]/8 px-2.5 py-1 rounded-full">{{ featured.tag }}</span>
                <span class="text-xs text-[#A8A29E]">{{ featured.date }}</span>
                <span class="text-xs text-[#A8A29E]">{{ featured.readTime }}</span>
              </div>
              <h2 class="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1917] leading-tight tracking-tight">
                {{ featured.title }}
              </h2>
              <p class="mt-6 text-base text-[#57534E] leading-relaxed max-w-xl">
                {{ featured.excerpt }}
              </p>
            </div>
            <div class="mt-10 flex items-center justify-between">
              <span class="text-sm text-[#44403C] font-medium">{{ featured.author }}</span>
              <button type="button" class="text-xs font-semibold text-[#1C1917] hover:text-[#8B331A] transition-colors underline underline-offset-4">
                Read
              </button>
            </div>
          </div>

          <!-- Visual accent -->
          <div class="hidden lg:flex lg:col-span-5 items-center justify-center bg-[#F4F0E8] px-16">
            <div class="text-center">
              <div class="font-serif text-8xl text-[#E8E3DA] select-none leading-none">"</div>
              <p class="font-serif text-lg italic text-[#78716C] mt-2 leading-relaxed">
                A short story just asks for twenty minutes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- FILTER + GRID -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-12">
          <button
            v-for="tag in tags"
            :key="tag"
            type="button"
            class="px-4 py-1.5 rounded-full text-xs font-medium transition-all border"
            :class="activeTag === tag
              ? 'bg-[#1C1917] text-white border-[#1C1917]'
              : 'bg-white text-[#44403C] border-[#E8E3DA] hover:border-[#1C1917]'"
            @click="activeTag = tag"
          >
            {{ tag }}
          </button>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <article
            v-for="post in filteredPosts"
            :key="post.title"
            class="group flex flex-col"
          >
            <!-- Colored top bar instead of a card shadow -->
            <div class="h-0.5 w-12 bg-[#8B331A] mb-5 group-hover:w-full transition-all duration-300"></div>

            <div class="flex items-center gap-3 mb-3">
              <span class="text-[11px] font-medium text-[#8B331A]">{{ post.tag }}</span>
              <span class="text-[11px] text-[#A8A29E]">{{ post.date }}</span>
            </div>

            <h3 class="font-serif text-xl text-[#1C1917] leading-snug mb-3 group-hover:text-[#8B331A] transition-colors">
              {{ post.title }}
            </h3>

            <p class="text-sm text-[#57534E] leading-relaxed flex-1">
              {{ post.excerpt }}
            </p>

            <div class="mt-5 flex items-center justify-between pt-4 border-t border-[#F0EBE1]">
              <span class="text-xs text-[#78716C]">{{ post.author }} · {{ post.readTime }}</span>
              <button type="button" class="text-xs font-semibold text-[#1C1917] hover:text-[#8B331A] transition-colors">
                Read →
              </button>
            </div>
          </article>
        </div>

      </div>
    </section>

    <AppFooter />
  </div>
</template>