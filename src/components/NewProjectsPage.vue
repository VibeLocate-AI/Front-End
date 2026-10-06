<template>
  <div class="projects-page" :dir="isRtl ? 'rtl' : 'ltr'">

    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><i class="fa-regular fa-building"></i> {{ isRtl ? 'عقارات على الخارطة ومشاريع حديثة' : 'OFF-PLAN & NEW LAUNCHES' }}</span>
        <h1>
          {{ isRtl ? 'اكتشف أرقى' : 'Discover Dubai\'s' }}<br>
          <strong>{{ isRtl ? 'مشاريع دبي الجديدة' : 'New Projects' }}</strong>
        </h1>
        <p>
          {{ isRtl ? 'استكشف أحدث الفرص الاستثمارية قيد الإنشاء في دبي مع خطط سداد مرنة ومجتمعات عالمية تلبي طموحاتك.' : 'Explore the latest off-plan opportunities in Dubai. Flexible payment plans, world-class developments, and a brighter future await.' }}
        </p>
      </div>
      <div class="filter-bar">
        <FilterSelect icon="fa-location-dot" :label="isRtl ? 'المنطقة' : 'Location'" v-model="filters.location" :options="locationOptions" />
        <FilterSelect icon="fa-building" :label="isRtl ? 'المطور / الوكالة' : 'Developer'" v-model="filters.developer" :options="developerOptions" />
        <FilterSelect icon="fa-house" :label="isRtl ? 'نوع العقار' : 'Property Type'" v-model="filters.type" :options="typeOptions" />
        <FilterSelect icon="fa-coins" :label="isRtl ? 'السعر المبدئي' : 'Starting Price'" v-model="filters.price" :options="['Any Price','Under AED 1M','AED 1M - 3M','AED 3M+']" />
        <FilterSelect icon="fa-calendar" :label="isRtl ? 'سنة التسليم' : 'Handover Year'" v-model="filters.year" :options="['Any Year','2026','2027','2028','2029']" />
        <FilterSelect icon="fa-credit-card" :label="isRtl ? 'خطة الدفع' : 'Payment Plan'" v-model="filters.plan" :options="['Any Plan','60/40','70/30','80/20','50/50']" />
        <button class="search-btn" @click="search"><i class="fa-solid fa-magnifying-glass"></i> {{ isRtl ? 'بحث في المشاريع' : 'Search Projects' }}</button>
      </div>
    </section>

    <main class="page-body">
      <div class="stats">
        <Stat icon="fa-rocket" :title="projects.length ? (projects.length + '+') : '60+'" :text="isRtl ? 'مشاريع جديدة' : 'New Launches'" :sub="isRtl ? 'أحدث الفرص العقارية' : 'Latest off-plan projects'" />
        <Stat icon="fa-wallet" :title="isRtl ? 'خطط سداد ميسرة' : 'Flexible Payment Plans'" :text="isRtl ? 'تبدأ من 10% دفعة أولى' : 'From 10% down payment'" />
        <Stat icon="fa-calendar-days" title="2026 - 2029" :text="isRtl ? 'مواعيد تسليم مجدولة' : 'Expected Handover'" :sub="isRtl ? 'خطط لمستقبلك بثقة' : 'Plan your future'" />
        <Stat icon="fa-chart-simple" :title="isRtl ? 'عوائد استثمارية عالية' : 'High ROI Opportunities'" :text="isRtl ? 'مواقع استراتيجية متميزة' : 'Prime locations, higher returns'" />
      </div>

      <div class="content-grid-full">
        <div class="section-title">
          <div>
            <h2>{{ isRtl ? 'أبرز المشاريع الجديدة' : 'Featured New Projects' }}</h2>
            <p>{{ isRtl ? 'مشاريع مختارة بعناية قيد الإنشاء وبأفضل عوائد استثمارية في دبي.' : 'Handpicked off-plan developments with the best investment potential in Dubai.' }}</p>
          </div>
          <button @click="showAll = !showAll">
            {{ showAll ? (isRtl ? 'عرض أقل' : 'Show Less') : (isRtl ? 'عرض كافة المشاريع' : 'View All Projects') }}
            <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
          </button>
        </div>
        <div v-if="isLoading" class="project-grid">
          <div v-for="n in 8" :key="'p-skel-' + n" class="project-card card-skeleton-item">
            <div class="skeleton-thumb-box" style="height: 180px;"></div>
            <div class="project-info">
              <div class="skeleton-line title" style="width: 80%;"></div>
              <div class="skeleton-line loc" style="width: 50%;"></div>
              <div class="skeleton-line price" style="width: 40%; margin-top: 15px;"></div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredProjects.length === 0" class="no-properties-box">
          <i class="fa-solid fa-building-circle-xmark"></i>
          <h3>{{ isRtl ? 'لا توجد مشاريع مطابقة حالياً' : 'No projects found' }}</h3>
          <p>{{ isRtl ? 'لم يتم العثور على مشاريع تطابق الفلاتر المحددة' : 'No new projects matched your current filters' }}</p>
        </div>

        <div v-else class="project-grid">
          <article
            v-for="project in displayedProjects"
            :key="project.id || project.name"
            class="project-card"
            @click="viewProject(project)"
          >
            <div class="project-image">
              <img :src="project.image" :alt="project.name" @error="(e) => e.target.src = '/images/photo-1545324418-cc1a3fa10c00.avif'">
              <span :class="project.badgeClass">{{ project.badge }}</span>
              <button type="button" @click.stop="toggleSaveProject(project)">
                <i :class="isSaved(project) ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'"></i>
              </button>
            </div>
            <div class="project-info">
              <h3>{{ project.name }}</h3>
              <p class="location"><i class="fa-solid fa-location-dot"></i> {{ project.location }}</p>
              <div class="developer">
                <b>{{ project.developer }}</b>
                <span>{{ isRtl ? 'بواسطة' : 'by' }} {{ project.developerName }}</span>
              </div>
              <div class="price-row">
                <div>
                  <small>{{ isRtl ? 'ابتداءً من' : 'Starting from' }}</small>
                  <strong>{{ project.price }}</strong>
                </div>
                <div>
                  <small><i class="fa-regular fa-calendar"></i> {{ isRtl ? 'التسليم' : 'Handover' }}</small>
                  <strong>{{ project.handover }}</strong>
                </div>
              </div>
              <button class="view-btn" type="button" @click.stop="viewProject(project)">
                {{ isRtl ? 'عرض المشروع' : 'View Project' }}
                <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
              </button>
            </div>
          </article>
        </div>
      </div>

      <section class="communities" v-if="communities.length > 0">
        <div class="section-title">
          <div>
            <h2>{{ isRtl ? 'مجتمعات ومناطق رائجة' : 'Trending Communities' }}</h2>
            <p>{{ isRtl ? 'استكشف المشاريع الجديدة في أكثر مناطق دبي طلباً واستثماراً.' : 'Explore new projects in Dubai\'s most sought-after locations.' }}</p>
          </div>
          <button @click="router.push('/map')">
            {{ isRtl ? 'عرض كافة المناطق' : 'View All Areas' }}
            <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
          </button>
        </div>
        <div class="community-row">
          <article
            v-for="area in communities"
            :key="area.name"
            @click="filterByCommunity(area.name)"
            style="cursor: pointer;"
          >
            <img :src="area.image" :alt="area.name" @error="(e) => e.target.src = '/images/photo-1545324418-cc1a3fa10c00.avif'">
            <div>
              <strong>{{ area.name }}</strong>
              <span>{{ area.count }} {{ isRtl ? 'مشاريع متاحة' : 'New Projects' }}</span>
            </div>
            <button type="button">
              <i class="fa-solid" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
            </button>
          </article>
        </div>
      </section>
    </main>
    <Transition name="toast"><div v-if="toast" class="toast"><i class="fa-solid fa-circle-check"></i> {{toast}}</div></Transition>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import propertyService from '../services/propertyService'
