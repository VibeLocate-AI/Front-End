<template>
  <main class="contact-page" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme">
    <section class="contact-shell">
      <aside class="agent-summary">
        <button class="back" @click="router.back()"><i class="fa-solid fa-arrow-left"></i> {{ t('Back', 'رجوع') }}</button>
        <div class="agent-avatar"><img :src="agentAvatar" :alt="agentName"></div>
        <h1>{{ agentName }}</h1>
        <p>{{ agentAgency || t('Premium Property Specialist', 'أخصائي عقارات مميزة') }}</p>
        <span class="online"><i></i>{{ t('Online now', 'متصل الآن') }}</span>
        <div v-if="property" class="property-context">
          <img :src="property.image">
          <div>
            <small>{{ t('Regarding property', 'بخصوص العقار') }}</small>
            <b>{{ title }}</b>
          </div>
        </div>
        <button class="call" @click="startCall"><i class="fa-solid fa-phone"></i>{{ t('Start a call', 'بدء مكالمة') }}</button>
      </aside>

      <section class="chat-panel">
        <header>
          <div>
            <b>{{ t('Chat with Agent', 'محادثة مع الوكيل') }} - {{ agentName }}</b>
            <span>{{ t('Usually replies within minutes', 'يرد عادة خلال دقائق') }}</span>
          </div>
          <button @click="startCall" :aria-label="t('Call', 'اتصال')"><i class="fa-solid fa-phone"></i></button>
        </header>

        <div ref="messagesEl" class="messages">
          <div v-for="message in messages" :key="message.id" class="message" :class="message.from">
            <!-- Attachment preview if present -->
            <div v-if="message.attachment" class="message-attachment">
              <img v-if="message.attachment.type.startsWith('image/')" :src="message.attachment.url" class="att-img" />
              <div v-else class="att-doc">
                <i class="fa-solid fa-file-lines"></i>
                <span>{{ message.attachment.name }}</span>
              </div>
            </div>
            <p v-if="message.text">{{ message.text }}</p>
            <time>{{ message.time }}</time>
          </div>
        </div>

        <!-- Interactive In-Call Banner & Modal -->
        <div v-if="callActive" class="call-banner">
          <div class="call-banner-left">
            <span class="call-pulse-dot"></span>
            <i class="fa-solid fa-phone-volume"></i>
            <span>{{ isCalling ? t('Calling...', 'جاري الاتصال...') : t('Connected with', 'متصل مع') }} <b>{{ agentName }}</b> ({{ formatCallDuration }})</span>
          </div>
          <div class="call-banner-actions">
            <button class="call-mic-btn" :class="{ muted: isMuted }" @click="isMuted = !isMuted" :title="isMuted ? 'Unmute' : 'Mute'">
              <i class="fa-solid" :class="isMuted ? 'fa-microphone-slash' : 'fa-microphone'"></i>
            </button>
            <button class="call-end-btn" @click="endCall"><i class="fa-solid fa-phone-slash"></i>{{ t('End call', 'إنهاء المكالمة') }}</button>
          </div>
        </div>

        <!-- Composer -->
        <form class="composer" @submit.prevent="sendMessage">
          <input 
            type="file" 
            ref="fileInputEl" 
            style="display: none" 
            accept="image/*,.pdf,.doc,.docx" 
            @change="onFileSelected"
          />
          <input v-model="draft" :placeholder="t('Write a message…', 'اكتب رسالتك…')">
          <button type="button" @click="triggerFileUpload" :title="t('Attach file/image', 'إرفاق ملف أو صورة')">
            <i class="fa-solid fa-paperclip"></i>
          </button>
          <button class="send" :disabled="!draft.trim()"><i class="fa-solid fa-paper-plane"></i></button>
        </form>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'
import propertyService from '../services/propertyService'

const router = useRouter()
const route = useRoute()
const { isRtl, theme } = useThemeAndLanguage()
const t = (en, ar) => isRtl.value ? ar : en

const property = ref(null)
try {
  property.value = JSON.parse(sessionStorage.getItem('vibelocate:selected-property') || 'null')
} catch {}

const title = computed(() => isRtl.value ? property.value?.title_ar || property.value?.title : property.value?.title)
const agentName = computed(() => property.value?.agent?.name || property.value?.agent_name || route.query.agent || (isRtl.value ? 'وكيل VibeLocate المعتمد' : 'Certified VibeLocate Agent'))
const agentAgency = computed(() => property.value?.agent?.agency_name || property.value?.agency_name || route.query.agency || '')
const agentAvatar = computed(() => property.value?.agent?.avatar || '/images/photo-1507003211169-0a1dd7228f2d.jfif')

const messagesEl = ref(null)
const draft = ref('')
const fileInputEl = ref(null)

