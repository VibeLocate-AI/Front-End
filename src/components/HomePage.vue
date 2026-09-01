<template>
  <div class="dubai-home">
    <header class="site-header">
      <a class="brand" href="#top" @click.prevent="scrollTo('top')"><img class="header-logo" src="/images/home-logo.png" alt="VibeLocate AI"></a>
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" @click="mobileMenuOpen = !mobileMenuOpen">âک°</button>
      <nav class="nav-links" :class="{ open: mobileMenuOpen }">
        <a class="active" href="#top" @click.prevent="scrollTo('top')">Home</a><a href="#featured" @click.prevent="scrollTo('featured')">Buy</a><a href="#featured" @click.prevent="scrollTo('featured')">Rent</a><a href="#featured" @click.prevent="scrollTo('featured')">New Projects</a><a href="#featured" @click.prevent="scrollTo('featured')">Commercial</a><a href="#areas" @click.prevent="scrollTo('areas')">Areas</a><a href="#about" @click.prevent="scrollTo('about')">About Us</a>
      </nav>
      <span v-if="user.name" class="user-name">Welcome, {{ user.name }}</span>
      <img v-if="user.name" class="user-avatar" :src="user.avatar" :alt="user.name">
      <div class="header-actions"><button class="outline-btn" type="button" @click="showToast('Property listing will be available soon.')">List Your Property <span>ï¼‹</span></button><button class="icon-btn" type="button" aria-label="Notifications">â™§</button><button class="profile" type="button"><img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile"><span>âŒ„</span></button></div>
    </header>
    <main id="top">
      <section class="hero"><div class="hero-copy"><span class="hero-badge">âœ¦ &nbsp; AI-POWERED REAL ESTATE PLATFORM</span><h1>Find Your Dream<br><em>Property in Dubai</em></h1><p>Discover premium Dubai properties tailored to your lifestyle, comfort, and aspirations.</p></div><form class="search-panel chatbot-search" @submit.prevent="handleSearch"><label class="ai-search-label" for="keyword">âœ¦ &nbsp; AI CONTEXTUAL SEARCH</label><div class="chat-input-row"><input id="keyword" v-model.trim="query" type="search" placeholder="e.g., I need a luxury villa near the beach for $5,000/month"><button class="primary-btn" aria-label="AI Search" type="submit">âŒ• <span>AI Search</span></button></div><p class="bot-response" :class="{ visible: searchMessage }">{{ searchMessage }}</p></form></section>
      <div class="content-grid"><div class="main-content">
        <section id="areas"><div class="section-heading"><h2>Popular Areas</h2><a href="#" @click.prevent="showToast('More areas will be available soon.')">See all areas <span>â€؛</span></a></div><div class="area-list"><article v-for="area in areas" :key="area.name" class="area-card"><img :src="area.image" :alt="area.name"><div><strong>{{ area.name }}</strong><small>{{ area.count }} Properties</small></div></article></div></section>
        <section id="featured"><div class="section-heading"><h2>Featured Properties</h2><a href="#" @click.prevent="showToast('Showing featured properties.')">See all properties <span>â€؛</span></a></div><div class="property-grid"><article v-for="property in filteredProperties.slice(0, 4)" :key="property.title" class="property-card"><div class="photo" :style="{ backgroundImage: `url('${property.image}')` }"><button class="favorite" :class="{ saved: favorites.has(property.title) }" type="button" @click="toggleFavorite(property.title)">{{ favorites.has(property.title) ? 'â™¥' : 'â™،' }}</button><span class="type">{{ property.type }}</span></div><div class="property-body"><PropertyInfo :property="property" /></div></article><p v-if="!filteredProperties.length" class="empty">No matching properties found. Try a different search.</p></div></section>
        <section><div class="section-heading"><h2>Nearby &amp; Recommended</h2><a href="#" @click.prevent="showToast('Showing nearby recommendations.')">See all <span>â€؛</span></a></div><div class="compact-grid"><article v-for="property in properties.slice(4)" :key="property.title" class="compact-card"><div class="mini-photo" :style="{ backgroundImage: `url('${property.image}')` }"><button class="favorite" :class="{ saved: favorites.has(property.title) }" type="button" @click="toggleFavorite(property.title)">{{ favorites.has(property.title) ? 'â™¥' : 'â™،' }}</button></div><div class="compact-body"><PropertyInfo :property="property" /></div></article></div></section>
      </div><aside><article class="agent-card"><h3>Top Real Estate Agent</h3><div class="agent-info"><img src="https://randomuser.me/api/portraits/men/75.jpg" alt="Mohamed Ahmed"><div><strong>Mohamed Ahmed</strong><small>Senior Real Estate Consultant</small><span class="rating">âک… <b>4.9</b> (128 reviews)</span></div></div><a href="tel:+971501234567">âکژ <span>+971 50 123 4567</span></a><a href="mailto:mohamed@vibelocate.ai">âœ‰ <span>mohamed@vibelocate.ai</span></a><button class="primary-btn" type="button" @click="showToast('We will connect you with Mohamed shortly.')">Contact Agent</button></article><article class="promo-card"><div><h3>List Your Property<br>With VibeLocate AI</h3><p>Reach thousands of potential buyers and renters.</p><button type="button" @click="showToast('Property listing will be available soon.')">List Your Property <span>â€؛</span></button></div><div class="tower-art"><i></i><i></i><i></i></div></article></aside></div>
      <section id="about" class="benefits"><div><b>â—‡</b><span><strong>Verified Listings</strong><small>All properties are verified<br>for your peace of mind.</small></span></div><div><b>â™™</b><span><strong>Expert Agents</strong><small>Connect with experienced<br>real estate professionals.</small></span></div><div><b>âœ§</b><span><strong>Best Price Guarantee</strong><small>We help you find the best<br>deals in the market.</small></span></div><div><b>â—”</b><span><strong>24/7 Support</strong><small>Our team is here to assist<br>you anytime.</small></span></div></section>
    </main><div class="toast" :class="{ show: toastVisible }">{{ toastMessage }}</div>
  </div>