import { favoritesService } from '../services/favoritesService'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const router = useRouter()
const { isRtl } = useThemeAndLanguage()

const toast = ref('')
const showAll = ref(true)

const filters = ref({
  location: 'Select Area',
  developer: 'Select Developer',
  type: 'Select Type',
  price: 'Any Price',
  year: 'Any Year',
  plan: 'Any Plan'
})

const locationOptions = computed(() => {
  const dynamicAreas = communities.value.map(c => c.name)
  const projAreas = projects.value.map(p => {
    const loc = p.location || ''
    return loc.split(',')[0].trim()
  }).filter(Boolean)
  const defaultList = ['Select Area', 'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Dubai Creek Harbour', 'Business Bay']
  return [...new Set([...defaultList, ...dynamicAreas, ...projAreas])]
})

const developerOptions = computed(() => {
  const defaultDevs = ['Select Developer', 'Emaar', 'Nakheel', 'Meraas', 'Sobha', 'Damac', 'Select Group']
  const set = new Set(defaultDevs)
  projects.value.forEach(p => {
    if (p.developer) set.add(p.developer)
    if (p.developerName) set.add(p.developerName)
  })
  return Array.from(set)
})

const typeOptions = computed(() => {
  const defaultTypes = ['Select Type', 'Apartment', 'Villa', 'Penthouse', 'Townhouse', 'Office', 'Full Building', 'Land', 'House', 'Commercial']
  const set = new Set(defaultTypes)
  projects.value.forEach(p => {
    if (p.type) set.add(p.type)
  })
  return Array.from(set)
})

