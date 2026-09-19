<script setup>
import { useAuth } from '@/composables/app/auth/useAuth'

const {
  isRegister,
  togglePanel,
  form,
  showPassword,
  loading,
  errorMsg,
  successMsg,
  handleSubmit
} = useAuth()
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#8B331A] selection:text-white">

    <div class="w-full max-w-6xl relative">

      <!-- Top Navigation -->
      <div class="mb-6 flex justify-between items-center">
        <RouterLink
          to="/"
          class="inline-flex items-center space-x-2 text-xs font-semibold text-[#78716C] hover:text-[#8B331A] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Beranda</span>
        </RouterLink>

        <div class="text-xs text-[#A8A29E] font-mono">
          STATUS: <span class="text-emerald-700 font-bold">SYSTEM ONLINE</span>
        </div>
      </div>

      <!-- Main Split Card -->
      <div class="bg-white border border-[#E8E3DA] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-all duration-700">

        <!-- ── ARTWORK PANEL ── -->
        <div
          :class="[
            isRegister ? 'lg:order-2 lg:border-l' : 'lg:order-1 lg:border-r',
            'lg:col-span-6 bg-[#F5F2EC] border-[#E8E3DA] p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden transition-all duration-700'
          ]"
        >
          <!-- Decorative blobs -->
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-[#8B331A]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-[#1B3B2B]/5 rounded-full blur-3xl pointer-events-none"></div>

          <!-- Brand header -->
          <div class="flex items-center justify-between text-xs font-sans text-[#78716C] border-b border-[#E8E3DA] pb-4 z-10">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-[#1C1917] text-white flex items-center justify-center rounded-sm font-serif font-bold text-xs">F</div>
              <div class="flex flex-col">
                <span class="font-bold text-[#1C1917] tracking-tight">FOLIO PRESS</span>
                <span class="text-[9px] uppercase tracking-wider text-[#A8A29E]">Archive & Reading Society</span>
              </div>
            </div>
            <div class="flex items-center space-x-1.5 text-[11px] font-mono text-[#8B331A] font-semibold bg-[#8B331A]/10 px-2.5 py-1 rounded-full">
              <span class="w-1.5 h-1.5 rounded-full bg-[#8B331A]"></span>
              <span>VOL. 04 — CURATED SEASON</span>
            </div>
          </div>

          <!-- Book spotlight -->
          <div class="my-8 py-4 flex flex-col items-center justify-center z-10">
            <div class="relative group cursor-pointer">
              <div class="w-56 sm:w-64 h-72 sm:h-80 bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg p-6 shadow-2xl flex flex-col justify-between text-center transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1 relative overflow-hidden">
                <div class="my-auto">
                  <div class="w-24 h-24 mx-auto border border-[#8B331A]/40 rounded-full flex items-center justify-center relative p-2">
                    <div class="w-16 h-16 border border-[#1C1917]/30 rotate-45 flex items-center justify-center">
                      <span class="font-serif font-bold text-3xl text-[#1C1917] -rotate-45">hy</span>
                    </div>
                  </div>
                  <h3 class="font-serif font-bold text-lg text-[#1C1917] mt-4 uppercase tracking-wider leading-snug">
                    The Architecture<br /><span class="font-serif italic text-base font-normal text-[#8B331A]">of Silence</span>
                  </h3>
                  <p class="text-[10px] text-[#78716C] mt-1 uppercase tracking-widest font-mono">ELARA VANCE / JULIAN REED</p>
                </div>
                <div class="border-t border-[#E8E3DA] pt-2 text-[9px] text-[#A8A29E] uppercase font-mono flex justify-between">
                  <span>FOLIO PRESS</span>
                  <span>FIRST EDITION</span>
                </div>
              </div>
              <div class="w-48 h-4 bg-black/10 rounded-full blur-md mx-auto mt-3"></div>
            </div>

            <p class="text-[11px] font-mono uppercase tracking-widest text-[#78716C] mt-6 text-center">
              CURRENT SPOTLIGHT • "THE ARCHITECTURE OF SILENCE" (FIRST EDITION)
            </p>
          </div>

          <!-- Quote -->
          <div class="border-t border-[#E8E3DA] pt-4 z-10">
            <blockquote class="font-serif italic text-lg sm:text-xl text-[#1C1917] leading-snug">
              "A room without books is like a body without a soul."
            </blockquote>
            <div class="mt-2 text-xs font-sans font-bold uppercase tracking-widest text-[#8B331A] flex items-center space-x-2">
              <span class="w-4 h-0.5 bg-[#8B331A]"></span>
              <span>MARCUS TULLIUS CICERO</span>
              <span class="text-[#A8A29E] font-normal">— De Re Publica</span>
            </div>
          </div>
        </div>

        <!-- ── AUTH FORM PANEL ── -->
        <div
          :class="[
            isRegister ? 'lg:order-1' : 'lg:order-2',
            'lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-white z-10 transition-all duration-700'
          ]"
        >
          <div>
            <!-- Tag -->
            <div class="inline-flex items-center space-x-2 px-3 py-1 bg-[#F5F2EC] text-[#78716C] text-[10px] font-bold tracking-widest uppercase rounded-full border border-[#E8E3DA] mb-4">
              <svg class="w-3.5 h-3.5 text-[#1C1917]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>MEMBERSHIP ACCESS</span>
            </div>

            <!-- Heading -->
            <h2 class="text-3xl sm:text-4xl font-serif text-[#1C1917] font-normal tracking-tight">
              {{ isRegister ? 'Create an account' : 'Welcome back' }}
            </h2>
            <p class="text-xs sm:text-sm text-[#78716C] mt-2 font-sans leading-relaxed">
              {{ isRegister
                ? 'Join the Folio Press society to access curated editions, digital archive, and orders.'
                : 'Sign in to continue to your reading archive, digital library, and orders.' }}
            </p>

            <!-- Error banner -->
            <div
              v-if="errorMsg"
              class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex justify-between items-start gap-2"
            >
              <span>{{ errorMsg }}</span>
              <button type="button" class="text-red-400 hover:text-red-600 shrink-0 font-bold" @click="errorMsg = ''">✕</button>
            </div>

            <!-- Success banner -->
            <div v-if="successMsg" class="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700">
              {{ successMsg }}
            </div>

            <!-- Form -->
            <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">

              <!-- Name (register only) -->
              <div v-if="isRegister">
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-semibold text-[#1C1917]">Full Name</label>
                  <span class="text-[10px] text-[#A8A29E]">Nama Lengkap</span>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Budi Santoso"
                    class="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <!-- Username (register only, di atas email) -->
              <div v-if="isRegister">
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-semibold text-[#1C1917]">Username</label>
                  <span class="text-[10px] text-[#A8A29E]">User ID</span>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C] font-mono font-bold text-xs">@</div>
                  <input
                    v-model="form.username"
                    type="text"
                    required
                    placeholder="budisantoso"
                    class="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <!-- Username (login) / Email (register) -->
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-semibold text-[#1C1917]">
                    {{ isRegister ? 'Email Address' : 'Username' }}
                  </label>
                  <span class="text-[10px] text-[#A8A29E]">Registered Member</span>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C] font-mono font-bold text-xs">@</div>
                  <input
                    v-if="!isRegister"
                    v-model="form.username"
                    type="text"
                    required
                    placeholder="budisantoso"
                    class="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                  />
                  <input
                    v-else
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="budi@example.com"
                    class="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <!-- Phone (register only) -->
              <div v-if="isRegister">
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-semibold text-[#1C1917]">Phone Number</label>
                  <span class="text-[10px] text-[#A8A29E]">Nomor Telepon</span>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="081234567890"
                    class="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <!-- Password -->
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-semibold text-[#1C1917]">Password</label>
                  <RouterLink :to="{ name: 'forgot-password' }" class="text-[10px] font-semibold text-[#8B331A] hover:underline">
                    Forgot password?
                  </RouterLink>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••••••"
                    class="w-full pl-9 pr-10 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78716C] hover:text-[#1C1917]"
                    @click="showPassword = !showPassword"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.99 8.99 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-6.165-3.07a3 3 0 003.96-3.96M3 3l18 18" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Confirm Password (register only) -->
              <div v-if="isRegister">
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-semibold text-[#1C1917]">Confirm Password</label>
                  <span class="text-[10px] text-[#A8A29E]">Ulangi Kata Sandi</span>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input
                    v-model="form.password_confirmation"
                    type="password"
                    required
                    placeholder="••••••••••••"
                    class="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 bg-[#0D192B] hover:bg-[#1C2C44] text-white text-xs font-bold tracking-wider rounded-lg transition-all shadow-md active:scale-98 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{{ loading ? 'Processing...' : (isRegister ? 'Register Account →' : 'Login →') }}</span>
              </button>

            </form>

            <!-- Panel toggle -->
            <div class="mt-6 p-4 bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl text-center">
              <p class="text-xs text-[#78716C]">
                {{ isRegister ? 'Already have a Folio Press account?' : "Don't have a Folio Press account?" }}
              </p>
              <button
                type="button"
                class="mt-1 text-xs font-bold text-[#8B331A] hover:underline inline-flex items-center space-x-1 cursor-pointer"
                @click="togglePanel"
              >
                <span>{{ isRegister ? 'Sign in to existing account' : 'Request membership invitation' }}</span>
                <span>↗</span>
              </button>
            </div>
          </div>

          <!-- Footer badge -->
          <div class="mt-6 pt-4 border-t border-[#E8E3DA] flex items-center justify-center space-x-2 text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
            <svg class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>ENCRYPTED & SECURE LITERARY ARCHIVE ACCESS</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>