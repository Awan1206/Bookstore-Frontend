import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import api from '@/js/api'
import echo from '@/js/echo'
import { useAuthStore } from '@/stores/auth'

// Conversations tetap polling (ringan, sekadar update sidebar).
// Pesan sekarang real-time lewat Laravel Reverb, bukan polling lagi.
const POLL_CONVERSATIONS_MS = 30000

export function useChatPage() {
  const authStore = useAuthStore()

  // ---------- Conversations ----------
  const conversations = ref([])
  const loadingConversations = ref(false)
  const conversationsError = ref(null)

  async function fetchConversations() {
    if (conversations.value.length === 0) loadingConversations.value = true
    conversationsError.value = null
    try {
      const { data } = await api.get('/admin/chat/conversations')
      const raw = data.data ?? data
      // ChatController::conversations() balikin User langsung (id, name, username, unread_count),
      // bukan dibungkus { user: {...} } — normalisasi di sini biar template tetap pakai conv.user.*
      conversations.value = raw.map((u) => ({
        user: { id: u.id, name: u.name, username: u.username },
        unread_count: u.unread_count ?? 0,
        last_message: u.last_message ?? null,
        last_message_at: u.last_message_at ?? null,
      }))
    } catch (err) {
      conversationsError.value = err?.response?.data?.message ?? 'Gagal memuat daftar percakapan.'
    } finally {
      loadingConversations.value = false
    }
  }

  // ---------- Search ----------
  const search = ref('')

  const filteredConversations = computed(() => {
    if (!search.value.trim()) return conversations.value
    const q = search.value.trim().toLowerCase()
    return conversations.value.filter((c) => c.user?.name?.toLowerCase().includes(q))
  })

  // ---------- Active conversation & messages ----------
  const activeConversation = ref(null)
  const messages = ref([])
  const loadingMessages = ref(false)
  const messagesError = ref(null)
  const messageListRef = ref(null)

  async function selectConversation(conversation) {
    activeConversation.value = conversation
    conversation.unread_count = 0 // ditandai terbaca begitu dibuka
    await fetchMessages()
  }

  async function fetchMessages() {
    if (!activeConversation.value) return
    loadingMessages.value = true
    messagesError.value = null
    try {
      const { data } = await api.get('/chat', {
        params: { user_id: activeConversation.value.user.id },
      })
      messages.value = data.data ?? data
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
    if (!text || !activeConversation.value || sending.value) return

    sending.value = true
    sendError.value = null
    try {
      const { data } = await api.post('/chat', {
        receiver_id: activeConversation.value.user.id,
        message: text,
      })
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
      // Titik di depan wajib: MessageSent::broadcastAs() balikin nama custom
      // tanpa namespace ('message.sent'), jadi harus di-escape di listener.
      .listen('.message.sent', (e) => {
        // e = { id, sender_id, receiver_id, message, is_read, created_at }
        // (lihat MessageSent::broadcastWith() — field-nya top-level, bukan dibungkus)

        // Push ke thread yang lagi dibuka, kalau pesan ini bagian dari percakapan itu
        if (
          activeConversation.value &&
          (e.sender_id === activeConversation.value.user.id ||
            e.receiver_id === activeConversation.value.user.id)
        ) {
          messages.value.push(e)
          scrollToBottom()
        }

        // Update preview & unread count di sidebar
        const otherPartyId = e.sender_id === authStore.user.id ? e.receiver_id : e.sender_id
        const conv = conversations.value.find((c) => c.user.id === otherPartyId)
        if (conv) {
          conv.last_message = e.message
          conv.last_message_at = e.created_at
          if (activeConversation.value?.user?.id !== otherPartyId) {
            conv.unread_count = (conv.unread_count ?? 0) + 1
          }
        } else {
          // Pesan dari user baru yang belum ada di sidebar — refresh daftar percakapan
          fetchConversations()
        }
      })
  }

  function unsubscribeFromMessages() {
    if (authStore.user?.id) {
      echo.leave(`chat.${authStore.user.id}`)
    }
    echoChannel = null
  }

  // ---------- Lifecycle ----------
  let conversationsTimer = null

  onMounted(() => {
    fetchConversations()
    subscribeToMessages()
    conversationsTimer = setInterval(fetchConversations, POLL_CONVERSATIONS_MS)
  })

  onUnmounted(() => {
    clearInterval(conversationsTimer)
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
    conversations,
    loadingConversations,
    conversationsError,
    fetchConversations,
    search,
    filteredConversations,
    activeConversation,
    messages,
    loadingMessages,
    messagesError,
    messageListRef,
    selectConversation,
    newMessage,
    sending,
    sendError,
    sendMessage,
    isOwnMessage,
    formatTime,
  }
}