const FilterSelect = defineComponent({
  props: { icon: String, label: String, modelValue: String, options: Array },
  emits: ['update:modelValue'],
  setup(p, { emit }) {
    return () => h('label', { class: 'filter' }, [
      h('i', { class: `fa-solid ${p.icon}` }),
      h('span', p.label),
      h('select', {
        value: p.modelValue,
        onChange: e => emit('update:modelValue', e.target.value)
      }, p.options.map(x => h('option', x)))
    ])
  }
})

const Stat = defineComponent({
  props: { icon: String, title: String, text: String, sub: String },
  setup: p => () => h('div', { class: 'stat' }, [
    h('i', { class: `fa-solid ${p.icon}` }),
    h('div', [
      h('strong', p.title),
      h('span', p.text),
      p.sub && h('small', p.sub)
    ])
  ])
})

const isLoading = ref(true)
const projects = ref([])
const communities = ref([])

const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    if (filters.value.location !== 'Select Area') {
      const loc = filters.value.location.toLowerCase()
      if (!p.location.toLowerCase().includes(loc)) return false
    }
    if (filters.value.developer !== 'Select Developer') {
      const dev = filters.value.developer.toLowerCase()
      if (!p.developer.toLowerCase().includes(dev) && !p.developerName.toLowerCase().includes(dev)) return false
    }
    if (filters.value.type !== 'Select Type') {
      const typ = filters.value.type.toLowerCase()
      if (!p.type.toLowerCase().includes(typ)) return false
    }
    if (filters.value.price !== 'Any Price') {
      const val = Number(p.rawPrice) || 0
      if (filters.value.price === 'Under AED 1M' && val >= 1000000) return false
      if (filters.value.price === 'AED 1M - 3M' && (val < 1000000 || val > 3000000)) return false
      if (filters.value.price === 'AED 3M+' && val < 3000000) return false
    }
    if (filters.value.year !== 'Any Year') {
      if (!p.handover.includes(filters.value.year)) return false
    }
    if (filters.value.plan !== 'Any Plan') {
      if (!p.paymentPlan || !p.paymentPlan.includes(filters.value.plan)) return false
    }
    return true
  })
})

