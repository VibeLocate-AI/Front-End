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
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
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
            <li><a href="#help" @click.prevent="showNotice(isRtl ? 'مركز المساعدة قريباً' : 'Help Center is coming soon')">{{ isRtl ? 'مركز المساعدة' : 'Help Center' }}</a></li>
            <li><a href="#safety" @click.prevent="showNotice(isRtl ? 'معلومات الأمان والسلامة' : 'Safety & Security information')">{{ isRtl ? 'الأمان والسلامة' : 'Safety & Security' }}</a></li>
            <li><a href="#terms" @click.prevent="showNotice(isRtl ? 'الشروط والأحكام' : 'Terms & Conditions')">{{ isRtl ? 'الشروط والأحكام' : 'Terms & Conditions' }}</a></li>
            <li><a href="#privacy" @click.prevent="showNotice(isRtl ? 'سياسة الخصوصية' : 'Privacy Policy')">{{ isRtl ? 'سياسة الخصوصية' : 'Privacy Policy' }}</a></li>
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
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { isRtl, theme: currentTheme } = useThemeAndLanguage()

const toastMessage = ref('')
let toastTimer = null

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
</style>
