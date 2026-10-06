<template>
  <div class="about-page" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="currentTheme">

    <main>
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <span class="eyebrow"><i class="fa-solid fa-gem"></i> {{ isRtl ? 'من نحن' : 'ABOUT US' }}</span>
          <h1 v-if="isRtl">أكثر من مجرد عقار<br><strong>أسلوب حياة أفضل</strong></h1>
          <h1 v-else>More Than Property<br><strong>A Better Way to Live</strong></h1>
          
          <p v-if="isRtl">في VibeLocate، نؤمن أن العثور على العقار المناسب هو أكثر من مجرد صفقة — إنه خطوة نحو حياة أفضل. نجمع بين أحدث تقنيات الذكاء الاصطناعي، وتحليلات السوق الدقيقة، والخبرة المحلية لجعل رحلتك العقارية في دبي أكثر ذكاءً وشفافية وسهولة.</p>
          <p v-else>At VibeLocate, we believe that finding the right property is more than a transaction — it's a step toward a better life. We combine technology, real market insights, and local expertise to make your real estate journey in Dubai simpler, smarter, and more transparent.</p>
          
          <div class="hero-stats">
            <div>
              <i class="fa-solid fa-house"></i>
              <b>10K+</b>
              <span>{{ isRtl ? 'عقار معروض' : 'Properties Listed' }}</span>
            </div>
            <div>
              <i class="fa-solid fa-users"></i>
              <b>25K+</b>
              <span>{{ isRtl ? 'مستخدم راضٍ' : 'Happy Users' }}</span>
            </div>
            <div>
              <i class="fa-solid fa-location-dot"></i>
              <b>30+</b>
              <span>{{ isRtl ? 'منطقة في دبي' : 'Areas in Dubai' }}</span>
            </div>
          </div>
        </div>

        <div class="dubai-sign">
          <strong>Dubai</strong>
          <span>{{ isRtl ? 'غد أكثر إشراقاً' : 'A BRIGHTER\nTOMORROW' }}</span>
          <i></i>
        </div>
      </section>

      <!-- Story Section -->
      <section class="story section-light">
        <div class="story-photo">
          <img src="/images/photo-1600210492486-724fe5c67fb0.jfif" alt="Dubai Architecture">
          <div class="quote">
            <i class="fa-solid fa-quote-left"></i>
            <strong v-if="isRtl">نساعد الناس في العثور على موطن حقيقي،<br>وليس مجرد منزل.</strong>
            <strong v-else>Helping people find<br>not just houses,<br>but homes.</strong>
          </div>
        </div>

        <div class="story-copy">
          <span class="section-label"><i class="fa-solid fa-book-open"></i> {{ isRtl ? 'قصتنا' : 'OUR STORY' }}</span>
          <h2 v-if="isRtl">بُنيت على الثقة،<br>مدفوعة بالابتكار</h2>
          <h2 v-else>Built on Trust,<br>Driven by Innovation</h2>
          
          <p v-if="isRtl">تأسست VibeLocate بهدف واضح — جعل سوق العقارات في دبي أكثر شفافية وسهولة ووصولاً للجميع. سواء كنت تبحث عن الشراء أو الاستئجار أو الاستثمار في أحدث المشاريع، فنحن نوفر لك الأدوات والبيانات المعتمدة لاتخاذ قرارات واثقة.</p>
          <p v-else>VibeLocate was founded with a simple goal — to make the Dubai real estate market more accessible, transparent, and user-friendly for everyone. Whether you're looking to buy, rent, or invest in new projects, we provide the tools, data, and guidance you need to make confident decisions.</p>
          
          <p v-if="isRtl">تجمع منصتنا بين البحث المدعوم بالذكاء الاصطناعي، الخرائط التفاعلية الذكية، وتحليلات الأجواء المحيطة (VibeScore)، لتكتشف فرص دبي بكل سهولة في مكان واحد.</p>
          <p v-else>Our platform brings together advanced AI search, interactive maps, and up-to-date market information, so you can explore Dubai's opportunities with ease — all in one place.</p>
          
          <button @click="$router.push('/new-projects')">
            {{ isRtl ? 'استكشف المشاريع الجديدة' : 'Our Projects' }} 
            <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
          </button>
        </div>

        <aside class="pillars">
          <div v-for="item in pillars" :key="item.title">
            <i :class="item.icon"></i>
            <section>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </section>
          </div>
        </aside>
      </section>

      <!-- Why VibeLocate Section -->
      <section class="why">
        <span class="section-label"><i class="fa-solid fa-sparkles"></i> {{ isRtl ? 'لماذا فايب لوكيت' : 'WHY VIBELOCATE' }}</span>
        <h2 v-if="isRtl">شريكك العقاري الذكي في دبي</h2>
        <h2 v-else>Your Real Estate Partner in Dubai</h2>
        
        <div class="benefits">
          <div v-for="item in benefits" :key="item.title">
            <i :class="item.icon"></i>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </section>

      <!-- Commitment Section -->
      <section class="commitment section-light">
        <div class="commit-copy">
          <span class="section-label"><i class="fa-solid fa-handshake"></i> {{ isRtl ? 'التزامنا' : 'OUR COMMITMENT' }}</span>
          <h2 v-if="isRtl">نبني مستقبلاً أكثر إشراقاً معاً</h2>
          <h2 v-else>Building a Brighter Future Together</h2>
          
          <p v-if="isRtl">نلتزم بتمكين الأفراد والعائلات والمستثمرين من العثور على مكانهم المثالي في دبي. عبر دمج أحدث التقنيات مع الرؤى الميدانية، نوفر تجربة سلسة تمكنك من الاستقرار والنمو والاستثمار بأمان تام.</p>
          <p v-else>We are committed to empowering individuals, families, and investors to find their perfect place in Dubai. By combining innovative technology with local expertise, we aim to create a seamless real estate experience that helps you live, invest, and grow with confidence.</p>
          
          <button @click="$router.push('/register')">
            {{ isRtl ? 'انضم إلى مجتمعنا' : 'Join Our Community' }} 
            <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
          </button>
        </div>

        <div class="commit-collage">
          <img class="main-img" src="/images/photo-1512917774080-9991f1c4c750.jfif" alt="Luxury Villa">
          <img class="small-img" src="/images/photo-1600585154340-be6161a56a0c.avif" alt="Modern Interior">
          <div class="city-box">
            <i class="fa-regular fa-building"></i>
            <strong>Dubai</strong>
            <span>{{ isRtl ? 'مدينة الفرص والابتكار' : 'A City of Possibilities' }}</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const { isRtl, theme: currentTheme } = useThemeAndLanguage()

