import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import api from '@/js/api'
import echo from '@/js/echo'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'

export function useUserChat() {
  const authStore = useAuthStore()
  const chatStore = useChatStore() 

  // ---------- Messages ----------
  const messages = ref([])
  const loadingMessages = ref(false)
  const messagesError = ref(null)
  const messageListRef = ref(null)

  async function fetchMessages() {
    loadingMessages.value = true
    messagesError.value = null
    try {
      // GET /chat — backend returns messages for the authenticated user ↔ admin thread
      const { data } = await api.get('/chat')
      messages.value = data.data ?? data
      chatStore.reset()
      await scrollToBottom()
    } catch (err) {
      messagesError.value = err?.response?.data?.message ?? 'Gagal memuat pesan.'
    } finally {
      loadingMessages.value = false
    }
  }

  async function scrollToBottom() {
    await nextTick()
    const el = messageListRef.value
    if (el) el.scrollTop = el.scrollHeight
  }

  // ---------- Send message ----------
  const newMessage = ref('')
  const sending = ref(false)
  const sendError = ref(null)

  async function sendMessage() {
    const text = newMessage.value.trim()
    if (!text || sending.value) return

    sending.value = true
    sendError.value = null
    try {
      // POST /chat — backend resolves receiver as admin automatically
      const { data } = await api.post('/chat', { message: text })
      messages.value.push(data.data ?? data)
      newMessage.value = ''
      await scrollToBottom()
    } catch (err) {
      sendError.value = err?.response?.data?.message ?? 'Gagal mengirim pesan.'
    } finally {
      sending.value = false
    }
  }

  // ---------- Realtime (Laravel Reverb via Echo) ----------
  let echoChannel = null

  function subscribeToMessages() {
    if (!authStore.user?.id) return

    echoChannel = echo.private(`chat.${authStore.user.id}`)
      .listen('.message.sent', (e) => {
        // Only push messages that belong to this user's thread
        messages.value.push(e)
        scrollToBottom()
        chatStore.increment()
      })
  }

  function unsubscribeFromMessages() {
    if (authStore.user?.id) {
      echo.leave(`chat.${authStore.user.id}`)
    }
    echoChannel = null
  }

  // ---------- Lifecycle ----------
  onMounted(() => {
    if (authStore.isAuthenticated) {
      fetchMessages()
      subscribeToMessages()
    }
  })

  onUnmounted(() => {
    unsubscribeFromMessages()
  })

  // ---------- Helpers ----------
  function isOwnMessage(message) {
    return message.sender_id === authStore.user?.id
  }

  function formatTime(value) {
    if (!value) return ''
    return new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(new Date(value))
  }

  return {
    messages,
    loadingMessages,
    messagesError,
    messageListRef,
    fetchMessages,
    newMessage,
    sending,
    sendError,
    sendMessage,
    isOwnMessage,
    formatTime,
  }
}