</template>

<script setup>
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { authService } from '../services/authService'
const areas = [['Dubai Marina','1,240','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=500&q=80'],['Palm Jumeirah','856','https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=500&q=80'],['Downtown Dubai','1,080','https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=500&q=80'],['Business Bay','732','https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=500&q=80']].map(([name,count,image]) => ({ name,count,image }))
const properties = [['Villa','Palm Jumeirah Villa','Palm Jumeirah, Dubai',4500,5,6,'6,500','https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=85'],['Apartment','Luxury Apartment in Dubai Marina','Dubai Marina, Dubai',2800,2,3,'1,450','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=85'],['Penthouse','Downtown Penthouse Skyline View','Downtown Dubai, Dubai',12000,4,5,'3,200','https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=85'],['Townhouse','Modern Townhouse in JVC','JVC, Dubai',3200,3,4,'2,100','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=85'],['Apartment','Luxury Marina Suite','Dubai Marina',2200,1,2,'850','https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=700&q=80'],['Townhouse','JVC Modern Townhome','Jumeirah Village Circle',2900,3,3,'1,800','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80'],['Apartment','Business Bay 2BR Apartment','Business Bay, Dubai',2600,2,2,'1,200','https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80'],['Villa','Dubai Hills Family Villa','Dubai Hills Estate',6500,5,6,'5,200','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=700&q=80']].map(([type,title,area,price,beds,baths,size,image]) => ({ type,title,area,price,beds,baths,size,image }))
const PropertyInfo = defineComponent({ props: { property: Object }, setup: props => () => [h('h3', props.property.title),h('span',{class:'location'},`âŒ– ${props.property.area}`),h('span',{class:'price'},[`$${props.property.price.toLocaleString()} `,h('small','/month')]),h('div',{class:'facts'},[h('span',`â–° ${props.property.beds} Beds`),h('span',`â™¨ ${props.property.baths} Baths`),h('span',`â–§ ${props.property.size} Sqft`)])] })
const query=ref(''), favorites=ref(new Set()), mobileMenuOpen=ref(false), searchMessage=ref(''), toastMessage=ref(''), toastVisible=ref(false)
const user=ref({ name: '', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' })
let toastTimer
const filteredProperties=computed(() => { const term=query.value.toLowerCase(); return !term ? properties : properties.filter(p => `${p.title} ${p.area} ${p.type}`.toLowerCase().includes(term)) })
const toggleFavorite=title => { const updated=new Set(favorites.value); updated.has(title) ? updated.delete(title) : updated.add(title); favorites.value=updated }
const handleSearch=() => { const count=filteredProperties.value.length; searchMessage.value=count ? `I found ${count} matching properties. Take a look below â†“` : "I couldn't find an exact match. Try another area or property type."; document.getElementById('featured')?.scrollIntoView({behavior:'smooth',block:'start'}) }
const scrollTo=id => { mobileMenuOpen.value=false; document.getElementById(id)?.scrollIntoView({behavior:'smooth'}) }
const showToast=message => { toastMessage.value=message; toastVisible.value=true; clearTimeout(toastTimer); toastTimer=setTimeout(() => { toastVisible.value=false },2200) }
onMounted(async () => {
  try {
    const response = await authService.getProfile()
    const profile = response?.data || response?.user || response || {}
    user.value = {
      name: profile.name || profile.full_name || profile.first_name || '',
      avatar: profile.avatar || profile.profile_photo_url || profile.image || user.value.avatar
    }
  } catch {
    // Keep Home available if profile data cannot be retrieved.
  }
})
</script>

<style src="../assets/dubai-home.css"></style>
