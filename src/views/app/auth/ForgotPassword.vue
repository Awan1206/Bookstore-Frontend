<script setup>
import { useForgotPassword } from '@/composables/app/auth/useForgotPassword'

const {
  step,
  stepIndex,
  form,
  loading,
  errorMsg,
  successMsg,
  showPassword,
  showConfirmPassword,
  handleSubmit,
  goBack
} = useForgotPassword()
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#8B331A] selection:text-white">

    <div class="w-full max-w-6xl relative">

      <!-- Top Navigation -->
      <div class="mb-6 flex justify-between items-center">
        <RouterLink
          to="/login"
          class="inline-flex items-center space-x-2 text-xs font-semibold text-[#78716C] hover:text-[#8B331A] transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali ke Login</span>
        </RouterLink>

        <div class="text-xs text-[#A8A29E] font-mono">
          STATUS: <span class="text-emerald-700 font-bold">SYSTEM ONLINE</span>
        </div>
      </div>

      <!-- Main Split Card -->
      <div class="bg-white border border-[#E8E3DA] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

        <!-- ── ARTWORK PANEL ── -->
        <div class="lg:col-span-6 bg-[#F5F2EC] border-r border-[#E8E3DA] p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden lg:order-1">

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

          <!-- Step progress visual -->
          <div class="my-8 py-4 flex flex-col items-center justify-center z-10">
            <!-- Step indicator circles -->
            <div class="flex items-center space-x-3 mb-8">
              <template v-for="(label, idx) in ['Email', 'Verifikasi', 'Password']" :key="idx">
                <div class="flex flex-col items-center">
                  <div
                    :class="[
                      'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold font-mono border-2 transition-all duration-500',
                      stepIndex() > idx + 1
                        ? 'bg-[#1B3B2B] border-[#1B3B2B] text-white'
                        : stepIndex() === idx + 1
                          ? 'bg-[#1C1917] border-[#1C1917] text-white'
                          : 'bg-transparent border-[#DDD8CE] text-[#A8A29E]'
                    ]"
                  >
                    <!-- Completed: checkmark -->
                    <svg v-if="stepIndex() > idx + 1" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-else>{{ idx + 1 }}</span>
                  </div>
                  <span
                    :class="[
                      'mt-1.5 text-[10px] font-mono uppercase tracking-wider',
                      stepIndex() === idx + 1 ? 'text-[#1C1917] font-bold' : 'text-[#A8A29E]'
                    ]"
                  >{{ label }}</span>
                </div>
                <!-- Connector line -->
                <div
                  v-if="idx < 2"
                  :class="[
                    'w-10 h-0.5 mb-5 transition-all duration-500',
                    stepIndex() > idx + 1 ? 'bg-[#1B3B2B]' : 'bg-[#DDD8CE]'
                  ]"
                ></div>
              </template>
            </div>

            <!-- Decorative key icon -->
            <div class="w-28 h-28 bg-[#FAF8F5] border border-[#DDD8CE] rounded-full flex items-center justify-center shadow-inner">
              <!-- Step 1: envelope -->
              <svg v-if="step === 'email'" class="w-12 h-12 text-[#1C1917]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <!-- Step 2: shield check -->
              <svg v-else-if="step === 'otp'" class="w-12 h-12 text-[#8B331A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <!-- Step 3: lock open -->
              <svg v-else class="w-12 h-12 text-[#1B3B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>

            <p class="text-[11px] font-mono uppercase tracking-widest text-[#78716C] mt-6 text-center max-w-xs leading-relaxed">
              <template v-if="step === 'email'">Masukkan email terdaftar untuk menerima kode verifikasi</template>
              <template v-else-if="step === 'otp'">Periksa kotak masuk Anda dan masukkan kode 6-digit yang dikirim</template>
              <template v-else>Buat password baru yang kuat untuk akun Folio Press Anda</template>
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

        <!-- ── FORM PANEL ── -->
        <div class="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-white lg:order-2">
          <div>
            <!-- Tag -->
            <div class="inline-flex items-center space-x-2 px-3 py-1 bg-[#F5F2EC] text-[#78716C] text-[10px] font-bold tracking-widest uppercase rounded-full border border-[#E8E3DA] mb-4">
              <svg class="w-3.5 h-3.5 text-[#1C1917]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>ACCOUNT RECOVERY</span>
            </div>

            <!-- Heading -->
            <h2 class="text-3xl sm:text-4xl font-serif text-[#1C1917] font-normal tracking-tight">
              <template v-if="step === 'email'">Forgot your password?</template>
              <template v-else-if="step === 'otp'">Enter your OTP</template>
              <template v-else>Set a new password</template>
            </h2>
            <p class="text-xs sm:text-sm text-[#78716C] mt-2 font-sans leading-relaxed">
              <template v-if="step === 'email'">
                Enter the email address linked to your Folio Press account and we'll send a verification code.
              </template>
              <template v-else-if="step === 'otp'">
                We sent a 6-digit code to <strong class="text-[#1C1917]">{{ form.email }}</strong>. The code expires shortly.
              </template>
              <template v-else>
                Your identity is confirmed. Choose a strong new password for your account.
              </template>
            </p>

            <!-- Error banner -->
            <div
              v-if="errorMsg"
              role="alert"
              class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex justify-between items-start gap-2"
            >
              <span>{{ errorMsg }}</span>
              <button
                type="button"
                class="shrink-0 text-red-400 hover:text-red-600"
                aria-label="Tutup pesan error"
                @click="errorMsg = ''"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Success banner -->
            <div
              v-if="successMsg"
              role="status"
              class="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-700"
            >
              {{ successMsg }}
            </div>

            <!-- ── FORMS ── -->
            <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">

              <!-- STEP 1: Email -->
              <template v-if="step === 'email'">
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label for="fp-email" class="text-xs font-semibold text-[#1C1917]">Email Address</label>
                    <span class="text-[10px] text-[#A8A29E]">Alamat Email</span>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="fp-email"
                      v-model="form.email"
                      type="email"
                      required
                      autocomplete="email"
                      placeholder="nama@email.com"
                      class="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </template>

              <!-- STEP 2: OTP -->
              <template v-else-if="step === 'otp'">
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label for="fp-otp" class="text-xs font-semibold text-[#1C1917]">Verification Code</label>
                    <span class="text-[10px] text-[#A8A29E]">Kode OTP</span>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      id="fp-otp"
                      v-model="form.otp"
                      type="text"
                      inputmode="numeric"
                      maxlength="6"
                      required
                      autocomplete="one-time-code"
                      placeholder="• • • • • •"
                      class="w-full pl-9 pr-4 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors tracking-[0.4em] font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    class="mt-2 text-[10px] font-semibold text-[#8B331A] hover:underline"
                    @click="goBack"
                  >
                    Gunakan email lain?
                  </button>
                </div>
              </template>

              <!-- STEP 3: New Password -->
              <template v-else>
                <!-- Password -->
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label for="fp-password" class="text-xs font-semibold text-[#1C1917]">New Password</label>
                    <span class="text-[10px] text-[#A8A29E]">Password Baru</span>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <input
                      id="fp-password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      required
                      autocomplete="new-password"
                      placeholder="••••••••••••"
                      class="w-full pl-9 pr-10 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78716C] hover:text-[#1C1917]"
                      @click="showPassword = !showPassword"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.99 8.99 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-6.165-3.07a3 3 0 003.96-3.96M3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <label for="fp-password-confirm" class="text-xs font-semibold text-[#1C1917]">Confirm Password</label>
                    <span class="text-[10px] text-[#A8A29E]">Ulangi Password</span>
                  </div>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#78716C]">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <input
                      id="fp-password-confirm"
                      v-model="form.password_confirmation"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      required
                      autocomplete="new-password"
                      placeholder="••••••••••••"
                      class="w-full pl-9 pr-10 py-2.5 bg-[#F8F6F1] border border-[#E8E3DA] rounded-lg text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#1C1917] focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      :aria-label="showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#78716C] hover:text-[#1C1917]"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path v-if="!showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a8.99 8.99 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-6.165-3.07a3 3 0 003.96-3.96M3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                </div>
              </template>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 bg-[#0D192B] hover:bg-[#1C2C44] text-white text-xs font-bold tracking-wider rounded-lg transition-all shadow-md active:scale-98 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>
                  <template v-if="loading">Processing...</template>
                  <template v-else-if="step === 'email'">Send Code →</template>
                  <template v-else-if="step === 'otp'">Verify Code →</template>
                  <template v-else>Reset Password →</template>
                </span>
              </button>

            </form>

            <!-- Back link (step 2 & 3) -->
            <div v-if="step !== 'email'" class="mt-4 text-center">
              <button
                type="button"
                class="text-[10px] font-semibold text-[#78716C] hover:text-[#8B331A] inline-flex items-center space-x-1 transition-colors"
                @click="goBack"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{{ step === 'otp' ? 'Kembali ke step sebelumnya' : 'Kembali ke verifikasi OTP' }}</span>
              </button>
            </div>

            <!-- Login redirect -->
            <div class="mt-6 p-4 bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl text-center">
              <p class="text-xs text-[#78716C]">Sudah ingat password Anda?</p>
              <RouterLink
                to="/login"
                class="mt-1 text-xs font-bold text-[#8B331A] hover:underline inline-flex items-center space-x-1"
              >
                <span>Sign in to your account</span>
                <span>↗</span>
              </RouterLink>
            </div>
          </div>

          <!-- Footer badge -->
          <div class="mt-6 pt-4 border-t border-[#E8E3DA] flex items-center justify-center space-x-2 text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
            <svg class="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>ENCRYPTED & SECURE LITERARY ARCHIVE ACCESS</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>