import { nextTick, onMounted, onUnmounted, watch } from 'vue'

const translations = {
  'OFF-PLAN & NEW LAUNCHES': 'مشاريع على الخارطة وإطلاقات جديدة',
  "Discover Dubai's": 'اكتشف مشاريع دبي',
  'New Projects': 'المشاريع الجديدة',
  'Explore the latest off-plan opportunities in Dubai. Flexible payment plans, world-class developments, and a brighter future await.': 'استكشف أحدث الفرص العقارية على الخارطة في دبي، مع خطط سداد مرنة ومشاريع عالمية ومستقبل واعد.',
  'Location': 'الموقع', 'Developer': 'المطور', 'Property Type': 'نوع العقار', 'Starting Price': 'السعر الابتدائي', 'Handover Year': 'سنة التسليم', 'Payment Plan': 'خطة السداد',
  'Search Projects': 'ابحث عن المشاريع', 'Select Area': 'اختر المنطقة', 'Select Developer': 'اختر المطور', 'Select Type': 'اختر النوع', 'Any Price': 'أي سعر', 'Any Year': 'أي سنة', 'Any Plan': 'أي خطة',
  'New Launches': 'إطلاقات جديدة', 'Latest off-plan projects': 'أحدث المشاريع على الخارطة', 'Flexible Payment Plans': 'خطط سداد مرنة', 'From 10% down payment': 'من 10% دفعة أولى', 'Expected Handover': 'التسليم المتوقع', 'Plan your future': 'خطط لمستقبلك', 'High ROI Opportunities': 'فرص عائد استثماري مرتفع', 'Prime locations, higher returns': 'مواقع مميزة وعوائد أعلى',
  'Featured New Projects': 'مشاريع جديدة مختارة', 'Handpicked off-plan developments with the best investment potential in Dubai.': 'مشاريع منتقاة بعناية بأفضل فرص الاستثمار في دبي.', 'View All Projects': 'عرض كل المشاريع', 'Starting from': 'يبدأ من', 'Handover': 'التسليم', 'View Project': 'عرض المشروع', 'Why Invest in New Projects?': 'لماذا تستثمر في المشاريع الجديدة؟', 'More Properties': 'عقارات أكثر', 'A Brighter Tomorrow': 'وغد أكثر إشراقاً', 'Trending Communities': 'المجتمعات الرائجة', "Explore new projects in Dubai's most sought-after locations.": 'استكشف المشاريع الجديدة في أكثر مناطق دبي طلباً.', 'View All Areas': 'عرض كل المناطق', 'New Projects': 'مشاريع جديدة',
  'Marina Vista Residences': 'مساكن مارينا فيستا', 'Palm Horizon Towers': 'أبراج بالم هورايزن', 'Creek Gate Residences': 'مساكن كريك غيت', 'Downtown Crest': 'داون تاون كريست', 'Dubai Marina': 'دبي مارينا', 'Downtown Dubai': 'وسط مدينة دبي', 'Dubai Creek Harbour': 'خور دبي', 'Palm Jumeirah': 'نخلة جميرا', 'Business Bay': 'الخليج التجاري', 'Jumeirah': 'جميرا',
  'NEW LAUNCH': 'إطلاق جديد', 'FEATURED': 'مميز', 'POPULAR': 'الأكثر طلباً', 'LIMITED UNITS': 'وحدات محدودة', 'Higher Investment Potential': 'فرص استثمارية أعلى', 'Get in early and benefit from capital appreciation.': 'استثمر مبكراً واستفد من ارتفاع قيمة العقار.', 'Attractive plans starting from 10% down payment.': 'خطط جذابة تبدأ من 10% دفعة أولى.', 'Modern Lifestyle Communities': 'مجتمعات عصرية', 'World-class amenities and family-friendly master plans.': 'مرافق عالمية ومجتمعات مناسبة للعائلات.', "Be Part of Dubai's Future": 'كن جزءاً من مستقبل دبي', 'Iconic developments in prime locations.': 'مشاريع أيقونية في مواقع مميزة.', 'Projects filtered successfully': 'تمت تصفية المشاريع بنجاح',
  'ABOUT US': 'من نحن', 'More Than Property': 'أكثر من مجرد عقار', 'A Better Way to Live': 'طريقة أفضل للعيش', 'Properties Listed': 'عقار معروض', 'Happy Users': 'مستخدم سعيد', 'Areas in Dubai': 'منطقة في دبي', 'OUR STORY': 'قصتنا', 'Built on Trust,': 'بُنيت على الثقة،', 'Driven by Innovation': 'وتقودها الابتكارات', 'Our Projects': 'مشاريعنا', 'WHY VIBELOCATE': 'لماذا VibeLocate', 'Your Real Estate Partner in Dubai': 'شريكك العقاري في دبي', 'OUR COMMITMENT': 'التزامنا', 'Building a Brighter Future Together': 'نبني مستقبلاً أكثر إشراقاً معاً', 'Join Our Community': 'انضم إلى مجتمعنا', 'A City of Possibilities': 'مدينة الفرص', 'Helping people find': 'نساعد الناس على إيجاد', 'not just houses,': 'ليس مجرد منازل،', 'but homes.': 'بل بيوتاً تنتمي إليهم.',
  "At VibeLocate, we believe that finding the right property is more than a transaction â€” it's a step toward a better life. We combine technology, real market insights, and local expertise to make your real estate journey in Dubai simpler, smarter, and more transparent.": 'في VibeLocate نؤمن أن العثور على العقار المناسب أكثر من مجرد صفقة؛ إنه خطوة نحو حياة أفضل. نجمع بين التقنية ورؤى السوق والخبرة المحلية لجعل رحلتك العقارية في دبي أبسط وأذكى وأكثر شفافية.',
  "VibeLocate was founded with a simple goal â€” to make the Dubai real estate market more accessible, transparent, and user-friendly for everyone. Whether you're looking to buy, rent, or invest in new projects, we provide the tools, data, and guidance you need to make confident decisions.": 'تأسست VibeLocate بهدف بسيط: جعل سوق عقارات دبي أكثر سهولة وشفافية وملاءمة للجميع. سواء كنت ترغب في الشراء أو الإيجار أو الاستثمار في مشاريع جديدة، نوفر لك الأدوات والبيانات والإرشاد لاتخاذ قرارات واثقة.',
  "Our platform brings together advanced AI search, interactive maps, and up-to-date market information, so you can explore Dubai's opportunities with ease â€” all in one place.": 'تجمع منصتنا بين البحث المتقدم بالذكاء الاصطناعي والخرائط التفاعلية ومعلومات السوق المحدثة، لتستكشف فرص دبي بسهولة في مكان واحد.',
  'We are committed to empowering individuals, families, and investors to find their perfect place in Dubai. By combining innovative technology with local expertise, we aim to create a seamless real estate experience that helps you live, invest, and grow with confidence.': 'نلتزم بتمكين الأفراد والعائلات والمستثمرين من العثور على مكانهم المثالي في دبي. ومن خلال الجمع بين التكنولوجيا المبتكرة والخبرة المحلية، نسعى إلى تجربة عقارية سلسة تساعدك على العيش والاستثمار والنمو بثقة.',
  'Our Mission': 'مهمتنا', 'Our Vision': 'رؤيتنا', 'Our Values': 'قيمنا', 'To simplify real estate in Dubai through smart technology and trusted information.': 'تبسيط التجربة العقارية في دبي من خلال التكنولوجيا الذكية والمعلومات الموثوقة.', 'To be the leading real estate platform in the UAE, known for innovation, trust, and exceptional user experience.': 'أن نكون المنصة العقارية الرائدة في الإمارات من حيث الابتكار والثقة وتجربة المستخدم الاستثنائية.', 'Trust  â€¢  Transparency\nInnovation  â€¢  Customer First\nCommunity Growth': 'الثقة • الشفافية\nالابتكار • العميل أولاً\nالنمو المجتمعي', 'Trusted Listings': 'عقارات موثقة', 'Verified properties from reputable developers and agents.': 'عقارات متحقق منها من مطورين ووكلاء معتمدين.', 'Smart Search': 'بحث ذكي', 'AI-powered recommendations tailored to your needs.': 'توصيات مدعومة بالذكاء الاصطناعي تناسب احتياجاتك.', 'Interactive Map': 'خريطة تفاعلية', 'Explore properties and areas across Dubai with ease.': 'استكشف العقارات والمناطق في دبي بسهولة.', 'Dedicated Support': 'دعم متخصص', 'Our team is here to help you at every step.': 'فريقنا هنا لمساعدتك في كل خطوة.',
  'MY FAVORITES': 'مفضلتي', 'Your': 'عقاراتك', 'Favorite': 'المفضلة', 'Properties': '', 'Save properties you love and come back to them anytime.': 'احفظ العقارات التي تحبها وعد إليها في أي وقت.', 'Saved Properties': 'العقارات المحفوظة', 'In Progress': 'قيد المتابعة', 'Recently Viewed': 'شوهدت مؤخراً', 'Price Alerts': 'تنبيهات الأسعار', 'Sort by: Newest First': 'الترتيب: الأحدث أولاً', 'All': 'الكل', 'Apartments': 'شقق', 'Villas': 'فلل', 'Studios': 'استوديوهات', 'Apartment': 'شقة', 'Villa': 'فيلا', 'Studio': 'استوديو', 'Beds': 'غرف', 'Baths': 'حمامات', 'Completion:': 'التسليم:', 'View Details': 'عرض التفاصيل', 'Your dream home': 'منزل أحلامك', 'is still out there!': 'ما زال بانتظارك!', 'Keep exploring and save more': 'واصل الاستكشاف واحفظ المزيد', 'properties to your favorites.': 'من العقارات في مفضلتك.', 'Browse More Properties': 'استعرض المزيد من العقارات', 'No saved properties here': 'لا توجد عقارات محفوظة هنا', 'Explore Properties': 'استكشف العقارات',
  'Home': 'الرئيسية', 'Add Property': 'أضف عقاراً', 'Add New Property': 'أضف عقاراً جديداً', 'Dubai Real Estate Live Network': 'شبكة دبي العقارية المباشرة', 'Basic Details': 'التفاصيل الأساسية', 'Specs & Location': 'المواصفات والموقع', 'Features & Media': 'المزايا والوسائط', 'Contact & Publish': 'التواصل والنشر', 'Property Title': 'عنوان العقار', 'Listing Type': 'نوع الإعلان', 'For Sale': 'للبيع', 'Buy Property': 'شراء عقار', 'For Rent': 'للإيجار', 'Lease Property': 'تأجير عقار', 'Apartment': 'شقة', 'Villa': 'فيلا', 'Townhouse': 'تاون هاوس', 'Penthouse': 'بنتهاوس', 'Commercial': 'تجاري', 'Price (in AED)': 'السعر (بالدرهم)', 'Property Status': 'حالة العقار', 'Ready to Move': 'جاهز للسكن', 'Completed': 'مكتمل', 'Off-Plan': 'على الخارطة', 'Under Construction': 'قيد الإنشاء', 'Continue to Specs & Location': 'متابعة إلى المواصفات والموقع',
  'My Profile': 'ملفي الشخصي', 'Manage your account, preferences, and saved properties': 'أدر حسابك وتفضيلاتك وعقاراتك المحفوظة', 'Inquiries': 'الاستفسارات', 'Search Alerts': 'تنبيهات البحث', 'Properties Viewed': 'العقارات المشاهدة', 'View messages': 'عرض الرسائل', 'Manage': 'إدارة', 'See history': 'عرض السجل', 'View all': 'عرض الكل', 'Your Preferences': 'تفضيلاتك', 'Profile Information': 'معلومات الملف الشخصي', 'Edit Profile': 'تعديل الملف الشخصي', 'Full Name': 'الاسم الكامل', 'Email Address': 'البريد الإلكتروني', 'Phone Number': 'رقم الهاتف', 'Preferred Area': 'المنطقة المفضلة', 'Account Type': 'نوع الحساب', 'Recently Viewed': 'شوهدت مؤخراً', 'My Properties': 'عقاراتي', 'My Preferences': 'تفضيلاتي', 'Account Settings': 'إعدادات الحساب', 'Log Out': 'تسجيل الخروج', 'Unlock More with VibeLocate AI Pro': 'افتح المزيد مع VibeLocate AI Pro', 'Upgrade Now': 'الترقية الآن'
}

