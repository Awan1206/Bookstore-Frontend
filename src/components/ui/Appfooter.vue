<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goTo(name) {
  if (router.hasRoute(name)) router.push({ name })
}
</script>

<template>
  <footer class="bg-[#141211] text-stone-500 py-16 border-t border-stone-800 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">

        <!-- Brand -->
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-white text-black font-serif font-bold text-xs flex items-center justify-center rounded-xs">F</div>
            <span class="font-serif font-bold text-white text-base">FOLIO PRESS</span>
          </div>
          <p class="text-stone-400 leading-relaxed">
            Architectural publishing and independent literary press dedicated to physical permanence.
          </p>
        </div>

        <!-- Navigate -->
        <div>
          <h5 class="text-stone-200 font-bold uppercase tracking-wider text-[11px] mb-4">Navigate</h5>
          <ul class="space-y-2">
            <li><button type="button" class="hover:text-white transition-colors" @click="goTo('our-story')">Our Story</button></li>
            <li><button type="button" class="hover:text-white transition-colors" @click="goTo('journal')">Journal</button></li>
            <li><button type="button" class="hover:text-white transition-colors" @click="goTo('books.index')">Books &amp; Catalog</button></li>
            <li><button type="button" class="hover:text-white transition-colors" @click="goTo('contact')">Contact</button></li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h5 class="text-stone-200 font-bold uppercase tracking-wider text-[11px] mb-4">Services</h5>
          <ul class="space-y-2">
            <li><a href="#" class="hover:text-white transition-colors">Kraft Shipping</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Returns</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Order Status</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Press Membership</a></li>
          </ul>
        </div>

        <!-- Location & Contact -->
        <div>
          <h5 class="text-stone-200 font-bold uppercase tracking-wider text-[11px] mb-4">Location &amp; Contact</h5>
          <p class="text-stone-400 leading-relaxed">
            Jl. Sastra No. 10, South Jakarta<br />
            hello@foliopress.id<br />
            +62 21 555 0192
          </p>
        </div>

      </div>

      <div class="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center text-[11px]">
        <p>© 2026 FOLIO PRESS. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>