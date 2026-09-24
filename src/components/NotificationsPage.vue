<template>
  <main class="notifications-page" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme">
    <section class="notifications-hero">
      <div>
        <span class="eyebrow"><i class="fa-solid fa-bell"></i>{{ copy.eyebrow }}</span>
        <h1>{{ copy.title }} <span>{{ unreadCount }}</span></h1>
        <p>{{ copy.subtitle }}</p>
      </div>
      <div class="hero-orb"><i class="fa-regular fa-bell"></i></div>
    </section>

    <section class="notifications-content">
      <div class="notifications-toolbar">
        <div class="filter-tabs" role="tablist">
          <button v-for="filter in filters" :key="filter.id" :class="{ active: activeFilter === filter.id }" @click="activeFilter = filter.id">
            {{ filter.label }} <span>{{ filter.count }}</span>
          </button>
        </div>
        <button v-if="unreadCount" class="mark-all-btn" @click="markAllRead"><i class="fa-solid fa-check-double"></i>{{ copy.markAll }}</button>
      </div>

      <div class="notification-list">
        <article v-for="item in filteredNotifications" :key="item.id" class="notification-card" :class="{ unread: !item.read }">
          <div class="notification-icon" :class="item.type"><i :class="item.icon"></i></div>
          <div class="notification-copy">
            <div class="notification-heading"><h2>{{ isRtl ? item.arTitle : item.title }}</h2><time>{{ isRtl ? item.arTime : item.time }}</time></div>
            <p>{{ isRtl ? item.arText : item.text }}</p>
            <button v-if="item.action" class="notification-action" @click="markRead(item)">{{ isRtl ? item.arAction : item.action }} <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i></button>
          </div>
          <div class="notification-controls">
            <span v-if="!item.read" class="unread-dot" :title="copy.unread"></span>
            <button :title="copy.delete" @click="removeNotification(item.id)"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </article>
        <div v-if="!filteredNotifications.length" class="empty-state"><i class="fa-regular fa-bell-slash"></i><h2>{{ copy.empty }}</h2><p>{{ copy.emptyText }}</p></div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'
import { notificationService } from '../services/notificationService'

const { isRtl, theme } = useThemeAndLanguage()
const activeFilter = ref('all')
const notifications = ref([
  { id: 1, type: 'price', icon: 'fa-solid fa-tags', read: false, title: 'Price drop on a saved property', arTitle: 'انخفاض سعر عقار محفوظ', text: 'Palm Horizon Villas is now AED 450,000 below its previous price.', arText: 'أصبح سعر فلل بالم هورايزن أقل بمقدار 450,000 د.إ عن سعره السابق.', time: '10 minutes ago', arTime: 'منذ 10 دقائق', action: 'View property', arAction: 'عرض العقار' },
  { id: 2, type: 'match', icon: 'fa-solid fa-wand-magic-sparkles', read: false, title: 'A new AI match is ready', arTitle: 'تطابق ذكي جديد جاهز', text: 'We found 6 properties that match your saved preferences.', arText: 'وجدنا 6 عقارات تتوافق مع تفضيلاتك المحفوظة.', time: '1 hour ago', arTime: 'منذ ساعة', action: 'Explore matches', arAction: 'استكشف التطابقات' },
  { id: 3, type: 'tour', icon: 'fa-regular fa-calendar-check', read: false, title: 'Tour request confirmed', arTitle: 'تم تأكيد طلب المعاينة', text: 'Your private viewing for Creek Gate Residences is confirmed for tomorrow at 4:00 PM.', arText: 'تم تأكيد معاينتك الخاصة لمساكن كريك غيت غداً الساعة 4:00 مساءً.', time: '3 hours ago', arTime: 'منذ 3 ساعات', action: 'View booking', arAction: 'عرض الحجز' },
  { id: 4, type: 'market', icon: 'fa-solid fa-chart-line', read: true, title: 'Weekly Dubai market insight', arTitle: 'تقرير سوق دبي الأسبوعي', text: 'Dubai Marina rental demand rose by 8% this week. See the latest AI market report.', arText: 'ارتفع الطلب على الإيجار في دبي مارينا بنسبة 8% هذا الأسبوع. اطلع على أحدث تقرير ذكي للسوق.', time: 'Yesterday', arTime: 'أمس', action: 'Read report', arAction: 'قراءة التقرير' },
  { id: 5, type: 'system', icon: 'fa-solid fa-shield-heart', read: true, title: 'Your account is verified', arTitle: 'تم توثيق حسابك', text: 'Your VibeLocate profile is ready to unlock all personalized property features.', arText: 'أصبح ملفك في VibeLocate جاهزاً للاستفادة من جميع مزايا العقارات المخصصة.', time: '2 days ago', arTime: 'منذ يومين' }
])