const originals = new WeakMap()

const translateDom = (lang) => {
  const root = document.body
  if (!root) return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let node
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('.site-header, .app-footer, footer')) continue
    const text = node.nodeValue.trim()
    if (!text) continue
    if (!originals.has(node)) originals.set(node, node.nodeValue)
    const original = originals.get(node)
    const normalized = original.trim()
    if (lang === 'ar' && translations[normalized] !== undefined) {
      const leading = original.match(/^\s*/)?.[0] || ''
      const trailing = original.match(/\s*$/)?.[0] || ''
      const translated = `${leading}${translations[normalized]}${trailing}`
      if (node.nodeValue !== translated) node.nodeValue = translated
    } else if (lang !== 'ar') {
      if (node.nodeValue !== original) node.nodeValue = original
    }
  }

  root.querySelectorAll('[placeholder], [title]').forEach((el) => {
    if (el.closest('.site-header, .app-footer, footer')) return
    for (const attr of ['placeholder', 'title']) {
      if (!el.hasAttribute(attr)) continue
      let saved = originals.get(el)
      if (!saved) { saved = {}; originals.set(el, saved) }
      if (!saved[attr]) saved[attr] = el.getAttribute(attr)
      const original = saved[attr]
      const translated = lang === 'ar' && translations[original] ? translations[original] : original
      if (el.getAttribute(attr) !== translated) el.setAttribute(attr, translated)
    }
  })
}

export function usePageTranslations(lang, route) {
  const apply = async () => { await nextTick(); translateDom(lang.value) }
  let observer
  onMounted(() => {
    apply()
    observer = new MutationObserver(() => {
      if (lang.value === 'ar') apply()
    })
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  })
  onUnmounted(() => observer?.disconnect())
  watch([lang, route], apply)
}