// Call state
const callActive = ref(false)
const isCalling = ref(false)
const isMuted = ref(false)
const callDurationSeconds = ref(0)
let callTimer = null

if (route.query.mode === 'call') {
  startCall()
}

const formatCallDuration = computed(() => {
  const m = Math.floor(callDurationSeconds.value / 60).toString().padStart(2, '0')
  const s = (callDurationSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

function startCall() {
  callActive.value = true
  isCalling.value = true
  callDurationSeconds.value = 0
  setTimeout(() => {
    isCalling.value = false
    if (callTimer) clearInterval(callTimer)
    callTimer = setInterval(() => {
      callDurationSeconds.value++
    }, 1000)
  }, 1400)
}

function endCall() {
  callActive.value = false
  isCalling.value = false
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
}

onUnmounted(() => {
  if (callTimer) clearInterval(callTimer)
})

const messages = ref([
  { id: 1, from: 'agent', text: t('Hello! How can I help you with this property today?', 'مرحباً بك! كيف يمكنني مساعدتك بخصوص هذا العقار اليوم؟'), time: '10:24' }
])

const scroll = async () => {
  await nextTick()
  messagesEl.value?.scrollTo({ top: messagesEl.value.scrollHeight, behavior: 'smooth' })
}

const triggerFileUpload = () => {
  fileInputEl.value?.click()
}

const onFileSelected = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const url = URL.createObjectURL(file)
  messages.value.push({
    id: Date.now(),
    from: 'user',
    text: file.name,
    attachment: {
      name: file.name,
      type: file.type,
      url
    },
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  scroll()
  e.target.value = ''

  // Agent acknowledges attachment
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      from: 'agent',
      text: t('I received the document/attachment. Reviewing it now!', 'تم استلام الملف/المرفق بنجاح. جاري الاطلاع عليه الآن!'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    scroll()
  }, 1000)
}

const getContextualReply = (userMsg) => {
  const lower = userMsg.toLowerCase()
  if (lower.includes('price') || lower.includes('سعر') || lower.includes('cost') || lower.includes('تخفيض')) {
    return t(
      'The current listed price is backed by recent Dubai Land Department transaction benchmarks. Let me know if you would like to submit a formal offer.',
      'السعر المعروض معتمد وموثق بناءً على أحدث صفقات دائرة الأراضي والأملاك. هل تود تقديم عرض سعر رسمي؟'
    )
  }
  if (lower.includes('view') || lower.includes('معاينة') || lower.includes('visit') || lower.includes('زيارة') || lower.includes('see')) {
    return t(
      'I would be delighted to organize an exclusive on-site inspection for you! Would tomorrow afternoon suit your schedule?',
      'يسعدني جداً ترتيب موعد معاينة خاصة لك في الموقع! هل يناسبك موعد غداً بعد الظهر؟'
    )
  }
  if (lower.includes('location') || lower.includes('موقع') || lower.includes('area') || lower.includes('where') || lower.includes('أين')) {
    return t(
      'The property is located in one of the most vibrant areas with easy access to transport, shopping, and elite schools.',
      'يقع العقار في موقع استراتيجي مميز بالقرب من أهم المرافق والمدارس والمواصلات.'
    )
  }
  return t(
    'Thank you for reaching out. I am taking note of your inquiry and will follow up immediately with all details.',
    'شكراً لتواصلك. لقد سجلت طلبك وسأوافيك بكافة التفاصيل المطلوبة فوراً.'
  )
}

const sendMessage = async () => {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({
    id: Date.now(),
    from: 'user',
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  draft.value = ''
  scroll()

  if (property.value?.id) {
    try {
      await propertyService.submitInquiry(property.value.id, { message: text })
    } catch (e) {
      console.warn('Inquiry API failed:', e)
    }
  }

  // Dynamic context-aware agent reply
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      from: 'agent',
      text: getContextualReply(text),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    scroll()
  }, 800)
}
</script>

<style scoped>
.contact-page {
  --bg: #f4f8fc;
  --surface: #fff;
  --text: #10253f;
  --muted: #6a7d90;
  --border: #d7e4ef;
  --accent: #087ff5;
  min-height: calc(100vh - 76px);
  background: var(--bg);
  padding: 34px 20px;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.contact-shell {
  max-width: 1050px;
  min-height: 620px;
  margin: auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(27,69,103,.1);
}
.agent-summary {
  padding: 28px;
  text-align: center;
  background: linear-gradient(165deg, #eef8ff, #fff 65%);
  border-inline-end: 1px solid var(--border);
}
.back {
  background: none;
  border: 0;
  color: var(--accent);
  font: inherit;
  cursor: pointer;
  float: inline-start;
}
.agent-avatar {
  margin: 54px auto 16px;
  width: 104px;
  height: 104px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #12cde8, #087ff5);
}
.agent-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
}
.agent-summary h1 {
  font-size: 20px;
  color: var(--text);
  margin: 0;
}
.agent-summary p {
  font-size: 13px;
  color: var(--muted);
  margin: 7px 0;
}
.online {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 6px 10px;
  background: #e9fbf5;
  color: #078863;
  border-radius: 99px;
  font-size: 12px;
}
.online i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #16c98d;
}
.property-context {
  display: flex;
  gap: 10px;
  text-align: start;
  margin: 28px 0;
  padding: 10px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
}
.property-context img {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  object-fit: cover;
}
.property-context small, .property-context b {
  display: block;
}
.property-context small {
  font-size: 10px;
  color: var(--muted);
}
.property-context b {
  font-size: 11px;
  color: var(--text);
  margin-top: 3px;
}
.call, .send {
  border: 0;
  background: linear-gradient(135deg, #087ff5, #0868ed);
  color: #fff;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}
.call {
  width: 100%;
  height: 43px;
}
.call i {
  margin-inline-end: 8px;
}
.chat-panel {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.chat-panel header {
  height: 82px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}
.chat-panel header b {
  display: block;
  color: var(--text);
}
.chat-panel header span {
  display: block;
  color: var(--muted);
  font-size: 12px;
  margin-top: 4px;
}
.chat-panel header button {
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  background: #eaf5ff;
  color: var(--accent);
  cursor: pointer;
}
.messages {
  flex: 1;
  min-height: 390px;
  max-height: 520px;
  overflow: auto;
  padding: 24px;
  background: #fbfdff;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.message {
  max-width: 72%;
  padding: 11px 13px;
  border-radius: 14px;
  background: #edf4fa;
  color: var(--text);
  align-self: flex-start;
}
.message.user {
  align-self: flex-end;
  background: linear-gradient(135deg, #087ff5, #1b83ef);
  color: #fff;
}
.message p {
  margin: 0;
  line-height: 1.45;
  font-size: 14px;
}
.message time {
  display: block;
  font-size: 10px;
  opacity: .7;
  margin-top: 5px;
}
.message-attachment {
  margin-bottom: 8px;
}
.att-img {
  max-width: 220px;
  max-height: 180px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}
.att-doc {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0,0,0,0.08);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
}
.call-banner {
  margin: 0 20px 10px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0369a1;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15);
}
.call-banner-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.call-pulse-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: callPulse 1.2s infinite;
}
@keyframes callPulse {
  0% { transform: scale(0.9); opacity: 0.7; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.7; }
}
.call-banner-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.call-mic-btn {
  border: 0;
  background: rgba(255,255,255,0.7);
  color: #0369a1;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.call-mic-btn.muted {
  background: #fee2e2;
  color: #ef4444;
}
.call-end-btn {
  border: 0;
  background: #ef4444;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 12px;
}
.composer {
  padding: 16px;
  display: flex;
  gap: 8px;
  border-top: 1px solid var(--border);
}
.composer input {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--border);
  border-radius: 11px;
  padding: 0 13px;
  font: inherit;
  outline-color: var(--accent);
}
.composer button {
  width: 42px;
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 10px;
  color: var(--muted);
  cursor: pointer;
}
.composer .send {
  border: 0;
  color: #fff;
}
.composer .send:disabled {
  opacity: .45;
  cursor: not-allowed;
}
.contact-page[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --text: #f8fafc;
  --muted: #94a3b8;
  --border: #334155;
  --accent: #38bdf8;
}
.contact-page[data-theme="dark"] .agent-summary {
  background: linear-gradient(165deg, #1e293b, #162235 65%);
}
.contact-page[data-theme="dark"] .property-context,
.contact-page[data-theme="dark"] .composer button {
  background: #162235;
  border-color: #334155;
}
.contact-page[data-theme="dark"] .messages {
  background: #0f172a;
}
.contact-page[data-theme="dark"] .message {
  background: #1e293b;
  color: #f8fafc;
}
.contact-page[data-theme="dark"] .call-banner {
  background: #1e3a5f;
  color: #7dd3fc;
}
.contact-page[data-theme="dark"] .composer input {
  background: #162235;
  border-color: #334155;
  color: #f8fafc;
}
@media(max-width: 700px) {
  .contact-page {
    padding: 0;
  }
  .contact-shell {
    min-height: calc(100vh - 76px);
    border-radius: 0;
    grid-template-columns: 1fr;
  }
  .agent-summary {
    display: none;
  }
  .messages {
    min-height: calc(100vh - 240px);
  }
}
</style>
