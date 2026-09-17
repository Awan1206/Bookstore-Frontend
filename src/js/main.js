// src/js/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/js/router'
import { useAuthStore } from '@/stores/auth'
import '@/css/style.css'

const app = createApp(App)
const pinia = createPinia()

// Daftarkan directive click-outside secara global
app.directive('click-outside', {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!el.contains(event.target)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
})

app.use(pinia)
app.use(router)

const authStore = useAuthStore()
authStore.restoreAuth().finally(() => {
  app.mount('#app')
})