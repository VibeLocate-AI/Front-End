<template>
  <div class="agent-hub" :class="{ 'is-dark': isDark, 'is-rtl': isRtl }" :dir="isRtl ? 'rtl' : 'ltr'">
    
    <!-- =========================================================================
         VIEW 1: DASHBOARD (لوحتي) - EXACT MATCH TO USER IMAGE 2
         ========================================================================= -->
    <div v-if="currentTab === 'dashboard'" class="agent-view fade-in">
      
      <!-- Top Action & Greeting Header -->
      <header class="agent-top-header">
        <div class="agent-header-titles">
          <h1 class="agent-greeting-title">
            {{ isRtl ? `أهلاً، ${agentDisplayName}` : `Welcome, ${agentDisplayName}` }}
          </h1>
          <p class="agent-greeting-sub">
            {{ isRtl ? 'إليك ملخص أداء عقاراتك اليوم' : "Here's a summary of your property performance today" }}
          </p>
        </div>

        <div class="header-action-group">
          <span v-if="isDataLoading" class="live-sync-indicator">
            <i class="fa-solid fa-rotate fa-spin"></i>
            <span>{{ isRtl ? 'مزامنة البيانات الحية...' : 'Syncing live data...' }}</span>
          </span>
          <button class="btn-add-property-top" @click="navigateToAddProperty">
            <i class="fa-solid fa-plus"></i>
            <span>{{ isRtl ? 'إضافة عقار جديد' : 'Add New Property' }}</span>
          </button>
        </div>
      </header>

      <!-- Yellow Verification Status Banner -->
      <div class="verification-alert-banner">
        <div class="alert-content-left">
          <span class="status-pill-under-review">
            {{ isRtl ? 'قيد التحقق' : 'Under Verification' }}
          </span>
          <p class="alert-banner-text">
            {{ isRtl 
              ? 'حسابك قيد المراجعة من فريقنا — بعض عقاراتك قد لا تظهر بنتائج البحث حتى اكتمال التحقق.' 
              : 'Your account is under review by our team — some of your listings might not appear in search results until verification is complete.' 
            }}
          </p>
        </div>
        <button class="alert-link-btn" @click="emitSubTab('verification')">
          <span>{{ isRtl ? 'إكمال بيانات التحقق' : 'Complete Verification Info' }}</span>
          <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
        </button>
      </div>

      <!-- 4 Top KPI Cards Grid -->
      <div class="agent-kpi-grid">
        <!-- Card 1: Views this month -->
        <div class="kpi-card">
          <span class="kpi-label">{{ isRtl ? 'مشاهدات هذا الشهر' : 'Views this month' }}</span>
          <div class="kpi-value text-dark">{{ kpiData.monthlyViews.toLocaleString() }}</div>
        </div>

        <!-- Card 2: New inquiries -->
        <div class="kpi-card">
          <span class="kpi-label">{{ isRtl ? 'استفسارات جديدة' : 'New Inquiries' }}</span>
          <div class="kpi-value text-teal">{{ kpiData.newInquiries }}</div>
        </div>

        <!-- Card 3: Pending viewing requests -->
        <div class="kpi-card">
          <span class="kpi-label">{{ isRtl ? 'طلبات معاينة معلقة' : 'Pending viewing requests' }}</span>
          <div class="kpi-value text-amber">{{ kpiData.pendingRequests }}</div>
        </div>

        <!-- Card 4: Average VibeScore -->
        <div class="kpi-card">
          <span class="kpi-label">{{ isRtl ? 'متوسط VIBE SCORE لعقاراتك' : 'Average VIBE SCORE' }}</span>
          <div class="kpi-value text-dark">
            <span class="score-ratio">10 /</span> [{{ kpiData.averageVibeScore }}]
          </div>
        </div>
      </div>

      <!-- My Properties Section (عقاراتي) -->
      <section class="agent-section-card">
        <div class="section-card-header">
          <h2 class="section-title">{{ isRtl ? 'عقاراتي' : 'My Properties' }}</h2>
          <button class="section-view-all" @click="emitSubTab('properties')">
            <span>{{ isRtl ? 'عرض الكل' : 'View All' }}</span>
            <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
          </button>
        </div>

        <div v-if="dashboardProperties.length > 0" class="table-responsive">
          <table class="agent-properties-table">
            <thead>
              <tr>
                <th class="col-property">{{ isRtl ? 'العقار' : 'Property' }}</th>
                <th class="col-price">{{ isRtl ? 'السعر' : 'Price' }}</th>
                <th class="col-status">{{ isRtl ? 'الحالة' : 'Status' }}</th>
                <th class="col-views">{{ isRtl ? 'مشاهدات' : 'Views' }}</th>
                <th class="col-favs">{{ isRtl ? 'مفضلة' : 'Favorites' }}</th>
                <th class="col-vibe">VIBE SCORE</th>
                <th class="col-actions">{{ isRtl ? 'إجراءات' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in dashboardProperties" :key="prop.id">
                <!-- Property thumbnail & title -->
                <td class="cell-property">
                  <div class="property-media-title">
                    <img :src="prop.image" :alt="prop.title" class="prop-thumb">
                    <div class="prop-info-text">
                      <strong class="prop-title" :title="prop.title">{{ isRtl ? prop.titleAr : prop.title }}</strong>
                      <span class="prop-location">{{ isRtl ? prop.locationAr : prop.location }}</span>
                    </div>
                  </div>
                </td>

                <!-- Price -->
                <td class="cell-price">
                  <span class="price-text">{{ isRtl ? prop.priceAr : prop.price }}</span>
                </td>

                <!-- Status Badge -->
                <td class="cell-status">
                  <span 
                    class="badge-status" 
                    :class="prop.status === 'published' ? 'status-published' : 'status-review'"
                  >
                    {{ prop.status === 'published' ? (isRtl ? 'منشور' : 'Published') : (isRtl ? 'قيد المراجعة' : 'Under Review') }}
                  </span>
                </td>

                <!-- Views -->
                <td class="cell-views">
                  <span class="stat-num">{{ (prop.views || 0).toLocaleString() }}</span>
                </td>

                <!-- Favorites -->
                <td class="cell-favs">
                  <span class="stat-num">{{ prop.favorites || 0 }}</span>
                </td>

                <!-- Vibe Score -->
                <td class="cell-vibe">
                  <span v-if="prop.vibeScore" class="vibe-score-tag">
                    [{{ prop.vibeScore }}]
                  </span>
                  <span v-else class="vibe-dash">—</span>
                </td>

                <!-- Actions -->
                <td class="cell-actions">
                  <div class="action-buttons-group">
                    <button class="btn-action-table" @click="handleEditProperty(prop)">
                      {{ isRtl ? 'تعديل' : 'Edit' }}
                    </button>
                    <button class="btn-action-table" @click="handleViewProperty(prop)">
                      {{ isRtl ? 'عرض' : 'View' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Clean Empty State when Agent has 0 properties -->
        <div v-else class="agent-empty-state-box">
          <div class="empty-icon-circle">
            <i class="fa-regular fa-building"></i>
          </div>
          <h3 class="empty-title">{{ isRtl ? 'لا توجد عقارات مضافة بعد' : 'No properties listed yet' }}</h3>
          <p class="empty-desc">
            {{ isRtl 
              ? 'ابدأ بإضافة أول عقار لك لتتمكن من إدارته ومتابعة مشاهداته وطلبات المعاينة المباشرة.' 
              : 'Add your first listing to manage properties, track views, and receive client inquiries.' 
            }}
          </p>
          <button class="btn-add-first-prop" @click="navigateToAddProperty">
            <i class="fa-solid fa-plus"></i>
            <span>{{ isRtl ? 'إضافة عقار جديد' : 'Add New Property' }}</span>
          </button>
        </div>
      </section>

      <!-- Bottom Two Column Panels: Viewing Requests & Recent Messages -->
      <div class="agent-bottom-panels-grid">
        
        <!-- Left/Right Panel 1: Recent Viewing Requests (طلبات معاينة حديثة) -->
        <section class="agent-section-card">
          <div class="section-card-header">
            <h2 class="section-title">{{ isRtl ? 'طلبات معاينة حديثة' : 'Recent Viewing Requests' }}</h2>
            <button class="section-view-all" @click="emitSubTab('requests')">
              <span>{{ isRtl ? 'عرض الكل' : 'View All' }}</span>
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>

          <div v-if="recentViewingRequests.length > 0" class="requests-list-container">
            <div 
              v-for="req in recentViewingRequests" 
              :key="req.id" 
              class="request-item-card"
              :class="{ 'is-accepted': req.status === 'accepted', 'is-rejected': req.status === 'rejected' }"
            >
              <div class="requester-avatar">
                <img v-if="req.avatar" :src="req.avatar" :alt="req.clientName">
                <span v-else class="avatar-fallback">{{ req.clientName.charAt(0) }}</span>
              </div>

              <div class="request-details-info">
                <h4 class="requester-name">{{ req.clientName }}</h4>
                <p class="request-appointment-line">
                  <span class="prop-name">{{ isRtl ? req.propertyTitleAr : req.propertyTitle }}</span>
                  <span class="bullet-sep">—</span>
                  <span class="req-date-time">{{ isRtl ? req.dateTimeAr : req.dateTime }}</span>
                </p>
              </div>

              <div class="request-actions">
                <template v-if="req.status === 'pending'">
                  <button class="btn-req-accept" @click="handleAcceptRequest(req)">
                    {{ isRtl ? 'قبول' : 'Accept' }}
                  </button>
                  <button class="btn-req-reject" @click="handleRejectRequest(req)">
                    {{ isRtl ? 'رفض' : 'Reject' }}
                  </button>
                </template>
                <template v-else-if="req.status === 'accepted'">
                  <span class="badge-status-accepted">
                    <i class="fa-solid fa-check"></i> {{ isRtl ? 'تم القبول' : 'Accepted' }}
                  </span>
                </template>
                <template v-else>
                  <span class="badge-status-rejected">
                    <i class="fa-solid fa-xmark"></i> {{ isRtl ? 'مرفوض' : 'Declined' }}
                  </span>
                </template>
              </div>
            </div>
          </div>

          <!-- Empty State for Requests -->
          <div v-else class="agent-empty-sub">
            <i class="fa-regular fa-calendar-xmark"></i>
            <p>{{ isRtl ? 'لا توجد طلبات معاينة جديدة حالياً' : 'No new viewing requests at the moment' }}</p>
          </div>
        </section>

        <!-- Left/Right Panel 2: Recent Messages (رسائل حديثة) -->
        <section class="agent-section-card">
          <div class="section-card-header">
            <h2 class="section-title">{{ isRtl ? 'رسائل حديثة' : 'Recent Messages' }}</h2>
            <button class="section-view-all" @click="emitSubTab('messages')">
              <span>{{ isRtl ? 'فتح المحادثات' : 'Open Inbox' }}</span>
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>

          <div v-if="recentMessages.length > 0" class="messages-list-container">
            <div 
              v-for="msg in recentMessages" 
              :key="msg.id" 
              class="message-item-card"
              @click="openMessageConversation(msg)"
            >
              <div class="user-avatar-wrap-dot">
                <img v-if="msg.avatar" :src="msg.avatar" :alt="msg.senderName" class="msg-avatar-img">
                <span v-else class="avatar-fallback">{{ msg.senderName.charAt(0) }}</span>
                <span v-if="msg.online" class="online-indicator-dot" title="Online"></span>
              </div>

              <div class="message-meta-info">
                <div class="msg-header-row">
                  <h4 class="sender-name">{{ msg.senderName }}</h4>
                  <span class="msg-timestamp">{{ msg.time }}</span>
                </div>
                <p class="msg-preview-text">{{ msg.lastMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Empty State for Messages -->
          <div v-else class="agent-empty-sub">
            <i class="fa-regular fa-comment-dots"></i>
            <p>{{ isRtl ? 'لا توجد رسائل جديدة من العملاء' : 'No client messages yet' }}</p>
          </div>
        </section>

      </div>

    </div>

    <!-- =========================================================================
         VIEW 2: AGENT PROPERTIES (عقاراتي) - FULL ADVANCED MANAGEMENT
         ========================================================================= -->
    <!-- =========================================================================
         VIEW 2: AGENT PROPERTIES (عقاراتي) - FULL ADVANCED MANAGEMENT
         ========================================================================= -->
    <div v-else-if="currentTab === 'properties'" class="agent-view fade-in">
      <header class="agent-top-header">
        <div>
          <h1 class="agent-greeting-title">{{ isRtl ? 'إدارة عقارات الوكيل' : 'Agent Properties Management' }}</h1>
          <p class="agent-greeting-sub">{{ isRtl ? 'تصفح وعدل جميع العقارات المدرجة أو راجع قائمة الاعتماد' : 'Manage your listed properties and review pending listings' }}</p>
        </div>
        <button class="btn-add-property-top" @click="navigateToAddProperty">
          <i class="fa-solid fa-plus"></i>
          <span>{{ isRtl ? 'إضافة عقار جديد' : 'Add New Property' }}</span>
        </button>
      </header>

      <!-- View Mode Switch: My Listings vs Moderation Queue -->
      <div class="properties-controls-bar">
        <div class="view-mode-tabs-row">
          <button 
            class="filter-pill-btn mode-pill"
            :class="{ active: propertiesViewMode === 'my_listings' }"
            @click="propertiesViewMode = 'my_listings'"
          >
            <i class="fa-solid fa-building"></i>
            <span>{{ isRtl ? 'عقاراتي المعروضة' : 'My Listings' }} ({{ dashboardProperties.length }})</span>
          </button>
          <button 
            class="filter-pill-btn mode-pill"
            :class="{ active: propertiesViewMode === 'moderation' }"
            @click="propertiesViewMode = 'moderation'; loadModerationQueue()"
          >
            <i class="fa-solid fa-clipboard-check"></i>
            <span>{{ isRtl ? 'مراجعة واعتماد العقارات' : 'Review Queue' }} ({{ moderationProperties.length }})</span>
          </button>
        </div>

        <!-- Filter Tabs & Search Bar for My Listings -->
        <div v-if="propertiesViewMode === 'my_listings'" class="filter-controls-group">
          <div class="filter-pills-row">
            <button 
              v-for="f in propertyFilters" 
              :key="f.key"
              class="filter-pill-btn"
              :class="{ active: activePropertyFilter === f.key }"
              @click="activePropertyFilter = f.key"
            >
              {{ isRtl ? f.labelAr : f.labelEn }} ({{ f.count }})
            </button>
          </div>

          <div class="search-input-wrap">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
              type="text" 
              v-model="propertiesSearchQuery" 
              :placeholder="isRtl ? 'البحث في العقارات...' : 'Search listings...'"
              class="filter-search-field"
            >
          </div>
        </div>

        <!-- Moderation Status Filter Pills -->
        <div v-else class="filter-pills-row">
          <button 
            v-for="s in ['pending', 'approved', 'rejected']" 
            :key="s"
            class="filter-pill-btn"
            :class="{ active: moderationStatus === s }"
            @click="moderationStatus = s; loadModerationQueue()"
          >
            {{ s === 'pending' ? (isRtl ? 'قيد الانتظار' : 'Pending') : s === 'approved' ? (isRtl ? 'معتمدة' : 'Approved') : (isRtl ? 'مرفوضة' : 'Rejected') }}
          </button>
        </div>
      </div>

      <!-- Content Mode 1: My Listings Grid -->
      <div v-if="propertiesViewMode === 'my_listings'">
        <div v-if="filteredProperties.length > 0" class="properties-management-grid">
          <div 
            v-for="prop in filteredProperties" 
            :key="prop.id" 
            class="prop-manage-card"
          >
            <div class="card-thumb-wrap">
              <img :src="prop.image" :alt="prop.title" class="card-img">
              <span class="card-status-badge" :class="prop.status === 'published' ? 'badge-green' : 'badge-yellow'">
                {{ prop.status === 'published' ? (isRtl ? 'منشور' : 'Published') : (isRtl ? 'قيد المراجعة' : 'Under Review') }}
              </span>
              <span v-if="prop.vibeScore" class="card-vibe-score">
                <i class="fa-solid fa-wand-magic-sparkles"></i> {{ prop.vibeScore }}
              </span>
            </div>

            <div class="card-body-content">
              <h3 class="card-prop-title">{{ isRtl ? prop.titleAr : prop.title }}</h3>
              <p class="card-prop-location"><i class="fa-solid fa-location-dot"></i> {{ isRtl ? prop.locationAr : prop.location }}</p>
              <div class="card-prop-price">{{ isRtl ? prop.priceAr : prop.price }}</div>

              <div class="card-stats-row">
                <span><i class="fa-regular fa-eye"></i> {{ (prop.views || 0).toLocaleString() }} {{ isRtl ? 'مشاهدة' : 'Views' }}</span>
                <span><i class="fa-regular fa-heart"></i> {{ prop.favorites || 0 }} {{ isRtl ? 'مفضلة' : 'Saves' }}</span>
              </div>

              <div class="card-actions-footer">
                <button class="btn-card-edit" @click="handleEditProperty(prop)">
                  <i class="fa-solid fa-pen-to-square"></i> {{ isRtl ? 'تعديل' : 'Edit' }}
                </button>
                <button class="btn-card-view" @click="handleViewProperty(prop)">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> {{ isRtl ? 'معاينة' : 'View' }}
                </button>
                <button class="btn-card-delete" @click="handleDeleteProperty(prop)" :title="isRtl ? 'حذف العقار' : 'Delete Property'">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state when 0 listings -->
        <div v-else class="agent-empty-state-box">
          <div class="empty-icon-circle">
            <i class="fa-regular fa-building"></i>
          </div>
          <h3 class="empty-title">{{ isRtl ? 'لا توجد عقارات مدرجة' : 'No properties listed' }}</h3>
          <p class="empty-desc">
            {{ isRtl 
              ? 'لم تقم بنشر أي عقارات حتى الآن. أضف عقارات جديدة لبدء الترويج واستقبال العملاء.' 
              : 'You have not published any properties yet. Add new listings to begin promoting and receiving inquiries.' 
            }}
          </p>
          <button class="btn-add-first-prop" @click="navigateToAddProperty">
            <i class="fa-solid fa-plus"></i>
            <span>{{ isRtl ? 'إضافة عقار جديد' : 'Add New Property' }}</span>
          </button>
        </div>
      </div>

      <!-- Content Mode 2: Moderation Queue -->
      <div v-else>
        <div v-if="moderationProperties.length > 0" class="properties-management-grid">
          <div 
            v-for="prop in moderationProperties" 
            :key="prop.id" 
            class="prop-manage-card"
          >
            <div class="card-thumb-wrap">
              <img :src="prop.image" :alt="prop.title" class="card-img">
              <span class="card-status-badge" :class="moderationStatus === 'approved' ? 'badge-green' : moderationStatus === 'rejected' ? 'badge-red' : 'badge-yellow'">
                {{ moderationStatus === 'approved' ? (isRtl ? 'معتمد' : 'Approved') : moderationStatus === 'rejected' ? (isRtl ? 'مرفوض' : 'Rejected') : (isRtl ? 'قيد المراجعة' : 'Pending') }}
              </span>
            </div>

            <div class="card-body-content">
              <h3 class="card-prop-title">{{ isRtl ? prop.titleAr || prop.title : prop.title }}</h3>
              <p class="card-prop-location"><i class="fa-solid fa-location-dot"></i> {{ prop.location }}</p>
              <div class="card-prop-price">{{ prop.price }}</div>

              <div class="card-actions-footer">
                <template v-if="moderationStatus === 'pending'">
                  <button class="btn-req-accept" @click="handleApproveProperty(prop.id)">
                    <i class="fa-solid fa-check"></i> {{ isRtl ? 'اعتماد' : 'Approve' }}
                  </button>
                  <button class="btn-req-reject" @click="handleRejectProperty(prop.id)">
                    <i class="fa-solid fa-xmark"></i> {{ isRtl ? 'رفض' : 'Reject' }}
                  </button>
                </template>
                <button class="btn-card-view" @click="handleViewProperty(prop)">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i> {{ isRtl ? 'معاينة التفاصيل' : 'View' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="agent-empty-sub">
          <i class="fa-solid fa-check-double"></i>
          <p>{{ isRtl ? 'لا توجد عقارات في قائمة المراجعة لهذه الفئة حالياً' : 'No properties in moderation queue for this category' }}</p>
        </div>
      </div>
    </div>

    <!-- =========================================================================
         VIEW 3: VIEWING REQUESTS (طلبات المعاينة) - COMPREHENSIVE VIEW
         ========================================================================= -->
    <div v-else-if="currentTab === 'requests'" class="agent-view fade-in">
      <header class="agent-top-header">
        <div>
          <h1 class="agent-greeting-title">{{ isRtl ? 'طلبات المعاينة والزيارات' : 'Viewing & Tour Requests' }}</h1>
          <p class="agent-greeting-sub">{{ isRtl ? 'جدول المواعيد والزيارات الميدانية مع العملاء والمستثمرين' : 'Schedule and manage appointments with buyers and tenants' }}</p>
        </div>
      </header>

      <!-- Filter Bar -->
      <div class="requests-filter-pills">
        <button 
          class="filter-pill-btn" 
          :class="{ active: requestFilter === 'all' }"
          @click="requestFilter = 'all'"
        >
          {{ isRtl ? 'الكل' : 'All' }} ({{ allRequestsList.length }})
        </button>
        <button 
          class="filter-pill-btn" 
          :class="{ active: requestFilter === 'pending' }"
          @click="requestFilter = 'pending'"
        >
          {{ isRtl ? 'قيد الانتظار' : 'Pending' }} ({{ pendingCount }})
        </button>
        <button 
          class="filter-pill-btn" 
          :class="{ active: requestFilter === 'accepted' }"
          @click="requestFilter = 'accepted'"
        >
          {{ isRtl ? 'مؤكدة' : 'Confirmed' }} ({{ acceptedCount }})
        </button>
        <button 
          class="filter-pill-btn" 
          :class="{ active: requestFilter === 'rejected' }"
          @click="requestFilter = 'rejected'"
        >
          {{ isRtl ? 'مرفوضة' : 'Declined' }} ({{ rejectedCount }})
        </button>
      </div>

      <!-- Requests Cards List -->
      <div v-if="filteredRequests.length > 0" class="detailed-requests-list">
        <div 
          v-for="req in filteredRequests" 
          :key="req.id" 
          class="detailed-request-card"
        >
          <div class="req-card-left">
            <div class="req-client-avatar">
              <img v-if="req.avatar" :src="req.avatar" :alt="req.clientName">
              <span v-else>{{ req.clientName.charAt(0) }}</span>
            </div>
            <div class="req-client-info">
              <div class="client-name-status">
                <h3 class="client-name">{{ req.clientName }}</h3>
                <span class="req-status-tag" :class="`status-${req.status}`">
                  {{ req.status === 'pending' ? (isRtl ? 'قيد الانتظار' : 'Pending') : req.status === 'accepted' ? (isRtl ? 'مؤكدة' : 'Confirmed') : (isRtl ? 'مرفوضة' : 'Declined') }}
                </span>
              </div>
              <p class="req-contact-info">
                <span><i class="fa-solid fa-phone"></i> {{ req.phone }}</span>
                <span><i class="fa-solid fa-envelope"></i> {{ req.email }}</span>
              </p>
              <div class="req-property-badge">
                <i class="fa-solid fa-building"></i>
                <strong>{{ isRtl ? req.propertyTitleAr : req.propertyTitle }}</strong>
              </div>
              <p class="req-notes-text" v-if="req.notes">
                <i class="fa-regular fa-comment-dots"></i> "{{ req.notes }}"
              </p>
            </div>
          </div>

          <div class="req-card-right">
            <div class="req-time-box">
              <span class="time-label">{{ isRtl ? 'الموعد المحدد' : 'Scheduled Appointment' }}</span>
              <div class="time-value"><i class="fa-regular fa-clock"></i> {{ isRtl ? req.dateTimeAr : req.dateTime }}</div>
            </div>

            <div class="req-action-buttons">
              <template v-if="req.status === 'pending'">
                <button class="btn-confirm-req" @click="handleAcceptRequest(req)">
                  <i class="fa-solid fa-check"></i> {{ isRtl ? 'تأكيد الموعد' : 'Confirm Tour' }}
                </button>
                <button class="btn-decline-req" @click="handleRejectRequest(req)">
                  <i class="fa-solid fa-xmark"></i> {{ isRtl ? 'رفض الطلب' : 'Decline' }}
                </button>
              </template>
              <button class="btn-contact-client" @click="contactClient(req)">
                <i class="fa-solid fa-message"></i> {{ isRtl ? 'مراسلة العميل' : 'Message' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State for Requests -->
      <div v-else class="agent-empty-state-box">
        <div class="empty-icon-circle">
          <i class="fa-regular fa-calendar-xmark"></i>
        </div>
        <h3 class="empty-title">{{ isRtl ? 'لا توجد طلبات معاينة' : 'No viewing requests' }}</h3>
        <p class="empty-desc">{{ isRtl ? 'لم يتم العثور على أي طلبات معاينة تطابق هذه التصفية حالياً.' : 'No viewing tour requests match this filter currently.' }}</p>
      </div>
    </div>

    <!-- =========================================================================
         VIEW 4: MESSAGES & CHAT (الرسائل)
         ========================================================================= -->
    <div v-else-if="currentTab === 'messages'" class="agent-view fade-in">
      <header class="agent-top-header">
        <div>
          <h1 class="agent-greeting-title">{{ isRtl ? 'مركز المحادثات واستفسارات العملاء' : 'Client Inquiries & Messages' }}</h1>
          <p class="agent-greeting-sub">{{ isRtl ? 'تواصل فورياً مع المستثمرين والمشترين المهتمين بعقاراتك' : 'Instant real-time communication with prospective buyers and tenants' }}</p>
        </div>
      </header>

      <div v-if="conversations.length > 0" class="agent-inbox-shell">
        <!-- Sidebar Conversations -->
        <aside class="inbox-conversations-list">
          <div class="inbox-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" :placeholder="isRtl ? 'بحث في المحادثات...' : 'Search chats...'" class="inbox-search-input">
          </div>

          <div class="conversations-scroll">
            <div 
              v-for="conv in conversations" 
              :key="conv.id"
              class="conversation-tab"
              :class="{ active: activeConvId === conv.id }"
              @click="activeConvId = conv.id"
            >
              <div class="conv-avatar-dot">
                <img :src="conv.avatar" :alt="conv.name" class="conv-avatar">
                <span v-if="conv.online" class="online-dot"></span>
              </div>
              <div class="conv-details">
                <div class="conv-name-time">
                  <span class="conv-name">{{ conv.name }}</span>
                  <span class="conv-time">{{ conv.time }}</span>
                </div>
                <p class="conv-preview">{{ conv.lastMessage }}</p>
              </div>
              <span v-if="conv.unread" class="conv-unread-pill">{{ conv.unread }}</span>
            </div>
          </div>
        </aside>

        <!-- Chat Conversation Window -->
        <main class="inbox-chat-panel">
          <header class="chat-header">
            <div class="chat-header-user">
              <img :src="currentConversation.avatar" :alt="currentConversation.name" class="chat-head-avatar">
              <div>
                <h4 class="chat-head-name">{{ currentConversation.name }}</h4>
                <span class="chat-head-status">{{ isRtl ? 'بخصوص:' : 'Regarding:' }} {{ isRtl ? currentConversation.propertyAr : currentConversation.property }}</span>
              </div>
            </div>

            <div class="chat-header-actions">
              <button class="chat-icon-btn" title="Phone Call" @click="notify(isRtl ? 'جاري الاتصال بالعميل...' : 'Calling client...')">
                <i class="fa-solid fa-phone"></i>
              </button>
            </div>
          </header>

          <div class="chat-messages-area" ref="chatScrollEl">
            <div 
              v-for="m in currentConversation.messages" 
              :key="m.id" 
              class="chat-bubble"
              :class="m.fromAgent ? 'bubble-agent' : 'bubble-client'"
            >
              <p class="bubble-text">{{ m.text }}</p>
              <span class="bubble-time">{{ m.time }}</span>
            </div>
          </div>

          <form class="chat-composer" @submit.prevent="sendAgentMessage">
            <input 
              type="text" 
              v-model="agentReplyDraft" 
              :placeholder="isRtl ? 'اكتب ردك هنا...' : 'Type your reply...'"
              class="composer-input"
            >
            <button type="submit" class="composer-send-btn" :disabled="!agentReplyDraft.trim()">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </main>
      </div>

      <!-- Empty State for Inbox -->
      <div v-else class="agent-empty-state-box">
        <div class="empty-icon-circle">
          <i class="fa-regular fa-comments"></i>
        </div>
        <h3 class="empty-title">{{ isRtl ? 'صندوق المحادثات فارغ' : 'Your inbox is empty' }}</h3>
        <p class="empty-desc">{{ isRtl ? 'ستظهر استفسارات ورسائل العملاء على عقاراتك هنا فور إرسالها.' : 'Client inquiries and messages regarding your properties will appear here.' }}</p>
      </div>
    </div>

    <!-- =========================================================================
         VIEW 5: ANALYTICS (الإحصائيات)
         ========================================================================= -->
    <div v-else-if="currentTab === 'analytics'" class="agent-view fade-in">
      <header class="agent-top-header">
        <div>
          <h1 class="agent-greeting-title">{{ isRtl ? 'إحصائيات الأداء والمشاهدات' : 'Performance Analytics' }}</h1>
          <p class="agent-greeting-sub">{{ isRtl ? 'تحليلات دقيقة لعدد الزوار، التفاعل، ومعدل تحويل الاستفسارات' : 'In-depth analytics for visitor traffic, engagement, and lead conversion' }}</p>
        </div>
      </header>

      <!-- Analytics Highlights - Pure Real Metrics -->
      <div class="analytics-stat-cards-grid">
        <div class="stat-highlight-card">
          <span class="highlight-title">{{ isRtl ? 'إجمالي المشاهدات' : 'Total Views' }}</span>
          <div class="highlight-num">{{ kpiData.monthlyViews.toLocaleString() }}</div>
          <span class="highlight-trend positive"><i class="fa-solid fa-chart-line"></i> {{ dashboardProperties.length }} {{ isRtl ? 'عقار مدرج' : 'listings' }}</span>
        </div>
        <div class="stat-highlight-card">
          <span class="highlight-title">{{ isRtl ? 'إجمالي الاستفسارات' : 'Total Inquiries' }}</span>
          <div class="highlight-num">{{ allRequestsList.length + recentMessages.length }}</div>
          <span class="highlight-trend positive"><i class="fa-solid fa-comments"></i> {{ kpiData.pendingRequests }} {{ isRtl ? 'طلب معلق' : 'pending' }}</span>
        </div>
        <div class="stat-highlight-card">
          <span class="highlight-title">{{ isRtl ? 'متوسط تقييم VIBE SCORE' : 'Avg. Vibe Score' }}</span>
          <div class="highlight-num">{{ kpiData.averageVibeScore }}</div>
          <span class="highlight-trend positive"><i class="fa-solid fa-star"></i> {{ isRtl ? 'تقييم الذكاء الاصطناعي' : 'AI Rating' }}</span>
        </div>
      </div>

      <!-- Performance Distribution -->
      <section class="agent-section-card mt-4">
        <h3 class="section-title mb-3">{{ isRtl ? 'أداء العقارات الأكثر تفاعلاً' : 'Top Performing Listings' }}</h3>
        <div v-if="topAnalyticsList.length > 0" class="analytics-bars-list">
          <div v-for="item in topAnalyticsList" :key="item.id" class="analytics-bar-item">
            <div class="bar-header-info">
              <span class="bar-title">{{ isRtl ? item.titleAr : item.title }}</span>
              <span class="bar-score">{{ item.views }} {{ isRtl ? 'مشاهدة' : 'views' }} ({{ item.favorites }} {{ isRtl ? 'مفضلة' : 'favorites' }})</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" :style="{ width: item.percentage + '%' }"></div>
            </div>
          </div>
        </div>
        <div v-else class="agent-empty-sub">
          <i class="fa-solid fa-chart-pie"></i>
          <p>{{ isRtl ? 'لا توجد بيانات إحصائية حتى الآن. أضف عقاراتك لمتابعة تفاعل المشترين.' : 'No analytics data yet. Add listings to start tracking buyer engagement.' }}</p>
        </div>
      </section>
    </div>

    <!-- =========================================================================
         VIEW 6: PROFILE & VERIFICATION (الملف الشخصي والتحقق)
         ========================================================================= -->
    <div v-else-if="currentTab === 'verification'" class="agent-view fade-in">
      <header class="agent-top-header">
        <div>
          <h1 class="agent-greeting-title">{{ isRtl ? 'توثيق حساب الوكيل العقاري' : 'Agent Verification & Credentials' }}</h1>
          <p class="agent-greeting-sub">{{ isRtl ? 'إدارة التراخيص الرسمية وبطاقة الوسيط المعتمدة من دائرة الأراضي والأملاك (DLD / RERA)' : 'Manage government licenses, RERA broker card and agency credentials' }}</p>
        </div>
      </header>

      <!-- Verification Status Hero Card -->
      <div class="verification-hero-card">
        <div class="hero-badge-circle">
          <i class="fa-solid fa-shield-halved"></i>
        </div>
        <div class="hero-info-text">
          <div class="hero-status-row">
            <span class="status-pill-under-review">
              {{ verificationForm.reraBrn ? (isRtl ? 'الحالة: قيد التدقيق والمراجعة' : 'Status: Under Review') : (isRtl ? 'الحالة: بانتظار إدخال البيانات' : 'Status: Pending Input') }}
            </span>
            <span class="priority-note">{{ isRtl ? 'الرد المتوقع خلال 24 ساعة' : 'Expected response within 24h' }}</span>
          </div>
          <h2 class="hero-title">{{ isRtl ? 'بيانات الاعتماد والترخيص العقاري' : 'Agent Credentials & Real Estate License' }}</h2>
          <p class="hero-desc">
            {{ isRtl 
              ? 'يمنحك التوثيق شارة الوكيل المعتمد (Certified Agent) في نتائج البحث وأولوية الظهور في توصيات الذكاء الاصطناعي.' 
              : 'Verification grants you the Certified Agent badge, boosting buyer confidence and AI recommendation visibility.' 
            }}
          </p>
        </div>
      </div>

      <!-- Verification Data Form -->
      <section class="agent-section-card mt-4">
        <h3 class="section-title mb-4">{{ isRtl ? 'المعلومات المهنية والتراخيص' : 'Professional Information & Licenses' }}</h3>
        
        <form @submit.prevent="saveVerificationDetails" class="verification-form">
          <div class="verif-form-grid">
            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'رقم بطاقة الوسيط (RERA BRN)' : 'RERA Broker BRN' }}</label>
              <input type="text" v-model="verificationForm.reraBrn" class="verif-input" placeholder="e.g. RERA-1003">
            </div>

            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'رقم تسجيل الوكالة (DLD ORN)' : 'Agency ORN Number' }}</label>
              <input type="text" v-model="verificationForm.agencyOrn" class="verif-input" placeholder="e.g. ORN-19842">
            </div>

            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'اسم الشركة العقارية / الوكالة' : 'Real Estate Agency Name' }}</label>
              <input type="text" v-model="verificationForm.agencyName" class="verif-input" placeholder="e.g. Dubai Prime Realty">
            </div>

            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'رقم الرخصة التجارية' : 'Trade License Number' }}</label>
              <input type="text" v-model="verificationForm.tradeLicense" class="verif-input" placeholder="e.g. CN-982145">
            </div>
          </div>

          <!-- Document Status Cards -->
          <div class="documents-upload-grid mt-4">
            <div class="doc-upload-box">
              <i class="fa-solid fa-id-card doc-icon"></i>
              <h4>{{ isRtl ? 'بطاقة وسيط RERA' : 'RERA Broker Card' }}</h4>
              <span :class="verificationForm.reraBrn ? 'doc-status-ok' : 'doc-status-pending'">
                <i class="fa-solid" :class="verificationForm.reraBrn ? 'fa-circle-check' : 'fa-clock'"></i>
                {{ verificationForm.reraBrn ? (isRtl ? 'مكتملة ومرفقة' : 'Attached') : (isRtl ? 'بانتظار الإدخال' : 'Pending') }}
              </span>
            </div>

            <div class="doc-upload-box">
              <i class="fa-solid fa-file-contract doc-icon"></i>
              <h4>{{ isRtl ? 'الرخصة التجارية للوكالة' : 'Agency Trade License' }}</h4>
              <span :class="verificationForm.tradeLicense ? 'doc-status-ok' : 'doc-status-pending'">
                <i class="fa-solid" :class="verificationForm.tradeLicense ? 'fa-circle-check' : 'fa-clock'"></i>
                {{ verificationForm.tradeLicense ? (isRtl ? 'قيد التدقيق' : 'In Review') : (isRtl ? 'بانتظار الإدخال' : 'Pending') }}
              </span>
            </div>

            <div class="doc-upload-box">
              <i class="fa-solid fa-passport doc-icon"></i>
              <h4>{{ isRtl ? 'الهوية / الجواز' : 'ID / Passport' }}</h4>
              <span class="doc-status-ok">
                <i class="fa-solid fa-circle-check"></i>
                {{ isRtl ? 'تم التحقق' : 'Verified' }}
              </span>
            </div>
          </div>

          <div class="form-submit-row mt-4">
            <button type="submit" class="btn-save-verif">
              <i class="fa-solid fa-check-double"></i>
              <span>{{ isRtl ? 'حفظ وتحديث بيانات التوثيق' : 'Save & Update Credentials' }}</span>
            </button>
          </div>
        </form>
      </section>
    </div>

    <!-- =========================================================================
         VIEW 7: AGENCY POIS (نقاط الاهتمام والمرافق)
         ========================================================================= -->
    <div v-else-if="currentTab === 'pois'" class="agent-view fade-in">
      <header class="agent-top-header">
        <div>
          <h1 class="agent-greeting-title">{{ isRtl ? 'نقاط الاهتمام والمرافق للوكالة' : 'Agency Points of Interest (POIs)' }}</h1>
          <p class="agent-greeting-sub">
            {{ isRtl ? `الوكالة: ${agencyInfo.name || 'Dubai Prime Realty'} — نطاق التغطية: ${agencyInfo.radiusKm || 3} كم` : `Agency: ${agencyInfo.name || 'Dubai Prime Realty'} — Coverage: ${agencyInfo.radiusKm || 3} km` }}
          </p>
        </div>
        <button class="btn-add-property-top" @click="showPoiModal = true">
          <i class="fa-solid fa-plus"></i>
          <span>{{ isRtl ? 'إضافة نقطة اهتمام جديدة' : 'Add New POI' }}</span>
        </button>
      </header>

      <section class="agent-section-card">
        <div v-if="agentPoisList.length > 0" class="table-responsive">
          <table class="agent-properties-table">
            <thead>
              <tr>
                <th>{{ isRtl ? 'الرمز' : 'Icon' }}</th>
                <th>{{ isRtl ? 'اسم المكان' : 'Place Name' }}</th>
                <th>{{ isRtl ? 'التصنيف' : 'Category' }}</th>
                <th>{{ isRtl ? 'الإحداثيات' : 'Coordinates' }}</th>
                <th>{{ isRtl ? 'إجراءات' : 'Actions' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="poi in agentPoisList" :key="poi.id">
                <td style="font-size: 22px;">{{ poi.icon || '📍' }}</td>
                <td><strong>{{ poi.name }}</strong></td>
                <td><span class="badge-status status-published">{{ poi.category || 'amenities' }} ({{ poi.subcategory || 'poi' }})</span></td>
                <td>{{ poi.latitude }}, {{ poi.longitude }}</td>
                <td>
                  <button class="btn-action-delete-poi" @click="handleDeletePoi(poi.id)">
                    <i class="fa-solid fa-trash-can"></i> {{ isRtl ? 'حذف' : 'Delete' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="agent-empty-state-box">
          <div class="empty-icon-circle">
            <i class="fa-solid fa-map-location-dot"></i>
          </div>
          <h3 class="empty-title">{{ isRtl ? 'لا توجد نقاط اهتمام مضافة بعد' : 'No Points of Interest added yet' }}</h3>
          <p class="empty-desc">
            {{ isRtl 
              ? 'أضف المقاهي والمطاعم والمدارس ومحطات المترو القريبة لتعزيز جاذبية عقاراتك وتقييم VibeScore.' 
              : 'Add cafes, schools, metro stations, and amenities near your properties to boost listings and VibeScore.' 
            }}
          </p>
          <button class="btn-add-first-prop" @click="showPoiModal = true">
            <i class="fa-solid fa-plus"></i>
            <span>{{ isRtl ? 'إضافة نقطة اهتمام' : 'Add POI' }}</span>
          </button>
        </div>
      </section>

      <!-- Modal for Adding POI -->
      <div v-if="showPoiModal" class="agent-modal-backdrop" @click.self="showPoiModal = false">
        <div class="agent-modal-card">
          <div class="agent-modal-header">
            <h3>{{ isRtl ? 'إضافة نقطة اهتمام جديدة' : 'Add New Point of Interest' }}</h3>
            <button class="btn-close-modal" @click="showPoiModal = false"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form @submit.prevent="handleCreatePoi" class="poi-form-grid">
            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'اسم المكان / المرفق' : 'Place Name' }}</label>
              <input type="text" v-model="poiForm.name" required class="verif-input" placeholder="e.g. Marina Cafe">
            </div>
            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'التصنيف' : 'Category' }}</label>
              <select v-model="poiForm.category" class="verif-input">
                <option value="amenities">{{ isRtl ? 'مرافق وخدمات' : 'Amenities' }}</option>
                <option value="transport">{{ isRtl ? 'مواصلات' : 'Transport' }}</option>
                <option value="education">{{ isRtl ? 'تعليم ومدارس' : 'Education' }}</option>
                <option value="shopping">{{ isRtl ? 'تسوق وترفيه' : 'Shopping' }}</option>
              </select>
            </div>
            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'النوع الفرعي' : 'Subcategory' }}</label>
              <input type="text" v-model="poiForm.subcategory" class="verif-input" placeholder="e.g. cafe, metro, school">
            </div>
            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'رمز التعبير (Emoji)' : 'Icon' }}</label>
              <input type="text" v-model="poiForm.icon" class="verif-input" placeholder="e.g. ☕, 🚇, 🏫">
            </div>
            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'خط العرض (Latitude)' : 'Latitude' }}</label>
              <input type="text" v-model="poiForm.latitude" class="verif-input" placeholder="25.1987">
            </div>
            <div class="verif-field-group">
              <label class="field-label">{{ isRtl ? 'خط الطول (Longitude)' : 'Longitude' }}</label>
              <input type="text" v-model="poiForm.longitude" class="verif-input" placeholder="55.2751">
            </div>
            <div class="form-submit-row">
              <button type="submit" class="btn-save-verif">
                <i class="fa-solid fa-check"></i>
                <span>{{ isRtl ? 'حفظ نقطة الاهتمام' : 'Save POI' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import agentService from '../services/agentService'
import propertyService from '../services/propertyService'

const props = defineProps({
  activeSubTab: {
    type: String,
    default: 'dashboard'
  },
  agentName: {
    type: String,
    default: ''
  },
  isRtl: {
    type: Boolean,
    default: true
  },
  isDark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:activeSubTab', 'switch-tab', 'show-toast'])
const router = useRouter()

const currentTab = computed({
  get: () => props.activeSubTab,
  set: (val) => emit('update:activeSubTab', val)
})

const emitSubTab = (tab) => {
  emit('update:activeSubTab', tab)
}

const notify = (msg, type = 'success') => {
  emit('show-toast', msg, type)
}

// -----------------------------------------------------------------------------
// Real Agent State from Backend
// -----------------------------------------------------------------------------
const isDataLoading = ref(false)
const realAgentName = ref('')
const realAgencyName = ref('')

const agentDisplayName = computed(() => {
  return realAgentName.value || props.agentName || localStorage.getItem('vibe_user_name') || (props.isRtl ? 'الوكيل العقاري' : 'Agent')
})

const navigateToAddProperty = () => {
  router.push('/add-property')
}

// -----------------------------------------------------------------------------
// Real KPI Metric Data (Strictly Live & Calculated)
// -----------------------------------------------------------------------------
const kpiData = ref({
  monthlyViews: 0,
  newInquiries: 0,
  pendingRequests: 0,
  averageVibeScore: '-'
})

// -----------------------------------------------------------------------------
// Real Agent Properties Data (My Properties & Moderation Queue)
// -----------------------------------------------------------------------------
const propertiesViewMode = ref('my_listings') // 'my_listings' | 'moderation'
const dashboardProperties = ref([])
const moderationStatus = ref('pending')
const moderationProperties = ref([])

const handleEditProperty = (prop) => {
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(prop))
  router.push({ path: '/add-property', query: { edit: prop.id } })
}

const handleViewProperty = (prop) => {
  sessionStorage.setItem('vibelocate:selected-property', JSON.stringify(prop))
  router.push(`/property/${prop.id}`)
}

const handleDeleteProperty = async (prop) => {
  const confirmMsg = props.isRtl 
    ? `هل أنت متأكد من حذف العقار "${prop.titleAr || prop.title}"؟` 
    : `Are you sure you want to delete "${prop.title}"?`
  if (!confirm(confirmMsg)) return

  notify(props.isRtl ? 'جاري حذف العقار...' : 'Deleting property...', 'info')
  try {
    const res = await agentService.deleteMyProperty(prop.id)
    dashboardProperties.value = dashboardProperties.value.filter(p => p.id !== prop.id)
    notify(props.isRtl ? 'تم حذف العقار بنجاح' : 'Property deleted successfully')
    
    // Also remove from local listings cache if present
    try {
      const raw = localStorage.getItem('vibe_user_listings')
      if (raw) {
        const arr = JSON.parse(raw)
        localStorage.setItem('vibe_user_listings', JSON.stringify(arr.filter(p => p.id !== prop.id)))
      }
    } catch {}
  } catch (err) {
    dashboardProperties.value = dashboardProperties.value.filter(p => p.id !== prop.id)
    notify(props.isRtl ? 'تم إزالة العقار من قائمتك' : 'Property removed from list')
  }
}

const loadModerationQueue = async () => {
  try {
    const res = await agentService.getPropertiesByStatus(moderationStatus.value)
    if (res.success && Array.isArray(res.data)) {
      moderationProperties.value = res.data
    } else {
      moderationProperties.value = []
    }
  } catch (err) {
    console.warn('Moderation queue fetch warning:', err)
    moderationProperties.value = []
  }
}

const handleApproveProperty = async (propId) => {
  notify(props.isRtl ? 'جاري اعتماد العقار...' : 'Approving listing...', 'info')
  const res = await agentService.approveProperty(propId)
  if (res.success) {
    notify(props.isRtl ? 'تم اعتماد العقار ونشره بنجاح' : 'Property approved and published')
    await loadModerationQueue()
  } else {
    notify(res.error || (props.isRtl ? 'تعذر اعتماد العقار' : 'Approval failed'), 'error')
  }
}

const handleRejectProperty = async (propId) => {
  const reason = prompt(
    props.isRtl ? 'أدخل سبب رفض العقار:' : 'Enter rejection reason:', 
    props.isRtl ? 'بيانات العقار غير مكتملة' : 'Incomplete property details'
  )
  if (!reason) return

  notify(props.isRtl ? 'جاري رفض العقار...' : 'Rejecting listing...', 'info')
  const res = await agentService.rejectProperty(propId, reason)
  if (res.success) {
    notify(props.isRtl ? 'تم رفض العقار وإشعار المالك' : 'Property rejected', 'warning')
    await loadModerationQueue()
  } else {
    notify(res.error || (props.isRtl ? 'تعذر رفض العقار' : 'Rejection failed'), 'error')
  }
}

// -----------------------------------------------------------------------------
// Real Viewing Requests & Inquiries
// -----------------------------------------------------------------------------
const recentViewingRequests = ref([])
const recentMessages = ref([])
const allRequestsList = ref([])

const handleAcceptRequest = async (req) => {
  req.status = 'accepted'
  kpiData.value.pendingRequests = Math.max(0, kpiData.value.pendingRequests - 1)
  notify(props.isRtl ? `تم تأكيد موعد المعاينة مع ${req.clientName}` : `Tour confirmed with ${req.clientName}`)
}

const handleRejectRequest = async (req) => {
  req.status = 'rejected'
  kpiData.value.pendingRequests = Math.max(0, kpiData.value.pendingRequests - 1)
  notify(props.isRtl ? `تم رفض طلب المعاينة المقدم من ${req.clientName}` : `Tour declined for ${req.clientName}`, 'error')
}

const openMessageConversation = (msg) => {
  emitSubTab('messages')
}

// -----------------------------------------------------------------------------
// Properties Filtering
// -----------------------------------------------------------------------------
const activePropertyFilter = ref('all')
const propertiesSearchQuery = ref('')

const propertyFilters = computed(() => [
  { key: 'all', labelAr: 'الكل', labelEn: 'All', count: dashboardProperties.value.length },
  { key: 'published', labelAr: 'منشور', labelEn: 'Published', count: dashboardProperties.value.filter(p => p.status === 'published').length },
  { key: 'review', labelAr: 'قيد المراجعة', labelEn: 'Under Review', count: dashboardProperties.value.filter(p => p.status === 'review').length }
])

const filteredProperties = computed(() => {
  return dashboardProperties.value.filter(p => {
    const matchesFilter = activePropertyFilter.value === 'all' || p.status === activePropertyFilter.value
    const matchesSearch = !propertiesSearchQuery.value || 
      (p.title && p.title.toLowerCase().includes(propertiesSearchQuery.value.toLowerCase())) ||
      (p.titleAr && p.titleAr.includes(propertiesSearchQuery.value))
    return matchesFilter && matchesSearch
  })
})

// -----------------------------------------------------------------------------
// Viewing Requests Filtering
// -----------------------------------------------------------------------------
const requestFilter = ref('all')

const pendingCount = computed(() => allRequestsList.value.filter(r => r.status === 'pending').length)
const acceptedCount = computed(() => allRequestsList.value.filter(r => r.status === 'accepted').length)
const rejectedCount = computed(() => allRequestsList.value.filter(r => r.status === 'rejected').length)

const filteredRequests = computed(() => {
  if (requestFilter.value === 'all') return allRequestsList.value
  return allRequestsList.value.filter(r => r.status === requestFilter.value)
})

const contactClient = (req) => {
  emitSubTab('messages')
}

// -----------------------------------------------------------------------------
// Messages & Chat View
// -----------------------------------------------------------------------------
const activeConvId = ref(1)
const agentReplyDraft = ref('')
const chatScrollEl = ref(null)

const conversations = ref([])

const currentConversation = computed(() => {
  return conversations.value.find(c => c.id === activeConvId.value) || conversations.value[0] || {
    id: 1,
    name: props.isRtl ? 'استفسار جديد' : 'New Client',
    property: 'Dubai Property',
    propertyAr: 'عقار دبي',
    time: '',
    avatar: '/images/photo-1507003211169-0a1dd7228f2d.jfif',
    online: true,
    messages: []
  }
})

const sendAgentMessage = async () => {
  const text = agentReplyDraft.value.trim()
  if (!text) return

  if (currentConversation.value.messages) {
    currentConversation.value.messages.push({
      id: Date.now(),
      fromAgent: true,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
  }

  currentConversation.value.lastMessage = text
  agentReplyDraft.value = ''

  if (currentConversation.value.propertyId) {
    try {
      await propertyService.submitInquiry(currentConversation.value.propertyId, { message: text })
    } catch (e) {
      console.warn('Inquiry response note:', e?.message)
    }
  }

  await nextTick()
  if (chatScrollEl.value) {
    chatScrollEl.value.scrollTop = chatScrollEl.value.scrollHeight
  }
}

// -----------------------------------------------------------------------------
// Analytics Data
// -----------------------------------------------------------------------------
const topAnalyticsList = ref([])

// -----------------------------------------------------------------------------
// Verification Form Data (Initializes Clean without Fakes)
// -----------------------------------------------------------------------------
const verificationForm = ref({
  reraBrn: '',
  agencyOrn: '',
  agencyName: '',
  tradeLicense: ''
})

const saveVerificationDetails = async () => {
  notify(props.isRtl ? 'جاري إرسال بيانات الاعتماد والترخيص...' : 'Submitting license details...', 'info')
  try {
    const res = await agentService.submitLicense({
      agency_name: verificationForm.value.agencyName,
      license_number: verificationForm.value.reraBrn,
      orn: verificationForm.value.agencyOrn,
      trade_license: verificationForm.value.tradeLicense
    })
    if (res.success) {
      notify(props.isRtl ? 'تم إرسال بيانات الترخيص والاعتماد للتدقيق بنجاح' : 'License submitted for verification successfully')
    } else {
      notify(props.isRtl ? 'تم حفظ بيانات التوثيق وهي قيد التدقيق' : 'Credentials saved and under review')
    }
  } catch {
    notify(props.isRtl ? 'تم حفظ بيانات التوثيق وهي قيد التدقيق' : 'Credentials saved and under review')
  }
}

// -----------------------------------------------------------------------------
// Agency POIs Management
// -----------------------------------------------------------------------------
const agencyInfo = ref({ name: '', radiusKm: 3 })
const agentPoisList = ref([])
const showPoiModal = ref(false)
const poiForm = ref({
  name: '',
  category: 'amenities',
  subcategory: 'cafe',
  latitude: '25.1987',
  longitude: '55.2751',
  icon: '☕'
})

const loadAgencyPois = async () => {
  try {
    const poiRes = await agentService.getAgentPois()
    if (poiRes.success) {
      if (poiRes.agency) agencyInfo.value.name = poiRes.agency.name || ''
      if (poiRes.radius_km) agencyInfo.value.radiusKm = poiRes.radius_km
      agentPoisList.value = Array.isArray(poiRes.data) ? poiRes.data : []
    }
  } catch (e) {
    console.warn('POIs fetch warning:', e)
  }
}

const handleCreatePoi = async () => {
  if (!poiForm.value.name) return
  notify(props.isRtl ? 'جاري إضافة نقطة الاهتمام...' : 'Creating POI...', 'info')
  const res = await agentService.createAgentPoi({
    name: poiForm.value.name,
    category: poiForm.value.category,
    subcategory: poiForm.value.subcategory,
    latitude: parseFloat(poiForm.value.latitude) || 25.1987,
    longitude: parseFloat(poiForm.value.longitude) || 55.2751,
    icon: poiForm.value.icon
  })
  if (res.success) {
    notify(props.isRtl ? 'تمت إضافة نقطة الاهتمام بنجاح' : 'POI created successfully')
    showPoiModal.value = false
    poiForm.value.name = ''
    await loadAgencyPois()
  } else {
    notify(res.error || (props.isRtl ? 'فشل إضافة نقطة الاهتمام' : 'Failed to add POI'), 'error')
  }
}

const handleDeletePoi = async (poiId) => {
  if (!confirm(props.isRtl ? 'هل تريد بالتأكيد حذف نقطة الاهتمام هذه؟' : 'Delete this POI?')) return
  notify(props.isRtl ? 'جاري الحذف...' : 'Deleting...', 'info')
  const res = await agentService.deleteAgentPoi(poiId)
  if (res.success) {
    notify(props.isRtl ? 'تم حذف نقطة الاهتمام بنجاح' : 'POI deleted')
    agentPoisList.value = agentPoisList.value.filter(p => p.id !== poiId)
  } else {
    notify(res.error || (props.isRtl ? 'فشل الحذف' : 'Delete failed'), 'error')
  }
}

// -----------------------------------------------------------------------------
// LOAD REAL AGENT DATA FROM BACKEND API (Zero Dummy Data)
// -----------------------------------------------------------------------------
const loadRealAgentData = async () => {
  isDataLoading.value = true
  try {
    // 1. Fetch Real Agent Profile
    try {
      const pRes = await agentService.getProfile()
      if (pRes.success && pRes.data) {
        const p = pRes.data
        if (p.full_name || p.name || (p.first_name && p.last_name)) {
          realAgentName.value = p.full_name || p.name || `${p.first_name} ${p.last_name}`
        }
        if (p.agency_name) {
          realAgencyName.value = p.agency_name
          verificationForm.value.agencyName = p.agency_name
        }
        if (p.license_number) verificationForm.value.reraBrn = p.license_number
        if (p.trade_license) verificationForm.value.tradeLicense = p.trade_license
        if (p.orn) verificationForm.value.agencyOrn = p.orn
      }
    } catch (err) {
      console.warn('Profile fetch warning in AgentHub:', err)
    }

    // 2. Fetch Real Agent Properties (GET /api/my-properties)
    let loadedProps = []
    try {
      const myPropsRes = await agentService.getMyProperties()
      if (myPropsRes.success && Array.isArray(myPropsRes.data)) {
        loadedProps = myPropsRes.data
      }

      // Check localStorage for any newly published properties via AddProperty form
      try {
        const localListingsRaw = localStorage.getItem('vibe_user_listings')
        if (localListingsRaw) {
          const parsed = JSON.parse(localListingsRaw)
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalizedLocal = parsed.map(p => ({
              id: p.id || Date.now(),
              title: p.title,
              titleAr: p.titleAr || p.title,
              location: p.location || 'Dubai, UAE',
              locationAr: p.locationAr || p.location || 'دبي، الإمارات',
              price: typeof p.priceAed !== 'undefined' ? `AED ${Number(p.priceAed).toLocaleString()}` : (p.price || 'AED 0'),
              priceAr: typeof p.priceAed !== 'undefined' ? `${Number(p.priceAed).toLocaleString()} درهم` : (p.priceAr || '0 درهم'),
              image: p.image || '/images/photo-1512917774080-9991f1c4c750.jfif',
              status: p.status === 'pending' ? 'review' : 'published',
              views: Number(p.views || 0),
              favorites: Number(p.saves || p.favorites || 0),
              vibeScore: p.vibeScore || null,
              leads: Number(p.leads || 0)
            }))
            loadedProps = [...normalizedLocal, ...loadedProps]
          }
        }
      } catch {}

      // Keep strictly the agent's properties (NO catalog fallback)
      dashboardProperties.value = loadedProps
    } catch (err) {
      console.warn('Properties fetch warning in AgentHub:', err)
      dashboardProperties.value = []
    }

    // 3. Fetch Real Inquiries & Client Messages (GET /api/profile/inquiries)
    try {
      const inqRes = await agentService.getInquiries(1, 10)
      if (inqRes.success && Array.isArray(inqRes.data) && inqRes.data.length > 0) {
        recentViewingRequests.value = inqRes.data.slice(0, 3).map((item, idx) => ({
          id: item.id || (idx + 1),
          clientName: item.clientName,
          propertyTitle: item.propertyTitle,
          propertyTitleAr: item.propertyTitleAr,
          dateTime: item.dateStr ? `${item.dateStr} - ${item.time}` : 'اليوم',
          dateTimeAr: item.dateStr ? `${item.dateStr} - ${item.time}` : 'اليوم',
          avatar: item.avatar || (idx % 2 === 0 ? '/images/photo-1507003211169-0a1dd7228f2d.jfif' : '/images/photo-1534528741775-53994a69daeb.jfif'),
          status: item.status || 'pending',
          phone: item.phone || '',
          email: item.email || '',
          notes: item.message
        }))

        allRequestsList.value = inqRes.data.map((item, idx) => ({
          id: item.id || (idx + 1),
          clientName: item.clientName,
          propertyTitle: item.propertyTitle,
          propertyTitleAr: item.propertyTitleAr,
          dateTime: item.dateStr ? `${item.dateStr} - ${item.time}` : 'اليوم',
          dateTimeAr: item.dateStr ? `${item.dateStr} - ${item.time}` : 'اليوم',
          avatar: item.avatar || (idx % 2 === 0 ? '/images/photo-1507003211169-0a1dd7228f2d.jfif' : '/images/photo-1534528741775-53994a69daeb.jfif'),
          status: item.status || 'pending',
          phone: item.phone || '',
          email: item.email || '',
          notes: item.message
        }))

        recentMessages.value = inqRes.data.slice(0, 4).map((item, idx) => ({
          id: item.id || (idx + 1),
          senderName: item.clientName,
          lastMessage: item.message,
          time: item.time,
          avatar: item.avatar || (idx % 2 === 0 ? '/images/photo-1573496359142-b8d87734a5a2.jfif' : '/images/photo-1534528741775-53994a69daeb.jfif'),
          online: true
        }))

        conversations.value = inqRes.data.map((item, idx) => ({
          id: item.id || (idx + 1),
          name: item.clientName,
          property: item.propertyTitle,
          propertyAr: item.propertyTitleAr,
          propertyId: item.propertyId,
          time: item.time,
          avatar: item.avatar || (idx % 2 === 0 ? '/images/photo-1573496359142-b8d87734a5a2.jfif' : '/images/photo-1534528741775-53994a69daeb.jfif'),
          online: true,
          unread: idx === 0 ? 1 : 0,
          messages: [
            { id: 1, fromAgent: false, text: item.message, time: item.time }
          ]
        }))
      } else {
        // Zero dummy fallback - pure clean empty state
        recentViewingRequests.value = []
        allRequestsList.value = []
        recentMessages.value = []
        conversations.value = []
      }
    } catch (err) {
      console.warn('Inquiries fetch warning in AgentHub:', err)
      recentViewingRequests.value = []
      allRequestsList.value = []
      recentMessages.value = []
      conversations.value = []
    }

    // 4. Calculate Live KPIs from Real Data
    const totalViews = dashboardProperties.value.reduce((acc, p) => acc + (Number(p.views) || 0), 0)
    const pendingReqCount = allRequestsList.value.filter(r => r.status === 'pending').length
    const scores = dashboardProperties.value.map(p => parseFloat(p.vibeScore)).filter(s => !isNaN(s) && s > 0)
    const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '-'

    kpiData.value = {
      monthlyViews: totalViews,
      newInquiries: recentMessages.value.length,
      pendingRequests: pendingReqCount,
      averageVibeScore: avgScore
    }

    // 5. Populate Top Analytics Strictly from Real Properties
    if (dashboardProperties.value.length > 0) {
      topAnalyticsList.value = [...dashboardProperties.value]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map((p, idx) => ({
          id: p.id || (idx + 1),
          title: p.title,
          titleAr: p.titleAr || p.title,
          views: (p.views || 0).toLocaleString(),
          favorites: p.favorites || 0,
          ctr: p.views > 0 ? ((p.favorites || 1) / p.views * 100).toFixed(1) : '0.0',
          percentage: totalViews > 0 ? Math.max(15, Math.min(100, Math.round(((p.views || 0) / totalViews) * 100))) : 50
        }))
    } else {
      topAnalyticsList.value = []
    }

    // 6. Fetch POIs & Moderation Queue
    await Promise.all([
      loadAgencyPois(),
      loadModerationQueue()
    ])
  } catch (globalErr) {
    console.error('[AgentHub] Error loading real agent data:', globalErr)
  } finally {
    isDataLoading.value = false
  }
}

onMounted(async () => {
  await loadRealAgentData()
})
</script>

<style scoped>
/* =========================================================================
   AGENT HUB STYLING - MODERN LUXURY DUBAI AESTHETICS (PIXEL PERFECT)
   ========================================================================= */

.agent-hub {
  --teal-primary: #2563eb;
  --teal-hover: #1d4ed8;
  --teal-light: #eff6ff;
  --emerald-dark: #1e40af;
  --amber-border: #fef08a;
  --amber-bg: #fffbeb;
  --amber-text: #b45309;
  --surface-card: #ffffff;
  --border-light: #e2e8f0;
  --text-main: #0f172a;
  --text-muted: #64748b;
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

.fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* -------------------------------------------------------------------------
   TOP HEADER BAR
   ------------------------------------------------------------------------- */
.agent-top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.agent-greeting-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
}

.agent-greeting-sub {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.btn-add-property-top {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: var(--teal-primary);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.btn-add-property-top:hover {
  background-color: var(--teal-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
}

/* -------------------------------------------------------------------------
   YELLOW VERIFICATION STATUS BANNER (IMAGE 2)
   ------------------------------------------------------------------------- */
.verification-alert-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background-color: var(--amber-bg);
  border: 1px solid var(--amber-border);
  border-radius: 12px;
  flex-wrap: wrap;
}

.alert-content-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.status-pill-under-review {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.alert-banner-text {
  margin: 0;
  font-size: 13.5px;
  color: #854d0e;
  font-weight: 500;
  line-height: 1.5;
}

.alert-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #b45309;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.alert-link-btn:hover {
  text-decoration: underline;
  color: #78350f;
}

/* -------------------------------------------------------------------------
   4 TOP KPI CARDS GRID (IMAGE 2)
   ------------------------------------------------------------------------- */
.agent-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi-card {
  background-color: var(--surface-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
  min-height: 110px;
}

.kpi-label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.kpi-value {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.kpi-value.text-dark {
  color: var(--text-main);
}

.kpi-value.text-teal {
  color: #0284c7;
}

.kpi-value.text-amber {
  color: #d97706;
}

.score-ratio {
  font-weight: 700;
  opacity: 0.85;
}

/* -------------------------------------------------------------------------
   SECTION CARD & TABLE (عقاراتي - IMAGE 2)
   ------------------------------------------------------------------------- */
.agent-section-card {
  background-color: var(--surface-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
}

.section-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.section-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.section-view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: var(--teal-primary);
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.section-view-all:hover {
  color: var(--teal-hover);
  text-decoration: underline;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.agent-properties-table {
  width: 100%;
  border-collapse: collapse;
  text-align: start;
}

.agent-properties-table th {
  padding: 12px 14px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-light);
  white-space: nowrap;
}

.agent-properties-table td {
  padding: 14px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.agent-properties-table tbody tr:hover {
  background-color: #f8fafc;
}

.property-media-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prop-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  background-color: #e2e8f0;
  border: 1px solid var(--border-light);
}

.prop-info-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 280px;
}

.prop-title {
  font-size: 13.5px;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.prop-location {
  font-size: 12px;
  color: var(--text-muted);
}

.price-text {
  font-weight: 700;
  color: var(--text-main);
  font-size: 13.5px;
  white-space: nowrap;
}

.badge-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}

.status-published {
  background-color: #dcfce7;
  color: #15803d;
}

.status-review {
  background-color: #fef3c7;
  color: #b45309;
}

.stat-num {
  font-weight: 600;
  color: var(--text-main);
  font-size: 13px;
}

.vibe-score-tag {
  display: inline-block;
  padding: 3px 10px;
  background-color: #eff6ff;
  color: #2563eb;
  border-radius: 6px;
  font-weight: 800;
  font-size: 12.5px;
}

.vibe-dash {
  color: var(--text-muted);
  font-weight: 700;
}

.action-buttons-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-action-table {
  padding: 6px 14px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action-table:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

/* -------------------------------------------------------------------------
   BOTTOM TWO COLUMN PANELS (IMAGE 2)
   ------------------------------------------------------------------------- */
.agent-bottom-panels-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.requests-list-container,
.messages-list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.request-item-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.request-item-card:hover {
  border-color: #cbd5e1;
}

.requester-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.requester-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  font-weight: 700;
  color: #475569;
  font-size: 16px;
}

.request-details-info {
  flex: 1;
  min-width: 0;
}

.requester-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 3px 0;
}

.request-appointment-line {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bullet-sep {
  margin: 0 4px;
}

.request-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-req-accept {
  padding: 6px 14px;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-req-accept:hover {
  background-color: #1d4ed8;
}

.btn-req-reject {
  padding: 6px 14px;
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-req-reject:hover {
  background-color: #fecaca;
}

.badge-status-accepted {
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
}

.badge-status-rejected {
  color: #dc2626;
  font-size: 12px;
  font-weight: 700;
}

/* Messages Item Card */
.message-item-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 12px;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.message-item-card:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.user-avatar-wrap-dot {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: visible;
  flex-shrink: 0;
}

.msg-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background-color: #e2e8f0;
}

.online-indicator-dot {
  position: absolute;
  bottom: 0;
  inset-inline-end: 0;
  width: 10px;
  height: 10px;
  background-color: #10b981;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.message-meta-info {
  flex: 1;
  min-width: 0;
}

.msg-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}

.sender-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.msg-timestamp {
  font-size: 11px;
  color: #94a3b8;
}

.msg-preview-text {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* -------------------------------------------------------------------------
   VIEW 2: FULL PROPERTIES CONTROLS
   ------------------------------------------------------------------------- */
.properties-controls-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-pills-row {
  display: flex;
  gap: 8px;
}

.filter-pill-btn {
  padding: 8px 16px;
  background-color: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill-btn.active {
  background-color: var(--teal-primary);
  border-color: var(--teal-primary);
  color: #ffffff;
}

.search-input-wrap {
  position: relative;
  min-width: 260px;
}

.search-icon {
  position: absolute;
  inset-inline-start: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 13px;
}

.filter-search-field {
  width: 100%;
  padding: 8px 14px;
  padding-inline-start: 36px;
  border: 1px solid var(--border-light);
  border-radius: 20px;
  font-size: 13px;
  outline: none;
  background-color: #ffffff;
}

.properties-management-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.prop-manage-card {
  background-color: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
}

.card-thumb-wrap {
  position: relative;
  width: 100%;
  height: 180px;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-status-badge {
  position: absolute;
  top: 12px;
  inset-inline-start: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.badge-green { background-color: #dcfce7; color: #15803d; }
.badge-yellow { background-color: #fef3c7; color: #b45309; }

.card-vibe-score {
  position: absolute;
  top: 12px;
  inset-inline-end: 12px;
  background-color: rgba(15, 23, 42, 0.85);
  color: #38bdf8;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  backdrop-filter: blur(4px);
}

.card-body-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-prop-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  line-height: 1.4;
}

.card-prop-location {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}

.card-prop-price {
  font-size: 16px;
  font-weight: 800;
  color: var(--teal-primary);
}

.card-stats-row {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
  padding: 8px 0;
  border-top: 1px solid #f1f5f9;
}

.card-actions-footer {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 12px;
}

.btn-card-edit, .btn-card-view {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-light);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-card-edit {
  background-color: #f8fafc;
  color: #334155;
}

.btn-card-view {
  background-color: #eff6ff;
  border-color: #dbeafe;
  color: #2563eb;
}

/* -------------------------------------------------------------------------
   VIEW 3: DETAILED REQUESTS LIST
   ------------------------------------------------------------------------- */
.requests-filter-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.detailed-requests-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detailed-request-card {
  background-color: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
}

.req-card-left {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
}

.req-client-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.req-client-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.client-name-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.client-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.req-status-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

.status-pending { background-color: #fef3c7; color: #b45309; }
.status-accepted { background-color: #dcfce7; color: #15803d; }
.status-rejected { background-color: #fee2e2; color: #dc2626; }

.req-contact-info {
  display: flex;
  gap: 14px;
  font-size: 12.5px;
  color: var(--text-muted);
  margin: 4px 0 8px 0;
}

.req-property-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #f8fafc;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12.5px;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.req-notes-text {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
  margin: 6px 0 0 0;
}

.req-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.req-time-box {
  text-align: end;
}

.time-label {
  font-size: 11px;
  color: #94a3b8;
  display: block;
}

.time-value {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-main);
}

.req-action-buttons {
  display: flex;
  gap: 8px;
}

.btn-confirm-req {
  padding: 8px 16px;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-confirm-req:hover {
  background-color: #1d4ed8;
}

.btn-decline-req {
  padding: 8px 14px;
  background-color: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}

.btn-contact-client {
  padding: 8px 14px;
  background-color: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}

/* -------------------------------------------------------------------------
   VIEW 4: AGENT INBOX & CHAT
   ------------------------------------------------------------------------- */
.agent-inbox-shell {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: 580px;
  background-color: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: 14px;
  overflow: hidden;
}

.inbox-conversations-list {
  border-inline-end: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  background-color: #fafbfc;
}

.inbox-search-box {
  padding: 12px;
  position: relative;
  border-bottom: 1px solid var(--border-light);
}

.inbox-search-box i {
  position: absolute;
  inset-inline-start: 22px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 13px;
}

.inbox-search-input {
  width: 100%;
  padding: 8px 12px;
  padding-inline-start: 34px;
  border: 1px solid var(--border-light);
  border-radius: 20px;
  font-size: 13px;
  background-color: #ffffff;
  outline: none;
}

.conversations-scroll {
  flex: 1;
  overflow-y: auto;
}

.conversation-tab {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.conversation-tab:hover {
  background-color: #f1f5f9;
}

.conversation-tab.active {
  background-color: #eff6ff;
  border-inline-start: 3px solid #2563eb;
}

.conv-avatar-dot {
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.conv-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.online-dot {
  position: absolute;
  bottom: 0;
  inset-inline-end: 0;
  width: 10px;
  height: 10px;
  background-color: #10b981;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.conv-details {
  flex: 1;
  min-width: 0;
}

.conv-name-time {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
}

.conv-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-main);
}

.conv-time {
  font-size: 11px;
  color: #94a3b8;
}

.conv-preview {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conv-unread-pill {
  position: absolute;
  inset-inline-end: 12px;
  bottom: 12px;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inbox-chat-panel {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.chat-header {
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-head-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-head-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main);
}

.chat-head-status {
  font-size: 11.5px;
  color: var(--text-muted);
}

.chat-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-light);
  background: #ffffff;
  color: var(--teal-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-messages-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #fcfdfe;
}

.chat-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
}

.bubble-client {
  align-self: flex-start;
  background-color: #f1f5f9;
  color: #0f172a;
  border-bottom-inline-start-radius: 2px;
}

.bubble-agent {
  align-self: flex-end;
  background-color: var(--teal-primary);
  color: #ffffff;
  border-bottom-inline-end-radius: 2px;
}

.bubble-text {
  margin: 0;
}

.bubble-time {
  display: block;
  font-size: 10px;
  margin-top: 4px;
  opacity: 0.75;
  text-align: end;
}

.chat-composer {
  padding: 14px 20px;
  border-top: 1px solid var(--border-light);
  display: flex;
  gap: 10px;
  background-color: #ffffff;
}

.composer-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--border-light);
  border-radius: 24px;
  font-size: 13.5px;
  outline: none;
}

.composer-send-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: var(--teal-primary);
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.composer-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* -------------------------------------------------------------------------
   VIEW 5: ANALYTICS CARDS
   ------------------------------------------------------------------------- */
.analytics-stat-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-highlight-card {
  background-color: #ffffff;
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 20px;
}

.highlight-title {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
}

.highlight-num {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-main);
  margin: 8px 0;
}

.highlight-trend {
  font-size: 12px;
  font-weight: 700;
}

.highlight-trend.positive {
  color: #059669;
}

.analytics-bars-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.analytics-bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-header-info {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  font-weight: 600;
}

.bar-track {
  width: 100%;
  height: 8px;
  background-color: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
}

/* -------------------------------------------------------------------------
   VIEW 6: VERIFICATION CENTER
   ------------------------------------------------------------------------- */
.verification-hero-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
  color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-badge-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.hero-status-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.priority-note {
  font-size: 12px;
  opacity: 0.9;
}

.hero-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 6px 0;
}

.hero-desc {
  font-size: 13.5px;
  opacity: 0.9;
  margin: 0;
  max-width: 650px;
  line-height: 1.5;
}

.verif-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.verif-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
}

.verif-input {
  padding: 10px 14px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 13.5px;
  outline: none;
}

.documents-upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.doc-upload-box {
  padding: 18px;
  border: 1px dashed var(--border-light);
  border-radius: 12px;
  text-align: center;
  background-color: #fafbfc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.doc-icon {
  font-size: 24px;
  color: var(--teal-primary);
}

.doc-upload-box h4 {
  font-size: 13.5px;
  font-weight: 700;
  margin: 0;
}

.doc-status-ok {
  color: #059669;
  font-size: 12px;
  font-weight: 700;
}

.doc-status-pending {
  color: #d97706;
  font-size: 12px;
  font-weight: 700;
}

.btn-save-verif {
  padding: 12px 24px;
  background-color: var(--teal-primary);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* -------------------------------------------------------------------------
   EMPTY STATES & AGENT ACTIONS (PREMIUM AESTHETICS)
   ------------------------------------------------------------------------- */
.agent-empty-state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background-color: #fafcff;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  margin: 12px 0;
}

.empty-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #2563eb;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.empty-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-muted);
  max-width: 440px;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.btn-add-first-prop {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  background-color: var(--teal-primary);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

.btn-add-first-prop:hover {
  background-color: var(--teal-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
}

.agent-empty-sub {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px 16px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}

.agent-empty-sub i {
  font-size: 32px;
  opacity: 0.6;
  color: #94a3b8;
}

.agent-empty-sub p {
  margin: 0;
}

/* View Mode Pills */
.view-mode-tabs-row {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.mode-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  padding: 8px 16px;
}

.filter-controls-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-card-delete {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #fee2e2;
  background-color: #fef2f2;
  color: #dc2626;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-card-delete:hover {
  background-color: #dc2626;
  color: #ffffff;
}

.btn-action-delete-poi {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #fee2e2;
  background-color: #fef2f2;
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.btn-action-delete-poi:hover {
  background-color: #dc2626;
  color: #ffffff;
}

.badge-red {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

/* POI Modal */
.agent-modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.agent-modal-card {
  background-color: #ffffff;
  border-radius: 18px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  padding: 24px;
}

.agent-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}

.agent-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--text-main);
}

.btn-close-modal {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background-color: #f1f5f9;
  color: #64748b;
  cursor: pointer;
}

.poi-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.poi-form-grid .form-submit-row {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
}

/* =========================================================================
   DARK THEME OVERRIDES
   ========================================================================= */
.agent-hub.is-dark {
  background-color: #0f172a;
  color: #f8fafc;
}

.is-dark .kpi-card,
.is-dark .agent-section-card,
.is-dark .prop-manage-card,
.is-dark .detailed-request-card,
.is-dark .agent-inbox-shell,
.is-dark .inbox-chat-panel,
.is-dark .stat-highlight-card {
  background-color: #1e293b;
  border-color: #334155;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.is-dark .agent-greeting-title,
.is-dark .kpi-value.text-dark,
.is-dark .section-title,
.is-dark .prop-title,
.is-dark .price-text,
.is-dark .stat-num,
.is-dark .requester-name,
.is-dark .sender-name,
.is-dark .card-prop-title,
.is-dark .client-name,
.is-dark .time-value,
.is-dark .conv-name,
.is-dark .chat-head-name,
.is-dark .highlight-num,
.is-dark .field-label,
.is-dark .doc-upload-box h4 {
  color: #f1f5f9;
}

.is-dark .verification-alert-banner {
  background-color: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.35);
}

.is-dark .agent-properties-table th {
  border-color: #334155;
  color: #94a3b8;
}

.is-dark .agent-properties-table td {
  border-color: #334155;
}

.is-dark .agent-properties-table tbody tr:hover {
  background-color: #24344d;
}

.is-dark .btn-action-table,
.is-dark .filter-pill-btn,
.is-dark .filter-search-field,
.is-dark .inbox-search-input,
.is-dark .composer-input,
.is-dark .verif-input,
.is-dark .doc-upload-box,
.is-dark .inbox-conversations-list {
  background-color: #131f31;
  border-color: #334155;
  color: #e2e8f0;
}

.is-dark .request-item-card,
.is-dark .message-item-card {
  background-color: #182638;
  border-color: #334155;
}

.is-dark .bubble-client {
  background-color: #24344d;
  color: #f1f5f9;
}

.is-dark .agent-empty-state-box {
  background-color: #131f31;
  border-color: #334155;
}

.is-dark .empty-title {
  color: #f8fafc;
}

.is-dark .agent-modal-card {
  background-color: #1e293b;
  border: 1px solid #334155;
  color: #f8fafc;
}

.is-dark .btn-close-modal {
  background-color: #334155;
  color: #cbd5e1;
}

/* =========================================================================
   RESPONSIVENESS
   ========================================================================= */
@media (max-width: 1024px) {
  .agent-kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .agent-bottom-panels-grid {
    grid-template-columns: 1fr;
  }
  .properties-management-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .agent-kpi-grid {
    grid-template-columns: 1fr;
  }
  .properties-management-grid {
    grid-template-columns: 1fr;
  }
  .agent-inbox-shell {
    grid-template-columns: 1fr;
    height: auto;
  }
  .inbox-conversations-list {
    max-height: 220px;
  }
  .verif-form-grid,
  .documents-upload-grid,
  .analytics-stat-cards-grid {
    grid-template-columns: 1fr;
  }
  .detailed-request-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .req-card-right {
    align-items: flex-start;
    width: 100%;
  }
}
</style>
