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

const form = ref({ name: '', email: '', subject: '', message: '' })
const submitted = ref(false)
const submitting = ref(false)

function handleSubmit() {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    submitted.value = true
    form.value = { name: '', email: '', subject: '', message: '' }
  }, 800)
}

const hours = [
  { day: 'Monday – Friday', time: '10:00 – 20:00' },
  { day: 'Saturday',        time: '09:00 – 21:00' },
  { day: 'Sunday',          time: '11:00 – 18:00' },
]

const socials = [
  { label: 'Instagram',  handle: '@foliopress.id',      href: '#' },
  { label: 'Twitter / X', handle: '@foliopress',        href: '#' },
  { label: 'WhatsApp',   handle: '+62 812 0000 0001',   href: '#' },
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

    <!-- PAGE HEADER -->
    <section class="border-b border-[#E8E3DA] py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-xs font-medium text-[#78716C] mb-3 tracking-wide">Contact</p>
        <h1 class="font-serif text-4xl sm:text-5xl text-[#1C1917] tracking-tight max-w-lg leading-tight">
          Come in, or reach out. We'll get back to you within a day.
        </h1>
      </div>
    </section>

    <!-- MAIN CONTENT -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">

          <!-- LEFT: Store info -->
          <div class="lg:col-span-5 space-y-12">

            <!-- Address -->
            <div>
              <h2 class="font-serif text-lg text-[#1C1917] mb-4 pb-3 border-b border-[#E8E3DA]">Visit us</h2>
              <address class="not-italic text-sm text-[#57534E] leading-relaxed">
                Jl. Sastra No. 10<br />
                Kemang, Jakarta Selatan<br />
                DKI Jakarta 12730
              </address>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener"
                class="inline-block mt-3 text-xs font-semibold text-[#8B331A] hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>

            <!-- Hours -->
            <div>
              <h2 class="font-serif text-lg text-[#1C1917] mb-4 pb-3 border-b border-[#E8E3DA]">Opening hours</h2>
              <dl class="space-y-2">
                <div v-for="h in hours" :key="h.day" class="flex justify-between text-sm">
                  <dt class="text-[#44403C]">{{ h.day }}</dt>
                  <dd class="text-[#57534E] font-medium">{{ h.time }}</dd>
                </div>
              </dl>
              <p class="text-xs text-[#A8A29E] mt-4">We may close early on public holidays. Check our Instagram for updates.</p>
            </div>

            <!-- Direct contact -->
            <div>
              <h2 class="font-serif text-lg text-[#1C1917] mb-4 pb-3 border-b border-[#E8E3DA]">Direct contact</h2>
              <div class="space-y-2 text-sm text-[#57534E]">
                <p>
                  <span class="text-[#A8A29E] text-xs block mb-0.5">Email</span>
                  <a href="mailto:hello@foliopress.id" class="hover:text-[#8B331A] transition-colors">hello@foliopress.id</a>
                </p>
                <p class="pt-2">
                  <span class="text-[#A8A29E] text-xs block mb-0.5">Phone</span>
                  <a href="tel:+622155500192" class="hover:text-[#8B331A] transition-colors">+62 21 555 0192</a>
                </p>
              </div>
            </div>

            <!-- Socials -->
            <div>
              <h2 class="font-serif text-lg text-[#1C1917] mb-4 pb-3 border-b border-[#E8E3DA]">Find us online</h2>
              <div class="space-y-3">
                <a
                  v-for="s in socials"
                  :key="s.label"
                  :href="s.href"
                  class="flex items-center justify-between text-sm group"
                >
                  <span class="text-[#A8A29E] text-xs w-24 shrink-0">{{ s.label }}</span>
                  <span class="text-[#44403C] group-hover:text-[#8B331A] transition-colors font-medium">{{ s.handle }}</span>
                  <span class="text-[#A8A29E] group-hover:text-[#8B331A] transition-colors ml-2">→</span>
                </a>
              </div>
            </div>

          </div>

          <!-- RIGHT: Form -->
          <div class="lg:col-span-7">
            <div class="bg-white border border-[#E8E3DA] p-8 sm:p-10">

              <h2 class="font-serif text-2xl text-[#1C1917] mb-2">Send a message</h2>
              <p class="text-sm text-[#78716C] mb-8">For orders, recommendations, bulk inquiries, or just to say hello.</p>

              <!-- Success state -->
              <div v-if="submitted" class="py-12 text-center">
                <div class="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                  <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p class="font-serif text-lg text-[#1C1917]">Message sent.</p>
                <p class="text-sm text-[#78716C] mt-1">We'll reply to your email within one business day.</p>
                <button
                  type="button"
                  class="mt-6 text-xs font-semibold text-[#8B331A] hover:underline"
                  @click="submitted = false"
                >
                  Send another message
                </button>
              </div>

              <!-- Form -->
              <form v-else class="space-y-5" @submit.prevent="handleSubmit">

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label for="contact-name" class="block text-xs text-[#44403C] mb-1.5 font-medium">Name</label>
                    <input
                      id="contact-name"
                      v-model="form.name"
                      type="text"
                      required
                      placeholder="Your name"
                      class="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E8E3DA] focus:outline-none focus:border-[#1C1917] transition-colors placeholder-[#C4BDB5]"
                    />
                  </div>
                  <div>
                    <label for="contact-email" class="block text-xs text-[#44403C] mb-1.5 font-medium">Email</label>
                    <input
                      id="contact-email"
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      class="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E8E3DA] focus:outline-none focus:border-[#1C1917] transition-colors placeholder-[#C4BDB5]"
                    />
                  </div>
                </div>

                <div>
                  <label for="contact-subject" class="block text-xs text-[#44403C] mb-1.5 font-medium">Subject</label>
                  <select
                    id="contact-subject"
                    v-model="form.subject"
                    required
                    class="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E8E3DA] focus:outline-none focus:border-[#1C1917] transition-colors text-[#1C1917]"
                  >
                    <option value="" disabled>Select a topic</option>
                    <option>Order question</option>
                    <option>Book recommendation</option>
                    <option>Bulk / corporate order</option>
                    <option>Publisher inquiry</option>
                    <option>Something else</option>
                  </select>
                </div>

                <div>
                  <label for="contact-message" class="block text-xs text-[#44403C] mb-1.5 font-medium">Message</label>
                  <textarea
                    id="contact-message"
                    v-model="form.message"
                    rows="6"
                    required
                    placeholder="What would you like to say?"
                    class="w-full px-4 py-3 text-sm bg-[#FAF8F5] border border-[#E8E3DA] focus:outline-none focus:border-[#1C1917] transition-colors resize-none placeholder-[#C4BDB5]"
                  ></textarea>
                </div>

                <div class="pt-2">
                  <button
                    type="submit"
                    :disabled="submitting"
                    class="w-full sm:w-auto px-8 py-3.5 bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#8B331A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {{ submitting ? 'Sending...' : 'Send message' }}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- MAP PLACEHOLDER -->
    <section class="h-64 bg-[#EAE5DC] border-t border-[#E8E3DA] flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1C1917" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div class="relative text-center">
        <div class="w-4 h-4 rounded-full bg-[#8B331A] mx-auto mb-3 ring-4 ring-[#8B331A]/20"></div>
        <p class="text-sm font-medium text-[#44403C]">Jl. Sastra No. 10, Kemang</p>
        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener"
          class="mt-2 inline-block text-xs text-[#8B331A] font-semibold hover:underline"
        >
          Open in Google Maps →
        </a>
      </div>
    </section>

    <AppFooter />
  </div>
</template>