const unreadCount = computed(() => notifications.value.filter(item => !item.read).length)
const copy = computed(() => isRtl.value ? {
  eyebrow: 'مركز الإشعارات', title: 'إشعاراتك', subtitle: 'تابع أحدث التحديثات والفرص العقارية المصممة لك.', all: 'الكل', unread: 'غير المقروءة', markAll: 'تحديد الكل كمقروء', delete: 'حذف الإشعار', empty: 'لا توجد إشعارات هنا', emptyText: 'أنت على اطلاع بكل شيء الآن.'
} : {
  eyebrow: 'NOTIFICATION CENTER', title: 'Your Notifications', subtitle: 'Stay on top of updates and property opportunities tailored to you.', all: 'All', unread: 'Unread', markAll: 'Mark all as read', delete: 'Delete notification', empty: 'No notifications here', emptyText: "You're all caught up."
})
const filters = computed(() => [
  { id: 'all', label: copy.value.all, count: notifications.value.length },
  { id: 'unread', label: copy.value.unread, count: unreadCount.value }
])
const filteredNotifications = computed(() => activeFilter.value === 'unread' ? notifications.value.filter(item => !item.read) : notifications.value)
const iconForType = type => ({ price: 'fa-solid fa-tags', match: 'fa-solid fa-wand-magic-sparkles', tour: 'fa-regular fa-calendar-check', market: 'fa-solid fa-chart-line', system: 'fa-solid fa-shield-heart' }[type] || 'fa-regular fa-bell')
const normalizeNotification = item => {
  const payload = item?.data || item?.notification || item || {}
  const type = payload.type || item.type || 'system'
  return {
    id: item.id || payload.id,
    type,
    icon: iconForType(type),
    read: Boolean(item.read_at || item.is_read || payload.read_at || payload.is_read),
    title: payload.title || item.title || 'New notification',
    arTitle: payload.title_ar || payload.ar_title || payload.title || item.title || 'إشعار جديد',
    text: payload.message || payload.body || item.message || item.body || '',
    arText: payload.message_ar || payload.body_ar || payload.message || payload.body || item.message || item.body || '',
    time: payload.created_at || item.created_at || '',
    arTime: payload.created_at || item.created_at || '',
    action: payload.action_label || '',
    arAction: payload.action_label_ar || payload.action_label || ''
  }
}
const markRead = async item => {
  if (item.read) return
  item.read = true
  try { await notificationService.markAsRead(item.id) } catch { item.read = false }
}
const markAllRead = async () => {
  await Promise.all(notifications.value.filter(item => !item.read).map(markRead))
}
const removeNotification = id => { notifications.value = notifications.value.filter(item => item.id !== id) }

onMounted(async () => {
  try {
    const serverNotifications = await notificationService.getAll()
    if (serverNotifications.length) notifications.value = serverNotifications.map(normalizeNotification)
  } catch (error) {
    console.warn('[notifications] Using local preview data:', error?.message)
  } finally {
    notificationService.refreshUnreadCount()
  }
})
</script>

