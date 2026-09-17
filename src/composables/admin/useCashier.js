import { ref, computed, onBeforeUnmount, nextTick } from 'vue'
import api from '@/js/api'
import jsQR from 'jsqr'

/**
 * Cashier page logic:
 * - Camera-based QR scanning — for testing without physical hardware. Uses native
 *   BarcodeDetector where supported, else falls back to the bundled `jsqr` package.
 * - Physical USB/Bluetooth barcode/QR scanners: these act as a keyboard (HID) and simply
 *   "type" the scanned text very fast, followed by Enter. We support them via a global
 *   fast-keystroke listener, so no extra plugin or driver is needed — just plug in the
 *   scanner and scan.
 * - Manual code entry as a final fallback.
 * - Order lookup by order_code, cash-based confirm (with change calculation), and complete
 *   against the admin/orders endpoints.
 *
 * Order flow: pending -> paid (via confirm, requires cash_received) -> completed (via complete)
 * (or cancelled). Only 'paid' orders can be completed.
 */
export function useCashierPage() {
  // ---------- Order lookup ----------
  const order = ref(null)
  const loadingOrder = ref(false)
  const orderError = ref(null)

  async function lookupOrder(orderCode) {
    const code = (orderCode || '').trim()
    if (!code) return

    loadingOrder.value = true
    orderError.value = null
    order.value = null
    resetConfirmForm()

    try {
      // Endpoint wraps the order in a {data: ...} envelope (OrderResource)
      const { data } = await api.get(`/admin/orders/${encodeURIComponent(code)}`)
      order.value = data.data
    } catch (err) {
      orderError.value = err?.response?.status === 404
        ? 'Pesanan tidak ditemukan. Periksa kembali kode QR.'
        : (err?.response?.data?.message ?? 'Gagal memuat pesanan.')
    } finally {
      loadingOrder.value = false
    }
  }

  function clearOrder() {
    order.value = null
    orderError.value = null
    actionError.value = null
    actionSuccess.value = null
    resetConfirmForm()
  }

  // ---------- Confirm order (cash payment) ----------
  const cashReceived = ref('')
  const processing = ref(false)
  const actionError = ref(null)
  const actionSuccess = ref(null)

  function resetConfirmForm() {
    cashReceived.value = ''
    actionError.value = null
    actionSuccess.value = null
  }

  // Live preview of change before submitting, so the cashier can check before confirming
  const changePreview = computed(() => {
    if (!order.value || cashReceived.value === '') return null
    const cash = Number(cashReceived.value)
    if (Number.isNaN(cash)) return null
    return cash - Number(order.value.total_amount)
  })

  async function confirmOrder() {
    if (!order.value) return

    const cash = Number(cashReceived.value)
    if (cashReceived.value === '' || Number.isNaN(cash) || cash < 0) {
      actionError.value = 'Masukkan nominal cash yang valid.'
      return
    }
    if (cash < Number(order.value.total_amount)) {
      actionError.value = 'Uang cash yang diterima kurang dari total belanja.'
      return
    }

    processing.value = true
    actionError.value = null
    actionSuccess.value = null

    try {
      const { data } = await api.post(`/admin/orders/${order.value.order_code}/confirm`, {
        cash_received: cash,
      })
      order.value = data.data ?? order.value
      actionSuccess.value = data.message ?? 'Pesanan berhasil dikonfirmasi dan dibayar.'
      cashReceived.value = ''
    } catch (err) {
      actionError.value = err?.response?.data?.message ?? 'Gagal mengonfirmasi pesanan.'
    } finally {
      processing.value = false
    }
  }

  // ---------- Complete order ----------
  // complete() only returns {message} — no order payload — so we patch status locally
  // to reflect the change immediately.
  async function completeOrder() {
    if (!order.value) return
    processing.value = true
    actionError.value = null
    actionSuccess.value = null

    try {
      const { data } = await api.post(`/admin/orders/${order.value.order_code}/complete`)
      actionSuccess.value = data.message ?? 'Pesanan ditandai selesai.'
      order.value = { ...order.value, status: 'completed' }
    } catch (err) {
      actionError.value = err?.response?.data?.message ?? 'Gagal menyelesaikan pesanan.'
    } finally {
      processing.value = false
    }
  }

  // ---------- Manual entry ----------
  const manualCode = ref('')

  function submitManualCode() {
    lookupOrder(manualCode.value)
    manualCode.value = ''
  }

  // ---------- Camera QR scanning ----------
  // For local testing: scans a QR code shown on another screen/phone using this device's camera.
  // Uses the browser's native BarcodeDetector API when available (Chrome/Android/Samsung
  // Internet). Where it isn't available (Safari, Firefox), falls back to the bundled
  // `jsqr` package (decodes a frame captured onto a hidden <canvas>).
  const scannerActive = ref(false)
  const scannerError = ref(null)
  const videoRef = ref(null)
  const canvasRef = ref(null)

  let mediaStream = null
  let detectionLoopId = null
  let barcodeDetector = null

  async function startCameraScanner() {
    scannerError.value = null
    scannerActive.value = true

    await nextTick()

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })

      if (!videoRef.value) throw new Error('Video element not ready')
      videoRef.value.srcObject = mediaStream
      await videoRef.value.play()

      if ('BarcodeDetector' in window) {
        barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] })
        runNativeDetectionLoop()
      } else {
        runJsQrDetectionLoop()
      }
    } catch (err) {
      scannerError.value = 'Tidak dapat mengakses kamera. Periksa izin kamera pada browser.'
      await stopCameraScanner()
    }
  }

  function runNativeDetectionLoop() {
    const tick = async () => {
      if (!scannerActive.value || !videoRef.value) return
      try {
        const barcodes = await barcodeDetector.detect(videoRef.value)
        if (barcodes.length > 0 && barcodes[0].rawValue) {
          onScanSuccess(barcodes[0].rawValue)
          return
        }
      } catch {
        // detection can transiently fail on a frame — ignore and keep scanning
      }
      detectionLoopId = requestAnimationFrame(tick)
    }
    detectionLoopId = requestAnimationFrame(tick)
  }

  function runJsQrDetectionLoop() {
    const tick = () => {
      if (!scannerActive.value || !videoRef.value || !canvasRef.value) return

      const video = videoRef.value
      const canvas = canvasRef.value

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const result = jsQR(imageData.data, imageData.width, imageData.height)

        if (result && result.data) {
          onScanSuccess(result.data)
          return
        }
      }
      detectionLoopId = requestAnimationFrame(tick)
    }
    detectionLoopId = requestAnimationFrame(tick)
  }

  async function stopCameraScanner() {
    if (detectionLoopId) {
      cancelAnimationFrame(detectionLoopId)
      detectionLoopId = null
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop())
      mediaStream = null
    }
    if (videoRef.value) {
      videoRef.value.srcObject = null
    }
    barcodeDetector = null
    scannerActive.value = false
  }

  function onScanSuccess(decodedText) {
    stopCameraScanner()
    lookupOrder(decodedText)
  }

  // ---------- Physical (HID) scanner support ----------
  // Physical QR/barcode scanners emit keystrokes like a keyboard, very fast, ending in Enter.
  // We buffer keystrokes and flush on Enter or after a short idle pause, then treat it as a scan.
  const hardwareScannerListening = ref(false)
  let hardwareBuffer = ''
  let hardwareBufferTimeout = null

  function handleHardwareKeydown(event) {
    if (!hardwareScannerListening.value) return

    // TEMPORARY debug log — remove once the real cause is confirmed
    console.log('[cashier] keydown:', JSON.stringify(event.key), 'buffer so far:', JSON.stringify(hardwareBuffer))

    if (event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Meta') {
      return
    }

    if (event.key === 'Enter') {
      flushHardwareBuffer()
      return
    }

    if (event.key.length === 1) {
      hardwareBuffer += event.key
      clearTimeout(hardwareBufferTimeout)
      hardwareBufferTimeout = setTimeout(() => {
        // If no Enter arrives, flush anyway after a short idle period
        flushHardwareBuffer()
      }, 300)
    }
  }

  function flushHardwareBuffer() {
    clearTimeout(hardwareBufferTimeout)
    const code = hardwareBuffer.trim()
    hardwareBuffer = ''
    // TEMPORARY debug log — remove once the real cause is confirmed
    console.log('[cashier] flushed code:', JSON.stringify(code))
    if (code) {
      lookupOrder(code)
    }
  }

  function startHardwareScanner() {
    hardwareScannerListening.value = true
    window.addEventListener('keydown', handleHardwareKeydown)
  }

  function stopHardwareScanner() {
    hardwareScannerListening.value = false
    window.removeEventListener('keydown', handleHardwareKeydown)
    hardwareBuffer = ''
    clearTimeout(hardwareBufferTimeout)
  }

  onBeforeUnmount(() => {
    stopCameraScanner()
    stopHardwareScanner()
  })

  // ---------- Format helpers ----------
  function formatCurrency(value) {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  function formatDate(value) {
    if (!value) return '-'
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  }

  function statusLabel(status) {
    const labels = {
      pending: 'Menunggu Pembayaran',
      paid: 'Sudah Dibayar',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    }
    return labels[status] ?? status
  }

  return {
    // order
    order,
    loadingOrder,
    orderError,
    lookupOrder,
    clearOrder,
    // confirm (cash payment)
    cashReceived,
    changePreview,
    processing,
    actionError,
    actionSuccess,
    confirmOrder,
    completeOrder,
    // manual entry
    manualCode,
    submitManualCode,
    // camera scanner
    scannerActive,
    scannerError,
    videoRef,
    canvasRef,
    startCameraScanner,
    stopCameraScanner,
    // hardware scanner
    hardwareScannerListening,
    startHardwareScanner,
    stopHardwareScanner,
    // helpers
    formatCurrency,
    formatDate,
    statusLabel,
  }
}