<script setup>
import AppNavbar from '@/components/ui/AppNavbar.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const showUserDropdown = ref(false)
const showChatDrawer = ref(false)

function goTo(name) {
  if (router.hasRoute(name)) router.push({ name })
  else window.alert('Page not available yet.')
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

const milestones = [
  {
    year: '2019',
    title: 'A corner, a shelf, and 200 books',
    body: 'Folio Press started as a weekend stall at Pasar Santa. Two friends, a folding table, and a crate of secondhand novels. We sold out by noon and came back the next Saturday.',
  },
  {
    year: '2020',
    title: 'The website goes up',
    body: 'Lockdown pushed us online. We built a simple store, photographed every book on the living room floor, and shipped orders in recycled grocery bags. It was not pretty, but it worked.',
  },
  {
    year: '2021',
    title: 'Our first proper space',
    body: 'We signed a lease on a 40-square-metre shop in Kemang. Second-hand shelving, a secondhand espresso machine, and a strict rule: every book on the shelf is one we have actually read.',
  },
  {
    year: '2022',
    title: 'The buyer program',
    body: 'We started working with local publishers directly — buying in small quantities, paying fairly, and giving readers access to titles that never reach the big chains.',
  },
  {
    year: '2023',
    title: 'Memberships and the reading room',
    body: 'We converted the back of the shop into a quiet reading room open to members. No Wi-Fi, no music. Just tables, good lighting, and a coffee counter that stays open until we close.',
  },
  {
    year: '2024',
    title: 'This catalog',
    body: 'We rebuilt the online store properly. Every title you see here has been chosen by hand. If it is on this site, someone on our team has read it and thinks it is worth your time.',
  },
]

const values = [
  {
    title: 'We read what we sell',
    body: 'No algorithm, no bulk buy. Every book on our shelves has been read by at least one person on our team before it goes up.',
  },
  {
    title: 'Small publishers first',
    body: 'Big titles find their audience on their own. We spend our energy finding books from smaller publishers that would otherwise go unnoticed.',
  },
  {
    title: 'Fair prices, fair pay',
    body: 'We do not discount to compete. We price books fairly so we can pay publishers fairly and keep the lights on.',
  },
]
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

    <!-- HERO -->
    <section class="border-b border-[#E8E3DA]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12">

          <!-- Left: label + headline -->
          <div class="lg:col-span-7 py-20 lg:py-28 lg:border-r border-[#E8E3DA] lg:pr-16">
            <p class="text-xs font-medium text-[#78716C] mb-6 tracking-wide">Our Story</p>
            <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl text-[#1C1917] leading-[1.05] tracking-tight">
              We started selling books because we couldn't stop buying them.
            </h1>
          </div>

          <!-- Right: intro text -->
          <div class="lg:col-span-5 py-20 lg:py-28 lg:pl-16 flex flex-col justify-end">
            <p class="text-base text-[#57534E] leading-relaxed max-w-sm">
              Folio Press is an independent bookstore based in Jakarta. We carry fiction, non-fiction, essays, and poetry — chosen by hand, sold without fuss.
            </p>
            <p class="text-base text-[#57534E] leading-relaxed max-w-sm mt-4">
              We are not trying to be the biggest bookstore. We are trying to be a good one.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- PULL STAT ROW -->
    <section class="border-b border-[#E8E3DA] bg-[#F4F0E8]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-3 divide-x divide-[#E8E3DA]">
          <div class="py-10 px-8 text-center">
            <span class="block font-serif text-4xl font-bold text-[#1C1917]">2,400+</span>
            <span class="block text-xs text-[#78716C] mt-1">titles in stock</span>
          </div>
          <div class="py-10 px-8 text-center">
            <span class="block font-serif text-4xl font-bold text-[#1C1917]">60+</span>
            <span class="block text-xs text-[#78716C] mt-1">publishers we work with</span>
          </div>
          <div class="py-10 px-8 text-center">
            <span class="block font-serif text-4xl font-bold text-[#1C1917]">5 yrs</span>
            <span class="block text-xs text-[#78716C] mt-1">in business</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TIMELINE -->
    <section class="py-24 border-b border-[#E8E3DA]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 class="font-serif text-2xl text-[#1C1917] mb-16">How we got here</h2>

        <div class="space-y-0">
          <div
            v-for="(m, i) in milestones"
            :key="m.year"
            class="grid grid-cols-12 gap-6 group"
          >
            <!-- Year -->
            <div class="col-span-2 sm:col-span-1 pt-8 pb-8">
              <span class="font-mono text-sm text-[#A8A29E]">{{ m.year }}</span>
            </div>

            <!-- Line -->
            <div class="col-span-1 relative flex flex-col items-center">
              <div class="w-px bg-[#E8E3DA] absolute top-0 bottom-0"></div>
              <div class="w-2 h-2 rounded-full bg-[#8B331A] mt-9 relative z-10 shrink-0"></div>
            </div>

            <!-- Content -->
            <div
              class="col-span-9 sm:col-span-10 py-8"
              :class="i < milestones.length - 1 ? 'border-b border-[#F0EBE1]' : ''"
            >
              <h3 class="font-serif text-xl text-[#1C1917] mb-2">{{ m.title }}</h3>
              <p class="text-sm text-[#57534E] leading-relaxed max-w-xl">{{ m.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="py-24 bg-[#1C1917] text-[#FAF8F5]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h2 class="font-serif text-2xl text-amber-50 mb-16">What we stand by</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div
            v-for="v in values"
            :key="v.title"
            class="py-10 md:py-0 md:px-12 first:md:pl-0 last:md:pr-0"
          >
            <h3 class="font-serif text-xl text-amber-50 mb-3">{{ v.title }}</h3>
            <p class="text-sm text-stone-400 leading-relaxed">{{ v.body }}</p>
          </div>
        </div>

      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 border-t border-[#E8E3DA]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <p class="font-serif text-2xl text-[#1C1917] max-w-md">
          If you want to see what we are reading this month, start with the catalog.
        </p>
        <button
          type="button"
          class="shrink-0 px-7 py-3.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#8B331A] transition-colors"
          @click="goTo('catalog')"
        >
          Browse the catalog
        </button>
      </div>
    </section>

    <AppFooter />
  </div>
</template>