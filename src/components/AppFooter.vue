<template>
  <footer class="footer site-footer" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="currentTheme" id="contact">
    <div class="footer-container">
      <div class="footer-top">
        <!-- Brand Column -->
        <div class="footer-brand">
          <router-link to="/home" class="logo footer-logo">
            <img src="/logo_transparent.png" alt="VibeLocate AI Logo" class="brand-logo-img footer-logo-img">
            <div class="brand-text footer-brand-text">
              <span class="brand-title">Vibe<span class="brand-accent">Locate</span></span>
              <span class="brand-badge">AI</span>
            </div>
          </router-link>
          <p class="brand-desc">
            {{ isRtl ? 'تمكين العقارات الحديثة بالذكاء الاصطناعي، وقوائم فاخرة موثوقة، وتجارب تأجير مخصصة في جميع أنحاء العالم.' : 'Empowering modern real estate with artificial intelligence, verified luxury listings, and tailored leasing experiences worldwide.' }}
          </p>
          <div class="social-links">
            <a href="https://www.facebook.com/profile.php?id=61594702439169&locale=ar_AR" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://x.com/VibeLocateAI" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="https://www.instagram.com/vibelocate.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://www.linkedin.com/company/vibelocate-ai" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>

        <!-- Quick Links Column -->
        <div class="footer-links-col">
          <h4 class="footer-heading">{{ isRtl ? 'روابط سريعة' : 'Quick Links' }}</h4>
          <ul class="footer-nav-list">
            <li><router-link to="/home">{{ isRtl ? 'الرئيسية' : 'Home' }}</router-link></li>
            <li><router-link to="/buy">{{ isRtl ? 'شراء' : 'Buy' }}</router-link></li>
            <li><router-link to="/rent">{{ isRtl ? 'إيجار' : 'Rent' }}</router-link></li>
            <li><router-link to="/new-projects">{{ isRtl ? 'مشاريع جديدة' : 'New Projects' }}</router-link></li>
            <li><router-link to="/map">{{ isRtl ? 'الخريطة التفاعلية' : 'Interactive Map' }}</router-link></li>
            <li><router-link to="/about">{{ isRtl ? 'من نحن' : 'About Us' }}</router-link></li>
          </ul>
        </div>

        <!-- Support Column -->
        <div class="footer-links-col">
          <h4 class="footer-heading">{{ isRtl ? 'الدعم' : 'Support' }}</h4>
          <ul class="footer-nav-list">
            <li><a href="#help" @click.prevent="openSupportModal('help')">{{ isRtl ? 'مركز المساعدة' : 'Help Center' }}</a></li>
            <li><a href="#safety" @click.prevent="openSupportModal('safety')">{{ isRtl ? 'الأمان والسلامة' : 'Safety & Security' }}</a></li>
            <li><a href="#terms" @click.prevent="openSupportModal('terms')">{{ isRtl ? 'الشروط والأحكام' : 'Terms & Conditions' }}</a></li>
            <li><a href="#privacy" @click.prevent="openSupportModal('privacy')">{{ isRtl ? 'سياسة الخصوصية' : 'Privacy Policy' }}</a></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div class="footer-links-col">
          <h4 class="footer-heading">{{ isRtl ? 'تواصل معنا' : 'Contact' }}</h4>
          <ul class="contact-info-list">
            <li>
              <i class="fa-solid fa-location-dot"></i>
              <span>742 Evergreen Blvd, Beverly Hills, CA</span>
            </li>
            <li>
              <i class="fa-solid fa-envelope"></i>
              <span>contact@vibelocate.ai</span>
            </li>
            <li>
              <i class="fa-solid fa-phone"></i>
              <span>+1 (800) 456-7890</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom">
        <div class="bottom-container">
          <p>&copy; 2026 VibeLocate AI. {{ isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.' }}</p>
        </div>
      </div>
    </div>

    <!-- Mini Toast -->
    <transition name="toast-fade">
      <div v-if="toastMessage" class="footer-toast">
        <i class="fa-solid fa-circle-info"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- Support Modal (Help, Safety, Terms, Privacy) -->
    <transition name="modal-fade">
      <div v-if="isSupportModalOpen" class="support-modal-backdrop" @click.self="closeSupportModal">
        <div class="support-modal-dialog" role="dialog" aria-modal="true">
          <div class="support-modal-header">
            <div class="support-tabs-nav">
              <button 
                type="button" 
                :class="{ active: activeSupportTab === 'help' }" 
                @click="activeSupportTab = 'help'"
              >
                <i class="fa-solid fa-circle-question"></i>
                <span>{{ isRtl ? 'مركز المساعدة' : 'Help Center' }}</span>
              </button>
              <button 
                type="button" 
                :class="{ active: activeSupportTab === 'safety' }" 
                @click="activeSupportTab = 'safety'"
              >
                <i class="fa-solid fa-shield-halved"></i>
                <span>{{ isRtl ? 'الأمان والسلامة' : 'Safety' }}</span>
              </button>
              <button 
                type="button" 
                :class="{ active: activeSupportTab === 'terms' }" 
                @click="activeSupportTab = 'terms'"
              >
                <i class="fa-solid fa-scale-balanced"></i>
                <span>{{ isRtl ? 'الشروط والأحكام' : 'Terms' }}</span>
              </button>
              <button 
                type="button" 
                :class="{ active: activeSupportTab === 'privacy' }" 
                @click="activeSupportTab = 'privacy'"
              >
                <i class="fa-solid fa-user-lock"></i>
                <span>{{ isRtl ? 'سياسة الخصوصية' : 'Privacy' }}</span>
              </button>
            </div>
            <button class="support-close-btn" @click="closeSupportModal" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="support-modal-body">
            <!-- 1. HELP CENTER -->
            <div v-if="activeSupportTab === 'help'" class="support-tab-content">
              <h3>{{ isRtl ? 'مركز المساعدة والدعم الفني' : 'VibeLocate AI Help Center' }}</h3>
              <p>{{ isRtl ? 'نحن هنا لمساعدتك في كل خطوة خلال رحلتك العقارية المدعومة بالذكاء الاصطناعي.' : 'We are here to assist you at every step of your AI-powered real estate journey.' }}</p>
              
              <div class="faq-list">
                <div class="faq-item">
                  <strong>{{ isRtl ? 'كيف يتم احتساب نسبة تطابق الذكاء الاصطناعي (AI Match %)' : 'How is the AI Match % calculated?' }}</strong>
                  <p>{{ isRtl ? 'تقوم خوارزميات VibeLocate AI بتحليل متطلباتك وميزانيتك ونمط الحياة المفضل وتطابقها مع بيانات العقار والموقع والخدمات المحيطة.' : 'Our AI evaluates your requirements, budget, lifestyle preferences, and cross-references them against property specs, location amenities, and real market data.' }}</p>
                </div>
                <div class="faq-item">
                  <strong>{{ isRtl ? 'كيف أقوم بحجز موعد معاينة عقار؟' : 'How do I schedule a property inspection?' }}</strong>
                  <p>{{ isRtl ? 'انتقل إلى صفحة تفاصيل أي عقار واضغط على "حجز موعد معاينة"، وحدد التاريخ المناسب ثم أكد الحجز.' : 'Go to any property page, click "Schedule Viewing", select your preferred date/time slot, and confirm your inspection.' }}</p>
                </div>
                <div class="faq-item">
                  <strong>{{ isRtl ? 'كيف يمكنني التواصل مع خدمة العملاء؟' : 'How can I contact customer support directly?' }}</strong>
                  <p>{{ isRtl ? 'يمكنك التواصل عبر البريد: contact@vibelocate.ai أو الاتصال بالهاتف: +1 (800) 456-7890 (متاح 24/7).' : 'Email us at contact@vibelocate.ai or call +1 (800) 456-7890 (available 24/7).' }}</p>
                </div>
              </div>
            </div>

            <!-- 2. SAFETY -->
            <div v-else-if="activeSupportTab === 'safety'" class="support-tab-content">
              <h3>{{ isRtl ? 'الأمان والتحقق الموثوق' : 'Safety & Verified Listings' }}</h3>
              <p>{{ isRtl ? 'جميع العقارات والوكلاء في VibeLocate يخضعون لتدقيق صارم لضمان بيئة آمنة وخالية من الاحتيال.' : 'All properties and agents on VibeLocate AI undergo rigorous verification to provide a safe, fraud-free experience.' }}</p>
              
              <ul class="safety-points">
                <li><i class="fa-solid fa-circle-check"></i> {{ isRtl ? 'عقارات موثقة 100% مع سندات الملكية المعتمدة رسمياً.' : '100% verified properties matched with official title deeds.' }}</li>
                <li><i class="fa-solid fa-circle-check"></i> {{ isRtl ? 'وكلاء عقاريون معتمدون ومرخصون من دائرة الأراضي والأملاك (RERA).' : 'RERA-certified and licensed real estate brokers.' }}</li>
                <li><i class="fa-solid fa-circle-check"></i> {{ isRtl ? 'تشفير كامل لكافة المعاملات المالية والبيانات الحساسة (SSL 256-bit).' : 'End-to-end 256-bit SSL encryption for all data and financial transactions.' }}</li>
              </ul>
            </div>

            <!-- 3. TERMS -->
            <div v-else-if="activeSupportTab === 'terms'" class="support-tab-content">
              <h3>{{ isRtl ? 'الشروط والأحكام' : 'Terms & Conditions' }}</h3>
              <p>{{ isRtl ? 'باستخدامك لمنصة VibeLocate AI، فإنك توافق على الالتزام بشروط الاستخدام والخدمة.' : 'By accessing and using VibeLocate AI, you agree to comply with our Terms of Service.' }}</p>
              <div class="legal-text">
                <p>1. {{ isRtl ? 'دقة البيانات: نحرص على تقديم أدق معلومات العقارات والأسعار المتاحة من السجلات الرسمية.' : 'Data Accuracy: We provide authentic real estate listings and pricing derived from official registries.' }}</p>
                <p>2. {{ isRtl ? 'الحجوزات: عربون حجز المعاينة يضمن حجز الموعد الحصري مع الوكيل ويخضع لسياسة الاسترداد.' : 'Bookings: Inspection reservation deposits guarantee an exclusive agent tour and are refundable under standard policy.' }}</p>
                <p>3. {{ isRtl ? 'الاستخدام العادل لتقنيات الذكاء الاصطناعي: محرك البحث الذكي مخصص للأغراض العقارية الفردية والمؤسسية.' : 'Fair Use of AI: Our AI contextual search tools are designated for individual and verified commercial real estate activities.' }}</p>
              </div>
            </div>

            <!-- 4. PRIVACY -->
            <div v-else class="support-tab-content">
              <h3>{{ isRtl ? 'سياسة الخصوصية' : 'Privacy Policy' }}</h3>
              <p>{{ isRtl ? 'نحن نولي خصوصية بياناتك اهتماماً بالغاً ونلتزم بأعلى معايير حماية البيانات العالمية (GDPR).' : 'We take data privacy seriously and adhere to the highest international data protection standards (GDPR compliant).' }}</p>
              <div class="legal-text">
                <p>• {{ isRtl ? 'لا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث على الإطلاق.' : 'We never sell or rent your personal information to third parties.' }}</p>
                <p>• {{ isRtl ? 'بيانات البحث والتفضيلات تُستخدم حصرياً لتحسين دقة توصيات الذكاء الاصطناعي لك.' : 'Search history and preferences are used solely to personalize your AI match recommendations.' }}</p>
                <p>• {{ isRtl ? 'يحق لك في أي وقت طلب حذف حسابك وبياناتك المخزنة بشكل كامل عبر إعدادات الملف الشخصي.' : 'You have the right to request full erasure of your account and personal data at any time.' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { isRtl, theme: currentTheme } = useThemeAndLanguage()

const toastMessage = ref('')
let toastTimer = null

const isSupportModalOpen = ref(false)
const activeSupportTab = ref('help')

const openSupportModal = (tab = 'help') => {
  activeSupportTab.value = tab
  isSupportModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeSupportModal = () => {
  isSupportModalOpen.value = false
  document.body.style.overflow = ''
}

const showNotice = (msg) => {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}
</script>

<style scoped>
.footer {
  background-color: #070d19;
  color: rgba(255, 255, 255, 0.75);
  padding-top: 5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: inherit;
  position: relative;
  z-index: 10;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 3.5rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Brand */
.footer-brand {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  margin-bottom: 0.5rem;
}

.footer-logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(0, 210, 255, 0.45));
}

.footer-brand-text {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.brand-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.brand-accent {
  color: #00d2ff;
}

.brand-badge {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #00d2ff;
  background: rgba(0, 210, 255, 0.15);
  border: 1px solid rgba(0, 210, 255, 0.35);
  padding: 2px 6px;
  border-radius: 5px;
}

.footer-brand .brand-desc {
  margin-top: 1.2rem;
  font-size: 0.92rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.65);
}

/* Social Links */
.social-links {
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.social-links a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  color: #ffffff;
  transition: all 0.25s ease;
  text-decoration: none;
  font-size: 0.95rem;
}

.social-links a:hover {
  background: #0072ff;
  border-color: #0072ff;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 114, 255, 0.35);
}

/* Headings */
.footer-heading {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  position: relative;
}

/* Nav Lists */
.footer-links-col ul,
.footer-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links-col ul li,
.footer-nav-list li {
  margin-bottom: 0.85rem;
}

.footer-links-col ul li a,
.footer-nav-list a {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.92rem;
  text-decoration: none;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-links-col ul li a:hover,
.footer-nav-list a:hover {
  color: #00d2ff;
  transform: translateX(4px);
}

[dir="rtl"] .footer-links-col ul li a:hover,
[dir="rtl"] .footer-nav-list a:hover {
  transform: translateX(-4px);
}

/* Contact List */
.contact-info-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  font-size: 0.92rem;
  margin-bottom: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
}

.contact-info-list li i {
  color: #00d2ff;
  font-size: 1rem;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

/* Bottom Bar */
.footer-bottom {
  width: 100%;
  padding: 1.8rem 0;
}

.bottom-container {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.bottom-container p {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.88rem;
  margin: 0;
}

/* Toast Notice */
.footer-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #0f172a;
  border: 1px solid rgba(0, 210, 255, 0.4);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.footer-toast i {
  color: #00d2ff;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* Light Theme Support */
[data-theme="light"] .footer {
  background-color: #f8fafc;
  color: #334155;
  border-top-color: #e2e8f0;
}

[data-theme="light"] .brand-title {
  color: #0f172a;
}

[data-theme="light"] .footer-brand .brand-desc {
  color: #64748b;
}

[data-theme="light"] .social-links a {
  background: #ffffff;
  border-color: #e2e8f0;
  color: #475569;
}

[data-theme="light"] .social-links a:hover {
  background: #0072ff;
  border-color: #0072ff;
  color: #ffffff;
}

[data-theme="light"] .footer-heading {
  color: #0f172a;
}

[data-theme="light"] .footer-links-col ul li a,
[data-theme="light"] .footer-nav-list a {
  color: #64748b;
}

[data-theme="light"] .footer-links-col ul li a:hover,
[data-theme="light"] .footer-nav-list a:hover {
  color: #0072ff;
}

[data-theme="light"] .contact-info-list li {
  color: #475569;
}

[data-theme="light"] .contact-info-list li i {
  color: #0072ff;
}

[data-theme="light"] .footer-top {
  border-bottom-color: #e2e8f0;
}

[data-theme="light"] .bottom-container p {
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 991px) {
  .footer {
    padding-top: 3.5rem;
  }
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    padding-bottom: 2.5rem;
  }
}

@media (max-width: 575px) {
  .footer {
    padding-top: 2.5rem;
  }
  .footer-top {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-bottom: 2rem;
  }
  .footer-container {
    padding: 0 1.25rem;
  }
}

/* Support Modal Styles */
.support-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(4, 9, 20, 0.78);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.support-modal-dialog {
  background: #0f172a;
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  max-width: 720px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
  animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.94) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.support-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
}

.support-tabs-nav {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.support-tabs-nav button {
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  padding: 0.5rem 0.9rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.support-tabs-nav button:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.05);
}

.support-tabs-nav button.active {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  border-color: rgba(56, 189, 248, 0.3);
}

.support-close-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 0;
  color: #94a3b8;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.support-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.support-modal-body {
  padding: 1.5rem 1.8rem;
  overflow-y: auto;
}

.support-tab-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #f8fafc;
}

.support-tab-content p {
  color: #94a3b8;
  font-size: 0.92rem;
  line-height: 1.6;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.2rem;
}

.faq-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 1rem;
  border-radius: 12px;
}

.faq-item strong {
  display: block;
  font-size: 0.95rem;
  color: #e2e8f0;
  margin-bottom: 0.4rem;
}

.faq-item p {
  margin: 0;
  font-size: 0.88rem;
}

.safety-points {
  list-style: none;
  padding: 0;
  margin: 1.2rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.safety-points li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.92rem;
  color: #e2e8f0;
}

.safety-points li i {
  color: #34d399;
}

.legal-text {
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.legal-text p {
  background: rgba(255, 255, 255, 0.02);
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border-inline-start: 3px solid #38bdf8;
  margin: 0;
}
</style>