const displayedProjects = computed(() => {
  // Always show all filtered results (showAll controls 'Show Less' behavior)
  return showAll.value ? filteredProjects.value : filteredProjects.value.slice(0, 20)
})

const isSaved = (project) => {
  return favoritesService.isSaved(project.id || project.name)
}

const toggleSaveProject = (project) => {
  const saved = favoritesService.toggleSave({
    id: project.id,
    title: project.name,
    image: project.image,
    price: project.rawPrice || project.price,
    location: project.location
  })
  toast.value = saved
    ? (isRtl.value ? `تم حفظ "${project.name}" في المفضلة ❤️` : `Saved "${project.name}" to favorites ❤️`)
    : (isRtl.value ? `تمت الإزالة من المفضلة` : `Removed from favorites`)
  setTimeout(() => { toast.value = '' }, 2400)
}

const viewProject = (project) => {
  if (project.id) {
    router.push(`/property/${project.id}`)
  } else {
    router.push({ path: '/buy', query: { q: project.name } })
  }
}

const filterByCommunity = (areaName) => {
  filters.value.location = areaName
  search()
}

function search() {
  const count = filteredProjects.value.length
  toast.value = isRtl.value ? `تم العثور على ${count} مشروع مطابق` : `Found ${count} matching projects`
  setTimeout(() => { toast.value = '' }, 2400)
  const el = document.querySelector('.content-grid')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const loadData = async () => {
  isLoading.value = true
  try {
    const langKey = isRtl.value ? 'ar' : 'en'
    const [propRes, areasRes] = await Promise.allSettled([
      propertyService.getProperties({ per_page: 200 }),
      propertyService.getPopularAreas(langKey)
    ])

    if (propRes.status === 'fulfilled' && propRes.value?.data?.length) {
      const apiProjects = propRes.value.data.map((p, idx) => {
        const rawPrice = Number(p.price) || 2000000
        const formattedPrice = rawPrice >= 1000000
          ? `AED ${(rawPrice / 1000000).toFixed(1)}M`
          : `AED ${rawPrice.toLocaleString()}`

        // Derive developer based on agency, developer field, or community
        const locLower = (p.location || p.area || '').toLowerCase()
        let devName = p.developer || p.developer_name || p.agency?.name || ''
        let devShort = ''

        if (devName) {
          devShort = devName.split(' ')[0].toUpperCase()
        } else if (locLower.includes('palm') || locLower.includes('jumeirah islands') || locLower.includes('deira islands')) {
          devShort = 'NAKHEEL'
          devName = 'Nakheel Properties'
        } else if (locLower.includes('damac') || locLower.includes('akoya')) {
          devShort = 'DAMAC'
          devName = 'DAMAC Properties'
        } else if (locLower.includes('sobha') || locLower.includes('hartland') || locLower.includes('meydan')) {
          devShort = 'SOBHA'
          devName = 'Sobha Realty'
        } else if (locLower.includes('meraas') || locLower.includes('bluewaters') || locLower.includes('city walk') || locLower.includes('la mer')) {
          devShort = 'MERAAS'
          devName = 'Meraas Holding'
        } else if (locLower.includes('creek') || locLower.includes('downtown') || locLower.includes('hills') || locLower.includes('marina')) {
          devShort = 'EMAAR'
          devName = 'Emaar Properties'
        } else {
          devShort = 'SELECT GROUP'
          devName = 'Select Group Dubai'
        }

        // Realistic handover based on property fields or completion stage
        const handoverYear = p.completion_year || (2026 + (idx % 3))
        const handoverQuarter = p.completion_quarter || ((idx % 4) + 1)
        const handoverText = `Q${handoverQuarter} ${handoverYear}`

        // Payment plan mapping
        const planTypes = ['60/40', '70/30', '80/20', '50/50']
        const paymentPlan = p.payment_plan || planTypes[idx % planTypes.length]

        // Contextual badges
        let badge = 'OFF-PLAN'
        let badgeClass = 'purple'
        if (p.is_new || rawPrice < 1500000) {
          badge = 'NEW LAUNCH'
          badgeClass = 'blue'
        } else if (p.is_featured || rawPrice > 5000000) {
          badge = 'FEATURED'
          badgeClass = 'yellow'
        } else if (idx % 4 === 0) {
          badge = 'LIMITED UNITS'
          badgeClass = 'red'
        }

        return {
          id: p.id,
          name: p.title || 'Dubai Project',
          location: p.location || p.area || 'Dubai, UAE',
          developer: devShort,
          developerName: devName,
          price: formattedPrice,
          rawPrice,
          handover: handoverText,
          paymentPlan,
          badge,
          badgeClass,
          image: p.image || (p.images && p.images[0]) || '/images/photo-1545324418-cc1a3fa10c00.avif',
          type: p.type || 'Apartment'
        }
      })
      projects.value = apiProjects
    } else {
      projects.value = []
    }

    if (areasRes.status === 'fulfilled' && areasRes.value?.data?.length) {
      communities.value = areasRes.value.data.map(a => ({
        name: a.name || 'Dubai Area',
        count: a.properties_count || 0,
        image: a.image_url || '/images/photo-1545324418-cc1a3fa10c00.avif'
      }))
    } else {
      communities.value = []
    }
  } catch (err) {
    console.warn('Error loading new projects live data:', err)
    projects.value = []
    communities.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
:global(body){margin:0}.projects-page{min-height:100vh;background:#070d19;color:#f8fafc;font-family:'Plus Jakarta Sans',sans-serif}.np-header{height:58px;background:#07111f;display:flex;align-items:center;padding:0 max(5.5vw,22px);gap:46px;border-bottom:1px solid #18273a;position:relative;z-index:20}.np-brand{display:flex;align-items:center;color:white;text-decoration:none;white-space:nowrap}.np-brand img{width:40px;height:40px;object-fit:contain}.np-brand strong{font-size:16px}.np-brand strong span{color:#24d8ee}.np-brand>b{font-size:9px;background:#1bbce5;padding:3px 5px;border-radius:4px;margin-left:6px}.np-header nav{display:flex;align-items:center;align-self:stretch;gap:30px;flex:1}.np-header nav a{color:#e0e9f4;text-decoration:none;font-size:12px;display:flex;align-items:center;position:relative;white-space:nowrap}.np-header nav a.active{color:#16d5ef}.np-header nav a.active:after{content:'';position:absolute;height:2px;background:#1be2f4;left:0;right:0;bottom:-21px;box-shadow:0 0 8px #1be2f4}.header-tools{display:flex;align-items:center;gap:9px}.header-tools button{border:0;color:#fff;cursor:pointer}.language{height:36px;background:#111f31;border:1px solid #2a3b51!important;border-radius:20px;padding:0 13px}.language i{color:#17cbec}.language em{border-left:1px solid #506075;margin:0 8px}.language b{color:#20d9ed}.circle,.user{width:36px;height:36px;border-radius:50%;background:#122237}.circle i{color:#28cbec}.list{height:36px;padding:0 18px;border-radius:18px;background:linear-gradient(135deg,#176aff,#225de5);font-weight:700;box-shadow:0 5px 18px #126fff55}.heart{position:relative}.heart i{color:#a7b7c9}.heart small{position:absolute;right:-1px;top:-5px;background:#ed3d51;border-radius:50%;width:16px;height:16px;font-size:9px;padding-top:2px}.user{background:#12c7e8;color:#00162a!important}.down{font-size:9px;color:#91a4bc}.menu-btn{display:none;background:none;border:0;color:#fff;font-size:19px}.hero{height:355px;background:radial-gradient(circle at 72% 18%,rgba(14,91,145,.28),transparent 32%),linear-gradient(135deg,#07182b 0%,#061222 48%,#070d19 100%);position:relative;padding:24px 5.6vw}.hero:after{content:'';position:absolute;inset:auto 0 0;height:100px;background:linear-gradient(transparent,#070d19)}.hero-copy{position:relative;z-index:2}.eyebrow{display:inline-flex;align-items:center;gap:10px;border:1px solid #27506d;background:#0b243a;padding:8px 18px;border-radius:22px;color:#2ed7f1;font-size:11px;font-weight:700;letter-spacing:.4px}.hero h1{font-size:50px;line-height:1.02;margin:15px 0 8px;letter-spacing:-2px}.hero h1 strong{color:#0fc8ed}.hero p{font-size:14px;line-height:1.5;color:#d4deea;margin:0}.filter-bar{position:absolute;z-index:4;left:5.6vw;right:5.6vw;bottom:-15px;height:82px;background:rgba(10,27,48,.93);border:1px solid #294969;border-radius:16px;display:grid;grid-template-columns:repeat(6,1fr) 145px;gap:18px;padding:15px 18px;box-shadow:0 15px 35px #0007;backdrop-filter:blur(12px)}.filter{position:relative;padding-left:31px}.filter>i{position:absolute;left:3px;top:19px;color:#19cfee;font-size:16px}.filter>span{display:block;font-size:10px;font-weight:600;margin:0 0 5px}.filter select{width:100%;height:30px;background:#13253b;border:1px solid #3a5069;border-radius:6px;color:#b9c7d8;padding:0 9px;font-size:10px}.search-btn{align-self:center;height:43px;border:0;border-radius:23px;background:linear-gradient(135deg,#0d75ff,#2765ee);color:#fff;font-size:11px;font-weight:700;box-shadow:0 7px 20px #0875ff5c}.search-btn i{margin-right:8px}.page-body{padding:30px 5.6vw 20px;position:relative;z-index:3}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:16px}.stat{height:66px;border:1px solid #244160;background:linear-gradient(145deg,#0d2137,#07162a);border-radius:13px;display:flex;align-items:center;padding:0 18px;gap:19px}.stat>i{font-size:27px;color:#10c9ed;filter:drop-shadow(0 0 8px #12cceb55)}.stat div{display:flex;flex-direction:column}.stat strong{color:#13ccef;font-size:16px}.stat span{font-size:11px;color:#d1dce9;margin-top:2px}.stat small{font-size:9px;color:#7f91a7}.content-grid-full{width:100%}.section-title{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:14px}.section-title h2{font-size:19px;margin:0 0 3px}.section-title p{font-size:11px;color:#a9b8ca;margin:0}.section-title button{background:none;border:0;color:#1ba9ff;font-weight:700;font-size:11px;cursor:pointer}.project-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}.project-card{border:1px solid #29435f;background:linear-gradient(180deg,#0e2239,#071628);border-radius:10px;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease}.project-card:hover{transform:translateY(-3px);box-shadow:0 10px 25px rgba(0,210,255,.15);border-color:rgba(0,210,255,.4)}.project-image{height:175px;position:relative;overflow:hidden}.project-image img{width:100%;height:100%;object-fit:cover;transition:transform .3s ease}.project-card:hover .project-image img{transform:scale(1.04)}.project-image>span{position:absolute;left:10px;top:9px;border-radius:12px;padding:5px 10px;font-size:8px;font-weight:800}.blue{background:#1599f4}.yellow{background:#ffd54d;color:#122036}.purple{background:#8d43ee}.red{background:#ef5263}.project-image button{position:absolute;right:8px;top:8px;width:27px;height:27px;border-radius:50%;background:#17304a;border:1px solid #a7bbce;color:#fff;cursor:pointer}.project-info{padding:14px 15px;display:flex;flex:1;flex-direction:column}.project-info h3{font-size:14px;margin:0 0 7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.location{color:#9eb0c4!important;font-size:10px!important}.location i{color:#12caf0}.project-info p{margin:0}.developer{display:flex;align-items:center;gap:6px;margin:12px 0 10px;height:15px}.developer b{font-size:10px}.developer span{font-size:8px;color:#8496ac}.price-row{border-top:1px solid #294058;padding-top:10px;display:flex;justify-content:space-between}.price-row>div{display:flex;flex-direction:column}.price-row small{font-size:9px;color:#a3b2c5}.price-row small i{color:#14c9ed;margin-right:3px}.price-row strong{font-size:15px;margin-top:3px}.price-row>div:last-child{text-align:right}.view-btn{width:100%;height:38px;border:0;border-radius:6px;background:linear-gradient(135deg,#087bff,#235fe5);color:#fff;font-size:10px;font-weight:700;margin-top:auto;cursor:pointer}.view-btn i{margin-left:8px}.communities{margin-top:20px}.community-row{display:grid;grid-template-columns:repeat(6,1fr);gap:13px}.community-row article{height:62px;border:1px solid #29435e;border-radius:9px;background:#0d2036;display:flex;align-items:center;overflow:hidden}.community-row img{height:100%;width:70px;object-fit:cover}.community-row div{display:flex;flex-direction:column;gap:6px;padding:0 9px;min-width:0}.community-row strong{font-size:9px;white-space:nowrap}.community-row span{font-size:8px;color:#b2c0d0}.community-row button{margin-left:auto;margin-right:8px;width:26px;height:26px;border:0;border-radius:50%;background:#203550;color:#fff}.toast{position:fixed;right:24px;bottom:24px;background:#0e2945;border:1px solid #1dc9eb;padding:13px 18px;border-radius:9px;z-index:50}.toast i{color:#21d8a1}.toast-enter-active,.toast-leave-active{transition:.2s}.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(10px)}
.projects-page,.projects-page *{box-sizing:border-box}.projects-page .page-body{background:#070d19;max-width:none;min-height:560px}.projects-page .hero{background-position:center 54%;background-attachment:scroll}.projects-page .filter-bar{align-items:stretch}.projects-page :deep(.filter){display:block;min-width:0;padding:0 0 0 30px!important;color:#f8fafc}.projects-page :deep(.filter>i){position:absolute!important;left:3px!important;top:28px!important;color:#19cfee!important;font-size:16px!important}.projects-page :deep(.filter>span){display:block!important;margin:0 0 7px!important;color:#edf6ff!important;font-size:10px!important;font-weight:700!important;line-height:1!important}.projects-page :deep(.filter>select){display:block!important;width:100%!important;height:32px!important;margin:0!important;padding:0 28px 0 10px!important;border:1px solid #3a5069!important;border-radius:7px!important;background:#13253b!important;color:#c8d5e4!important;font:500 10px 'Plus Jakarta Sans',sans-serif!important;appearance:auto!important;box-shadow:none!important}.projects-page :deep(.stat){display:flex!important;align-items:center!important;gap:17px!important;padding:0 18px!important;min-width:0}.projects-page :deep(.stat>i){flex:0 0 38px!important;width:38px!important;height:38px!important;display:grid!important;place-items:center!important;font-size:25px!important;color:#10c9ed!important;background:rgba(7,53,80,.65)!important;border-radius:9px!important}.projects-page :deep(.stat>div){display:flex!important;flex-direction:column!important;min-width:0!important}.projects-page :deep(.stat strong){display:block!important;color:#13ccef!important;font-size:15px!important;line-height:1.2!important;white-space:nowrap!important}.projects-page :deep(.stat span){display:block!important;margin-top:3px!important;color:#d1dce9!important;font-size:10px!important;line-height:1.25!important}.projects-page :deep(.stat small){display:block!important;color:#7f91a7!important;font-size:8px!important;line-height:1.2!important}.projects-page .content-grid-full{width:100%}.projects-page .project-card,.projects-page .community-row article{background-color:#0b1d31}.projects-page .communities{padding-top:4px}.projects-page .section-title h2,.projects-page .section-title p{display:block}.projects-page .project-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(285px,1fr));gap:16px;align-items:stretch}.projects-page .project-card{display:flex;min-height:390px;flex-direction:column}.projects-page .project-image{height:175px}.projects-page .project-info{display:flex;flex:1;flex-direction:column;padding:14px 15px}.projects-page .project-info h3{font-size:14px;margin-bottom:7px}.projects-page .location{font-size:10px!important}.projects-page .developer{margin:14px 0 11px}.projects-page .developer b{font-size:10px}.projects-page .developer span{font-size:8px}.projects-page .price-row{padding-top:11px}.projects-page .price-row small{font-size:9px}.projects-page .price-row strong{font-size:15px}.projects-page .project-info .view-btn{height:38px;margin-top:auto;font-size:10px}
.projects-page .communities{padding-top:16px}.projects-page .community-row{gap:14px}.projects-page .community-row article{height:92px;border-radius:11px}.projects-page .community-row img{width:94px;height:100%;object-fit:cover}.projects-page .community-row div{gap:8px;padding:0 12px}.projects-page .community-row strong{font-size:10px}.projects-page .community-row span{font-size:9px}.projects-page .community-row button{flex:0 0 31px;width:31px;height:31px;margin-right:11px}
@media(max-width:1200px){.np-header{gap:18px}.np-header nav{gap:15px}.np-header nav a:nth-last-child(-n+2){display:none}.language,.heart{display:none}.filter-bar{grid-template-columns:repeat(3,1fr) 140px;height:auto}.hero{height:410px}.stats{grid-template-columns:repeat(2,1fr)}.project-grid{grid-template-columns:repeat(3,1fr)}.community-row{grid-template-columns:repeat(3,1fr)}}
@media(max-width:760px){.np-header{padding:0 15px}.menu-btn{display:block}.np-header nav{display:none;position:absolute;top:58px;left:0;right:0;background:#071421;padding:15px;flex-direction:column;align-items:flex-start}.np-header nav.open{display:flex}.header-tools{margin-left:auto}.header-tools .circle,.down{display:none}.list{padding:0 10px}.hero{height:525px;padding:25px 18px}.hero h1{font-size:39px}.hero p br{display:none}.filter-bar{left:15px;right:15px;bottom:-15px;grid-template-columns:1fr 1fr;gap:10px}.filter-bar .search-btn{grid-column:1/-1}.page-body{padding:30px 15px}.content-grid{grid-template-columns:1fr}.project-grid{grid-template-columns:1fr 1fr}.invest-card{display:none}.community-row{grid-template-columns:1fr 1fr}.stats{grid-template-columns:1fr 1fr}.stat{padding:0 11px}.stat>i{font-size:21px}}
@media(max-width:480px){.np-brand strong,.np-brand>b{display:none}.header-tools .user{display:none}.hero h1{font-size:33px}.project-grid,.stats,.community-row{grid-template-columns:1fr}.filter-bar{grid-template-columns:1fr 1fr}.filter>span{font-size:9px}.section-title p{max-width:240px}.section-title button{display:none}}

/* Skeleton and Empty State Styles */
.card-skeleton-item {
  animation: pulse 1.6s ease-in-out infinite;
  pointer-events: none;
}
.skeleton-thumb-box {
  width: 100%;
  background: linear-gradient(90deg, #0d2036 25%, #183354 50%, #0d2036 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, #0d2036 25%, #183354 50%, #0d2036 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 8px;
}
.skeleton-line.title { height: 16px; margin-top: 10px; }
.skeleton-line.price { height: 18px; margin-bottom: 0; }
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.no-properties-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px 24px;
  background: rgba(13, 27, 46, 0.6);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  min-height: 240px;
}
.no-properties-box i {
  font-size: 2.8rem;
  color: #00d2ff;
  margin-bottom: 14px;
  opacity: 0.8;
}
.no-properties-box h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}
.no-properties-box p {
  color: #94a3b8;
  font-size: 0.85rem;
  max-width: 400px;
}
</style>