<style scoped>
.notifications-page { min-height: calc(100vh - 76px); background: #07111f; color: #edf6ff; padding: 44px max(5vw, 24px) 80px; transition: background .25s ease, color .25s ease; }
.notifications-hero { max-width: 1180px; margin: 0 auto 28px; padding: 34px 38px; min-height: 178px; overflow: hidden; position: relative; border: 1px solid rgba(56,189,248,.2); border-radius: 22px; background: radial-gradient(circle at 88% 24%, rgba(14,165,233,.24), transparent 26%), linear-gradient(135deg, #0c2741, #091827 70%); display: flex; align-items: center; justify-content: space-between; }
.eyebrow { color: #38bdf8; display: inline-flex; align-items: center; gap: 8px; font-size: .7rem; font-weight: 800; letter-spacing: .09em; }
.notifications-hero h1 { margin: 10px 0 7px; font-family: Outfit, sans-serif; font-size: clamp(1.9rem, 4vw, 2.5rem); line-height: 1; }.notifications-hero h1 span { display: inline-grid; place-items: center; min-width: 30px; height: 30px; vertical-align: middle; border-radius: 50%; background: #0ea5e9; font-size: .9rem; }.notifications-hero p { margin: 0; color: #b7c7d8; font-size: .95rem; }.hero-orb { width: 100px; height: 100px; display: grid; place-items: center; border-radius: 50%; background: rgba(14,165,233,.12); border: 1px solid rgba(125,211,252,.3); color: #38bdf8; font-size: 2.6rem; box-shadow: 0 0 0 22px rgba(14,165,233,.05); }
.notifications-content { max-width: 1180px; margin: auto; }.notifications-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 16px; }.filter-tabs { display: flex; gap: 8px; }.filter-tabs button,.mark-all-btn { border: 1px solid rgba(148,163,184,.2); background: #102238; color: #cbd5e1; border-radius: 10px; height: 38px; padding: 0 14px; font: 700 .8rem inherit; cursor: pointer; transition: .2s ease; }.filter-tabs button span { display: inline-grid; place-items: center; min-width: 18px; height: 18px; margin-inline-start: 5px; padding: 0 4px; border-radius: 999px; background: rgba(148,163,184,.14); font-size: .65rem; }.filter-tabs button.active { background: #0284c7; border-color: #38bdf8; color: #fff; }.mark-all-btn { color: #38bdf8; }.mark-all-btn:hover { background: #123552; }.mark-all-btn i { margin-inline-end: 7px; }
.notification-list { display: grid; gap: 12px; }.notification-card { position: relative; display: flex; gap: 16px; align-items: flex-start; padding: 18px; border: 1px solid rgba(148,163,184,.16); border-radius: 16px; background: #0d1b2a; transition: .2s ease; }.notification-card.unread { background: linear-gradient(90deg, rgba(2,132,199,.16), #0d1b2a 36%); border-color: rgba(56,189,248,.32); }.notification-card:hover { transform: translateY(-1px); border-color: rgba(56,189,248,.45); }.notification-icon { width: 44px; height: 44px; flex: 0 0 44px; display: grid; place-items: center; border-radius: 12px; font-size: 1rem; }.notification-icon.price { background: rgba(16,185,129,.14); color: #34d399; }.notification-icon.match { background: rgba(14,165,233,.15); color: #38bdf8; }.notification-icon.tour { background: rgba(168,85,247,.15); color: #c084fc; }.notification-icon.market { background: rgba(245,158,11,.15); color: #fbbf24; }.notification-icon.system { background: rgba(59,130,246,.15); color: #60a5fa; }.notification-copy { flex: 1; min-width: 0; }.notification-heading { display: flex; gap: 12px; align-items: baseline; justify-content: space-between; }.notification-heading h2 { margin: 0; font-size: .96rem; color: #f8fafc; }.notification-heading time { color: #8194a8; white-space: nowrap; font-size: .74rem; }.notification-copy p { color: #aebed0; margin: 6px 0 10px; font-size: .85rem; line-height: 1.55; }.notification-action { border: 0; padding: 0; background: none; color: #38bdf8; cursor: pointer; font: 700 .78rem inherit; }.notification-action i { margin-inline-start: 6px; }.notification-controls { display: flex; gap: 10px; align-items: center; }.notification-controls button { border: 0; background: transparent; color: #718399; padding: 4px; cursor: pointer; }.notification-controls button:hover { color: #fb7185; }.unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }.empty-state { padding: 75px 20px; text-align: center; border: 1px dashed rgba(148,163,184,.28); border-radius: 16px; color: #94a3b8; }.empty-state i { font-size: 2.2rem; color: #38bdf8; }.empty-state h2 { color: #e2e8f0; margin: 12px 0 5px; font-size: 1.1rem; }.empty-state p { margin: 0; }
[data-theme="light"] .notifications-page { background: #f4f8fc; color: #0f172a; } [data-theme="light"] .notifications-hero { background: radial-gradient(circle at 88% 24%, rgba(14,165,233,.18), transparent 28%), linear-gradient(135deg, #fff, #edf8ff); border-color: #cfe6f5; } [data-theme="light"] .notifications-hero p { color: #64748b; } [data-theme="light"] .filter-tabs button,[data-theme="light"] .mark-all-btn,[data-theme="light"] .notification-card { background: #fff; border-color: #dce7f0; color: #475569; box-shadow: 0 5px 16px rgba(15,23,42,.04); } [data-theme="light"] .notification-card.unread { background: linear-gradient(90deg, #e7f6ff, #fff 36%); border-color: #9ddcf9; } [data-theme="light"] .notification-heading h2,[data-theme="light"] .empty-state h2 { color: #0f172a; } [data-theme="light"] .notification-copy p { color: #64748b; } [data-theme="light"] .filter-tabs button.active { color: #fff; }
@media (max-width: 620px) { .notifications-page { padding: 24px 16px 50px; }.notifications-hero { min-height: 150px; padding: 25px; }.hero-orb { display: none; }.notifications-toolbar { align-items: stretch; flex-direction: column; }.mark-all-btn { align-self: flex-start; }.notification-card { gap: 12px; padding: 14px; }.notification-heading { align-items: flex-start; flex-direction: column; gap: 3px; }.notification-heading time { white-space: normal; }.notification-controls { position: absolute; inset-inline-end: 10px; top: 10px; }.notification-copy { padding-inline-end: 20px; } }
</style>