const pillars = computed(() => isRtl.value ? [
  { icon: 'fa-solid fa-bullseye', title: 'مهمتنا', text: 'تبسيط التجربة العقارية في دبي من خلال التكنولوجيا الذكية والمعلومات الموثوقة.' },
  { icon: 'fa-regular fa-gem', title: 'رؤيتنا', text: 'أن نكون المنصة العقارية الرائدة في الإمارات من حيث الابتكار والثقة وتجربة المستخدم الاستثنائية.' },
  { icon: 'fa-solid fa-people-group', title: 'قيمنا', text: 'الثقة • الشفافية\nالابتكار • العميل أولاً\nالنمو المجتمعي' }
] : [
  { icon: 'fa-solid fa-bullseye', title: 'Our Mission', text: 'To simplify real estate in Dubai through smart technology and trusted information.' },
  { icon: 'fa-regular fa-gem', title: 'Our Vision', text: 'To be the leading real estate platform in the UAE, known for innovation, trust, and exceptional user experience.' },
  { icon: 'fa-solid fa-people-group', title: 'Our Values', text: 'Trust  •  Transparency\nInnovation  •  Customer First\nCommunity Growth' }
])

const benefits = computed(() => isRtl.value ? [
  { icon: 'fa-solid fa-shield-halved', title: 'عقارات موثقة', text: 'عقارات متحقق منها من مطورين ووكلاء معتمدين رسمياً.' },
  { icon: 'fa-solid fa-bolt', title: 'بحث ذكي', text: 'توصيات فورية مدعومة بالذكاء الاصطناعي تناسب متطلباتك.' },
  { icon: 'fa-regular fa-map', title: 'خريطة تفاعلية', text: 'استكشف المناطق ونقاط الاهتمام في دبي بسهولة مطلقة.' },
  { icon: 'fa-solid fa-headset', title: 'دعم متخصص', text: 'فريقنا والوكلاء المعتمدون هنا لمساعدتك في كل خطوة.' }
] : [
  { icon: 'fa-solid fa-shield-halved', title: 'Trusted Listings', text: 'Verified properties from reputable developers and agents.' },
  { icon: 'fa-solid fa-bolt', title: 'Smart Search', text: 'AI-powered recommendations tailored to your needs.' },
  { icon: 'fa-regular fa-map', title: 'Interactive Map', text: 'Explore properties and areas across Dubai with ease.' },
  { icon: 'fa-solid fa-headset', title: 'Dedicated Support', text: 'Our team is here to help you at every step.' }
])
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.about-page {
  min-height: 100vh;
  background: #ffffff;
  color: #091a35;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Dark Theme Support */
.about-page[data-theme="dark"] {
  background: #070d19;
  color: #e2e8f0;
}

/* Hero Section */
.hero {
  min-height: 500px;
  position: relative;
  background: linear-gradient(90deg, rgba(2, 17, 31, 0.98) 0%, rgba(2, 17, 31, 0.88) 35%, rgba(2, 17, 31, 0.4) 65%, rgba(2, 17, 31, 0.15) 100%),
              url('/images/about-hero.png') center / cover no-repeat;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

[dir="rtl"] .hero {
  background: linear-gradient(270deg, rgba(2, 17, 31, 0.98) 0%, rgba(2, 17, 31, 0.88) 35%, rgba(2, 17, 31, 0.4) 65%, rgba(2, 17, 31, 0.15) 100%),
              url('/images/about-hero.png') center / cover no-repeat;
}

.hero-content {
  padding: 70px 40px 70px 5%;
  max-width: 580px;
  position: relative;
  z-index: 2;
  text-align: left;
}

[dir="rtl"] .hero-content {
  padding: 70px 5% 70px 40px;
  text-align: right;
  margin-left: auto;
  margin-right: 0;
}

.eyebrow, .section-label {
  color: #0cc8ef;
  font-weight: 800;
  letter-spacing: 1.5px;
  font-size: 11px;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.hero h1 {
  font-size: 42px;
  line-height: 1.15;
  margin: 18px 0;
  font-weight: 700;
}

.hero h1 strong {
  color: #0fbde8;
}

.hero-content > p {
  font-size: 14px;
  line-height: 1.7;
  color: #cbd5e1;
  max-width: 520px;
}

.hero-stats {
  display: flex;
  gap: 60px;
  margin-top: 36px;
}

.hero-stats div {
  display: flex;
  flex-direction: column;
}

.hero-stats i {
  font-size: 28px;
  color: #09c8ef;
  margin-bottom: 8px;
}

.hero-stats b {
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
}

.hero-stats span {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.dubai-sign {
  position: absolute;
  right: 8%;
  top: 60px;
  text-align: center;
  z-index: 1;
  pointer-events: none;
  opacity: 0.85;
}

[dir="rtl"] .dubai-sign {
  right: auto;
  left: 8%;
}

.dubai-sign strong {
  display: block;
  font-family: 'Brush Script MT', cursive, sans-serif;
  font-size: 56px;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(12, 200, 239, 0.4);
}

.dubai-sign span {
  display: block;
  letter-spacing: 2px;
  font-size: 13px;
  color: #cbd5e1;
}

.dubai-sign i {
  display: block;
  width: 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  margin: 16px auto;
}

/* Light / Dark Sections */
.section-light {
  padding: 60px 5%;
  max-width: 1400px;
  margin: auto;
}

.about-page[data-theme="dark"] .section-light {
  background: transparent;
}

/* Story */
.story {
  display: grid;
  grid-template-columns: 1fr 1fr 0.8fr;
  gap: 40px;
  align-items: center;
}

.story-photo {
  height: 380px;
  position: relative;
}

.story-photo > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.quote {
  position: absolute;
  left: 20px;
  bottom: 20px;
  width: 210px;
  padding: 18px;
  background: rgba(8, 35, 61, 0.94);
  backdrop-filter: blur(10px);
  color: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[dir="rtl"] .quote {
  left: auto;
  right: 20px;
}

.quote i {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #126df2;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 11px;
  margin-bottom: 10px;
}

.quote strong {
  font-size: 13px;
  line-height: 1.45;
  display: block;
  font-weight: 600;
}

.story-copy h2, .commit-copy h2 {
  font-size: 32px;
  line-height: 1.25;
  margin: 12px 0 18px;
  font-weight: 700;
  color: inherit;
}

.story-copy p, .commit-copy p {
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
  margin-bottom: 14px;
}

.about-page[data-theme="dark"] .story-copy p,
.about-page[data-theme="dark"] .commit-copy p {
  color: #94a3b8;
}

.story-copy button, .commit-copy button {
  border: 0;
  background: linear-gradient(135deg, #0969f7, #0284c7);
  color: #fff;
  border-radius: 10px;
  padding: 13px 24px;
  font-weight: 700;
  font-size: 13px;
  margin-top: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.story-copy button:hover, .commit-copy button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(9, 105, 247, 0.35);
}

/* Pillars */
.pillars {
  background: linear-gradient(145deg, #f8faff, #edf4ff);
  border-radius: 16px;
  padding: 26px 22px;
  display: grid;
  gap: 22px;
  border: 1px solid rgba(18, 109, 242, 0.08);
}

.about-page[data-theme="dark"] .pillars {
  background: linear-gradient(145deg, #0d1b2a, #112238);
  border-color: rgba(255, 255, 255, 0.08);
}

.pillars > div {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 14px;
  align-items: start;
}

.pillars > div > i {
  font-size: 26px;
  color: #1175fa;
  margin-top: 2px;
}

.pillars h3 {
  font-size: 14px;
  color: #0f4c9c;
  margin: 0 0 6px;
  font-weight: 700;
}

.about-page[data-theme="dark"] .pillars h3 {
  color: #38bdf8;
}

.pillars p {
  white-space: pre-line;
  font-size: 12px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

.about-page[data-theme="dark"] .pillars p {
  color: #cbd5e1;
}

/* Why VibeLocate */
.why {
  background: linear-gradient(rgba(3, 21, 39, 0.92), rgba(3, 21, 39, 0.95)),
              url('/images/A1.png') center / cover no-repeat;
  color: #fff;
  text-align: center;
  padding: 60px 6%;
}

.why h2 {
  font-size: 32px;
  margin: 16px 0 40px;
  font-weight: 700;
}

.benefits {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1200px;
  margin: auto;
  gap: 30px;
}

.benefits > div {
  padding: 0 10px;
}

.benefits i {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(145deg, #148cff, #1558d9);
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
  font-size: 22px;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(7, 99, 243, 0.4);
}

.benefits h3 {
  font-size: 15px;
  margin: 0 0 8px;
  font-weight: 700;
}

.benefits p {
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

/* Commitment */
.commitment {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding-top: 60px;
  padding-bottom: 60px;
}

.commit-copy p {
  max-width: 540px;
}

.commit-collage {
  height: 280px;
  position: relative;
}

.commit-collage img {
  object-fit: cover;
  border-radius: 14px;
}

.main-img {
  width: 60%;
  height: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.small-img {
  position: absolute;
  width: 50%;
  height: 80%;
  right: 0;
  top: 30px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

[dir="rtl"] .small-img {
  right: auto;
  left: 0;
}

.city-box {
  position: absolute;
  right: 25%;
  bottom: 10px;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 0 10px 30px rgba(22, 48, 75, 0.18);
  display: grid;
  grid-template-columns: 28px 1fr;
  grid-template-rows: auto auto;
  align-items: center;
  z-index: 3;
}

[dir="rtl"] .city-box {
  right: auto;
  left: 25%;
}

.about-page[data-theme="dark"] .city-box {
  background: #0f1f33;
  color: #f1f5f9;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.city-box i {
  grid-row: 1 / 3;
  color: #1476f4;
  font-size: 22px;
}

.city-box strong {
  font-size: 13px;
  font-weight: 700;
}

.city-box span {
  font-size: 10px;
  color: #64748b;
}

.about-page[data-theme="dark"] .city-box span {
  color: #94a3b8;
}

/* Responsiveness */
@media (max-width: 1050px) {
  .story {
    grid-template-columns: 1fr 1fr;
  }
  .pillars {
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, 1fr);
  }
  .benefits {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: 480px;
  }
  .hero-content {
    padding: 40px 20px;
  }
  .hero h1 {
    font-size: 32px;
  }
  .hero-stats {
    gap: 30px;
  }
  .dubai-sign {
    display: none;
  }
  .story, .commitment {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 30px 20px;
  }
  .story-photo {
    height: 280px;
  }
  .pillars {
    grid-template-columns: 1fr;
  }
  .benefits {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .commit-collage {
    height: 220px;
  }
}
</style>
