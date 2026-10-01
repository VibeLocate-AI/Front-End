<template>
  <div class="admin-shell" :dir="isRtl ? 'rtl' : 'ltr'" :data-theme="theme" :class="{ 'light-theme': !isDark }">
    
    <!-- Mobile Sidebar Backdrop Overlay -->
    <div 
      v-if="mobileSidebarOpen" 
      class="admin-sidebar-backdrop" 
      @click="mobileSidebarOpen = false"
    ></div>

    <!-- =========================================================================
         RIGHT SIDEBAR: EXACT MATCH TO USER IMAGE (VibeLocate Admin)
         ========================================================================= -->
    <aside class="admin-sidebar" :class="{ 'mobile-open': mobileSidebarOpen }">
      <div class="admin-brand-header">
        <div class="brand-title-wrap">
          <span class="brand-white">VibeLocate</span>
          <span class="brand-cyan">Admin</span>
        </div>
        <div class="brand-header-actions">
          <span class="admin-badge-live">LIVE</span>
          <button class="admin-mobile-close-btn" @click="mobileSidebarOpen = false" aria-label="Close sidebar">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <nav class="admin-nav-menu">
        <button 
          v-for="item in navMenuItems" 
          :key="item.key"
          class="admin-nav-item"
          :class="{ active: activeSection === item.key }"
          @click="activeSection = item.key; mobileSidebarOpen = false"
        >
          <span class="nav-dot">•</span>
          <span class="nav-label">{{ isRtl ? item.labelAr : item.labelEn }}</span>
          <span v-if="item.badgeCount" class="nav-count-badge">{{ item.badgeCount }}</span>
        </button>
      </nav>

      <div class="admin-sidebar-footer">
        <div class="admin-user-pill">
          <div class="admin-avatar">A</div>
          <div class="admin-user-meta">
            <span class="admin-email">admin@vibelocate.ai</span>
            <span class="admin-role">{{ isRtl ? 'مدير النظام' : 'System Admin' }}</span>
          </div>
        </div>

        <!-- Sidebar Quick Toggles (Theme & Lang) -->
        <div class="sidebar-ctrls-row">
          <button class="sidebar-ctrl-btn" @click="toggleTheme" :title="isDark ? (isRtl ? 'الوضع النهاري' : 'Light Mode') : (isRtl ? 'الوضع الليلي' : 'Dark Mode')">
            <i class="fa-solid" :class="isDark ? 'fa-sun text-amber' : 'fa-moon text-cyan'"></i>
            <span>{{ isDark ? (isRtl ? 'نهاري' : 'Light') : (isRtl ? 'ليلي' : 'Dark') }}</span>
          </button>
          <button class="sidebar-ctrl-btn" @click="toggleLanguage" :title="isRtl ? 'Switch to English' : 'التحويل إلى العربية'">
            <i class="fa-solid fa-globe text-cyan"></i>
            <span>{{ isRtl ? 'English' : 'العربية' }}</span>
          </button>
        </div>

        <div class="footer-action-links">
          <button class="btn-return-site" @click="router.push('/home')">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
            <span>{{ isRtl ? 'الموقع العام' : 'Public Site' }}</span>
          </button>
          <button class="btn-admin-logout" @click="handleAdminLogout" title="تسجيل الخروج">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- =========================================================================
         MAIN CONTENT AREA
         ========================================================================= -->
    <main class="admin-main-viewport">
      
      <!-- Top Action & Search Header -->
      <header class="admin-top-bar">
        <div class="top-bar-left-group">
          <!-- Mobile Sidebar Toggle Button -->
          <button 
            class="admin-mobile-toggle" 
            type="button" 
            @click="mobileSidebarOpen = !mobileSidebarOpen" 
            :title="isRtl ? 'فتح القائمة الجانبية' : 'Toggle Admin Sidebar'"
            aria-label="Toggle admin sidebar"
          >
            <i class="fa-solid" :class="mobileSidebarOpen ? 'fa-xmark' : 'fa-bars-staggered'"></i>
            <span class="admin-toggle-text">{{ isRtl ? 'القائمة' : 'Menu' }}</span>
          </button>

          <div class="header-titles">
            <h1 class="page-title">{{ currentSectionTitle }}</h1>
            <p class="page-timestamp">
              {{ isRtl ? 'آخر تحديث:' : 'Last updated:' }} {{ lastUpdatedTime }}
              <button class="btn-refresh-data" @click="loadAllAdminData" :title="isRtl ? 'تحديث البيانات' : 'Refresh Data'">
                <i class="fa-solid fa-rotate" :class="{ 'fa-spin': isRefreshing }"></i>
              </button>
            </p>
          </div>
        </div>

        <div class="top-actions-group">
          <div class="admin-search-wrap">
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="isRtl ? 'ابحث... ابحث عن مستخدم أو عقار...' : 'Search... find user or property...'"
              class="admin-search-input"
              @keydown.enter="handleSearch"
            >
            <button class="btn-search-exec" @click="handleSearch">
              <i class="fa-solid fa-magnifying-glass"></i>
              <span>{{ isRtl ? 'بحث' : 'Search' }}</span>
            </button>
          </div>

          <!-- Quick Theme & Language Buttons in Top Bar -->
          <div class="admin-quick-controls">
            <button 
              class="admin-ctrl-btn" 
              @click="toggleTheme" 
              :title="isDark ? (isRtl ? 'التبديل إلى الوضع النهاري' : 'Switch to Light Mode') : (isRtl ? 'التبديل إلى الوضع الليلي' : 'Switch to Dark Mode')"
            >
              <i class="fa-solid" :class="isDark ? 'fa-sun text-amber' : 'fa-moon text-cyan'"></i>
              <span>{{ isDark ? (isRtl ? 'نهاري' : 'Light') : (isRtl ? 'ليلي' : 'Dark') }}</span>
            </button>

            <button 
              class="admin-ctrl-btn" 
              @click="toggleLanguage" 
              :title="isRtl ? 'Switch to English' : 'التحويل إلى العربية'"
            >
              <i class="fa-solid fa-globe text-cyan"></i>
              <span>{{ isRtl ? 'English' : 'العربية' }}</span>
            </button>
          </div>
        </div>
      </header>

      <!-- =========================================================================
           VIEW 1: OVERVIEW DASHBOARD (نظرة عامة) - EXACT MATCH TO IMAGE
           ========================================================================= -->
      <div v-if="activeSection === 'overview'" class="admin-view-content fade-in">
        
        <!-- 4 Top KPI Cards Grid -->
        <section class="admin-kpi-row">
          <!-- KPI 1: إجمالي المستخدمين -->
          <div class="admin-kpi-card clickable" @click="activeSection = 'users'">
            <span class="kpi-title">{{ isRtl ? 'إجمالي المستخدمين' : 'Total Users' }}</span>
            <div class="kpi-metric-number">[{{ stats.totalUsers }}]</div>
            <span class="kpi-subtext"><i class="fa-solid fa-users"></i> {{ isRtl ? 'حسابات مسجلة' : 'Registered Accounts' }}</span>
          </div>

          <!-- KPI 2: الوسطاء النشطون -->
          <div class="admin-kpi-card clickable" @click="activeSection = 'users'; userRoleFilter = 'agent'">
            <span class="kpi-title">{{ isRtl ? 'الوسطاء النشطون' : 'Active Brokers' }}</span>
            <div class="kpi-metric-number text-cyan">[{{ stats.activeAgents }}]</div>
            <span class="kpi-subtext"><i class="fa-solid fa-briefcase"></i> {{ isRtl ? 'وسطاء معتمدون' : 'Verified Brokers' }}</span>
          </div>

          <!-- KPI 3: العقارات المدرجة -->
          <div class="admin-kpi-card clickable" @click="activeSection = 'properties'">
            <span class="kpi-title">{{ isRtl ? 'العقارات المدرجة' : 'Listed Properties' }}</span>
            <div class="kpi-metric-number">[{{ stats.totalProperties }}]</div>
            <span class="kpi-subtext"><i class="fa-regular fa-building"></i> {{ isRtl ? 'عقارات نشطة' : 'Active Listings' }}</span>
          </div>

          <!-- KPI 4: عمليات بحث اليوم -->
          <div class="admin-kpi-card clickable" @click="activeSection = 'ai_health'">
            <span class="kpi-title">{{ isRtl ? 'عمليات بحث اليوم' : 'Daily Searches' }}</span>
            <div class="kpi-metric-number text-green">[{{ stats.todaySearches }}]</div>
            <span class="kpi-subtext"><i class="fa-solid fa-bolt"></i> {{ isRtl ? 'استعلام بالذكاء الاصطناعي' : 'AI Queries Today' }}</span>
          </div>
        </section>

        <!-- Middle Row: Left Vibe Coverage / Right AI Health -->
        <section class="admin-middle-grid mt-4">
          
          <!-- Left Card: تغطية بيانات Vibe Report حسب المنطقة -->
          <div class="admin-glass-panel panel-vibe-coverage">
            <div class="panel-header-line">
              <h2 class="panel-title">{{ isRtl ? 'تغطية بيانات Vibe Report حسب المنطقة' : 'Vibe Report Data Coverage by Area' }}</h2>
            </div>

            <div class="coverage-bars-list">
              <div v-for="area in coverageAreasList" :key="area.id" class="coverage-bar-row">
                <span class="coverage-status-tag" :class="area.status === 'sufficient' ? 'tag-green' : 'tag-orange'">
                  {{ area.status === 'sufficient' ? (isRtl ? 'كافية' : 'Sufficient') : (isRtl ? 'ناقصة' : 'Needs POIs') }}
                </span>
                
                <div class="progress-track">
                  <div 
                    class="progress-fill" 
                    :class="area.status === 'sufficient' ? 'fill-green' : 'fill-orange'"
                    :style="{ width: area.percentage + '%' }"
                  ></div>
                </div>

                <span class="area-name-label">[{{ area.name }}]</span>
              </div>
            </div>

            <div class="coverage-footer-link">
              <button class="btn-link-chevron" @click="activeSection = 'coverage'">
                <i class="fa-solid fa-angles-right" :class="{ 'fa-flip-horizontal': isRtl }"></i>
                <span>{{ isRtl ? 'عرض كل المناطق' : 'View all areas' }}</span>
              </button>
            </div>
          </div>

          <!-- Right Card: صحة خدمة الذكاء الاصطناعي -->
          <div class="admin-glass-panel panel-ai-health">
            <div class="panel-header-line space-between">
              <h2 class="panel-title">{{ isRtl ? 'صحة خدمة الذكاء الاصطناعي' : 'AI Service Health' }}</h2>
              <div class="ai-status-indicator">
                <span class="status-pulse-dot" :class="{ 'is-ok': aiHealth.status === 'normal' }"></span>
                <span class="status-text">{{ aiHealth.statusText }}</span>
              </div>
            </div>

            <!-- 4 Mini Metrics Inside AI Card -->
            <div class="ai-mini-stats-grid">
              <div class="ai-mini-stat-card">
                <span class="ai-dot-indicator"></span>
                <div class="ai-mini-content">
                  <span class="ai-stat-lbl">{{ isRtl ? 'نسبة نجاح الفهم' : 'Success Rate' }}</span>
                  <strong class="ai-stat-val">[{{ aiHealth.successRate }}%]</strong>
                </div>
              </div>

              <div class="ai-mini-stat-card">
                <span class="ai-dot-indicator"></span>
                <div class="ai-mini-content">
                  <span class="ai-stat-lbl">{{ isRtl ? 'متوسط زمن الرد' : 'Avg Latency' }}</span>
                  <strong class="ai-stat-val">[{{ aiHealth.avgLatency }}] {{ isRtl ? 'ثانية' : 's' }}</strong>
                </div>
              </div>

              <div class="ai-mini-stat-card">
                <span class="ai-dot-indicator"></span>
                <div class="ai-mini-content">
                  <span class="ai-stat-lbl">{{ isRtl ? 'طلبات بحاجة لتوضيح' : 'Needs Clarification' }}</span>
                  <span class="ai-stat-code">(NEEDS_CLARIFICATION)</span>
                  <strong class="ai-stat-val">[{{ aiHealth.needsClarification }}]</strong>
                </div>
              </div>

              <div class="ai-mini-stat-card">
                <span class="ai-dot-indicator"></span>
                <div class="ai-mini-content">
                  <span class="ai-stat-lbl">{{ isRtl ? 'مرات تفعيل النموذج الاحتياطي' : 'Fallback Triggers' }}</span>
                  <strong class="ai-stat-val">[{{ aiHealth.fallbackTriggers }}]</strong>
                </div>
              </div>
            </div>

            <!-- Glowing SVG Wave Response Latency Chart -->
            <div class="ai-chart-section">
              <span class="chart-caption">{{ isRtl ? 'زمن الاستجابة خلال آخر 24 ساعة' : 'Response time over the last 24 hours' }}</span>
              <div class="svg-wave-container">
                <svg viewBox="0 0 500 120" preserveAspectRatio="none" class="ai-wave-svg">
                  <defs>
                    <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.65" />
                      <stop offset="60%" stop-color="#0284c7" stop-opacity="0.2" />
                      <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
                    </linearGradient>
                  </defs>
                  <!-- Background Glow Area -->
                  <path 
                    d="M 0,90 Q 70,60 140,85 T 280,45 T 400,25 T 500,60 L 500,120 L 0,120 Z" 
                    fill="url(#aiGradient)"
                  />
                  <!-- Bright Top Glowing Line -->
                  <path 
                    d="M 0,90 Q 70,60 140,85 T 280,45 T 400,25 T 500,60" 
                    fill="none" 
                    stroke="#22d3ee" 
                    stroke-width="3"
                    class="glowing-line"
                  />
                </svg>

                <div class="chart-timeline-ticks">
                  <span>03:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>15:00</span>
                  <span>18:00</span>
                  <span>20:00</span>
                  <span>24:00</span>
                  <span>23:00</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- Lower Section 1: قائمة انتظار مراجعة العقارات -->
        <section class="admin-glass-panel panel-table-section mt-4">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'قائمة انتظار مراجعة العقارات' : 'Pending Property Reviews' }}</h2>
            <button class="btn-link-chevron" @click="activeSection = 'properties'">
              <span>{{ isRtl ? 'عرض الكل' : 'View All' }}</span>
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>

          <div class="admin-table-responsive mt-3">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>{{ isRtl ? 'العقار' : 'Property' }}</th>
                  <th>{{ isRtl ? 'النوع' : 'Type' }}</th>
                  <th>{{ isRtl ? 'الوسيط' : 'Agent' }}</th>
                  <th>{{ isRtl ? 'تاريخ الإرسال' : 'Submission Date' }}</th>
                  <th>{{ isRtl ? 'إجراء' : 'Action' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prop in pendingPropertiesList.slice(0, 4)" :key="prop.id">
                  <td>
                    <strong>[{{ isRtl ? prop.titleAr || prop.title : prop.title }}]</strong>
                    <div class="prop-sub-loc">{{ prop.location }}</div>
                  </td>
                  <td>[{{ prop.type }}]</td>
                  <td>[{{ prop.agentName }}]</td>
                  <td>[{{ prop.dateStr }}]</td>
                  <td>
                    <div class="row-actions">
                      <button class="btn-table-action" @click="openPropertyModal(prop)">
                        {{ isRtl ? 'عرض' : 'View' }}
                      </button>
                      <button class="btn-table-action btn-approve" @click="approveProperty(prop.id)">
                        {{ isRtl ? 'اعتماد' : 'Approve' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Lower Section 2: شكاوى وتدقيقات حديثة -->
        <section class="admin-glass-panel panel-reports-section mt-4">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'شكاوى وتدقيقات حديثة' : 'Recent Complaints & Incident Audits' }}</h2>
            <button class="btn-link-chevron" @click="activeSection = 'reports'">
              <span>{{ isRtl ? 'عرض الكل' : 'View All' }}</span>
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>

          <div v-if="recentReportsList.length > 0" class="recent-reports-items">
            <div 
              v-for="rep in recentReportsList" 
              :key="rep.id"
              class="report-strip-item clickable"
              @click="openReportModal(rep)"
            >
              <div class="report-strip-left">
                <span class="dot-indicator" :class="rep.status === 'open' ? 'dot-red' : 'dot-amber'"></span>
                <span class="report-subject-text">[{{ rep.subject }}]</span>
                <span class="report-meta-tag">{{ rep.reporterName }}</span>
              </div>
              <div class="report-strip-right">
                <span class="report-time">[{{ rep.dateStr }}]</span>
                <button class="btn-strip-view">{{ isRtl ? 'معالجة' : 'Handle' }}</button>
              </div>
            </div>
          </div>

          <div v-else class="admin-empty-clean">
            <i class="fa-regular fa-bell-slash"></i>
            <p>{{ isRtl ? 'لا توجد شكاوى أو بلاغات مفتوحة حالياً' : 'No open complaints or reports at the moment' }}</p>
          </div>
        </section>

      </div>

      <!-- =========================================================================
           VIEW 2: USERS MANAGEMENT (إدارة المستخدمين)
           ========================================================================= -->
      <div v-else-if="activeSection === 'users'" class="admin-view-content fade-in">
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between flex-wrap gap-3">
            <div>
              <h2 class="panel-title">{{ isRtl ? 'إدارة المستخدمين وحسابات المنصة' : 'Users Management' }} ({{ filteredUsersList.length }})</h2>
              <p class="section-subtext">{{ isRtl ? 'التحكم بالحسابات والوسطاء والأذونات وحظر الحسابات المخالفة' : 'Manage accounts, brokers, permissions and active statuses' }}</p>
            </div>
            
            <!-- Filter Pills: (الكل، مستخدمون، وسطاء، محظورون) -->
            <div class="user-filter-pills">
              <button 
                v-for="filter in userFilterOptions" 
                :key="filter.key"
                class="filter-pill-btn"
                :class="{ active: userRoleFilter === filter.key }"
                @click="userRoleFilter = filter.key; currentPageUsers = 1"
              >
                {{ isRtl ? filter.labelAr : filter.labelEn }}
                <span class="pill-count" v-if="filter.count !== undefined">({{ filter.count }})</span>
              </button>
            </div>
          </div>

          <!-- User Search Bar -->
          <div class="panel-search-bar mt-3">
            <div class="admin-subsearch-input-wrap">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input 
                type="text" 
                v-model="userSearchTerm" 
                :placeholder="isRtl ? 'تصفية بالاسم، البريد الإلكتروني، أو رقم الهاتف...' : 'Filter by name, email, or phone...'"
                class="admin-subsearch-input"
              >
              <button v-if="userSearchTerm" class="btn-clear-input" @click="userSearchTerm = ''">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <!-- Users Table -->
          <div class="admin-table-responsive mt-3">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ isRtl ? 'اسم المستخدم والبريد الإلكتروني' : 'User Name & Email' }}</th>
                  <th>{{ isRtl ? 'نوع الحساب' : 'Account Type' }}</th>
                  <th>{{ isRtl ? 'تاريخ الانضمام' : 'Joined Date' }}</th>
                  <th>{{ isRtl ? 'حالة الحساب' : 'Status' }}</th>
                  <th>{{ isRtl ? 'أزرار الإجراءات السريعة' : 'Quick Actions' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in paginatedUsersList" :key="u.id">
                  <td>{{ u.id }}</td>
                  <td>
                    <div class="user-cell-meta">
                      <div class="user-cell-avatar">
                        <img v-if="u.avatar" :src="u.avatar" alt="Avatar">
                        <span v-else>{{ (u.name || u.first_name || 'U').charAt(0).toUpperCase() }}</span>
                      </div>
                      <div>
                        <strong>{{ u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'User' }}</strong>
                        <div class="user-cell-email">{{ u.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="role-badge" :class="`role-${u.role_slug || u.role}`">
                      <i class="fa-solid" :class="(u.role_slug || u.role) === 'agent' ? 'fa-briefcase' : (u.role_slug || u.role) === 'super-admin' || (u.role_slug || u.role) === 'admin' ? 'fa-shield-halved' : 'fa-user'"></i>
                      {{ formatRoleName(u.role_slug || u.role) }}
                    </span>
                  </td>
                  <td>{{ u.joined_date || u.created_at ? formatDate(u.joined_date || u.created_at) : '2026-09-15' }}</td>
                  <td>
                    <span class="status-pill" :class="u.status === 'active' ? 'pill-active' : 'pill-inactive'">
                      <span class="status-dot"></span>
                      {{ u.status === 'active' ? (isRtl ? 'نشط' : 'Active') : (isRtl ? 'محظور' : 'Suspended') }}
                    </span>
                  </td>
                  <td>
                    <div class="row-actions">
                      <button class="btn-table-action" @click="openUserModal(u, 'view')" title="عرض البيانات">
                        <i class="fa-regular fa-eye"></i> {{ isRtl ? 'عرض' : 'View' }}
                      </button>
                      <button class="btn-table-action" @click="openUserModal(u, 'edit')" title="تعديل">
                        <i class="fa-regular fa-pen-to-square"></i> {{ isRtl ? 'تعديل' : 'Edit' }}
                      </button>
                      <button 
                        class="btn-table-action" 
                        :class="u.status === 'active' ? 'btn-warn' : 'btn-success'"
                        @click="toggleUserStatus(u)"
                      >
                        <i class="fa-solid" :class="u.status === 'active' ? 'fa-ban' : 'fa-check'"></i>
                        {{ u.status === 'active' ? (isRtl ? 'حظر' : 'Block') : (isRtl ? 'فك الحظر' : 'Unblock') }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="admin-pagination-bar mt-4">
            <span class="pagination-info">
              {{ isRtl ? 'عرض' : 'Showing' }} {{ usersPaginationRange }} {{ isRtl ? 'من إجمالي' : 'of' }} {{ filteredUsersList.length }} {{ isRtl ? 'مستخدم' : 'users' }}
            </span>
            <div class="pagination-buttons">
              <button 
                class="btn-page-nav" 
                :disabled="currentPageUsers <= 1"
                @click="currentPageUsers--"
              >
                <i class="fa-solid" :class="isRtl ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
                <span>{{ isRtl ? 'السابق' : 'Prev' }}</span>
              </button>

              <button 
                v-for="p in totalUserPages" 
                :key="p"
                class="btn-page-num"
                :class="{ active: currentPageUsers === p }"
                @click="currentPageUsers = p"
              >
                {{ p }}
              </button>

              <button 
                class="btn-page-nav" 
                :disabled="currentPageUsers >= totalUserPages"
                @click="currentPageUsers++"
              >
                <span>{{ isRtl ? 'التالي' : 'Next' }}</span>
                <i class="fa-solid" :class="isRtl ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- =========================================================================
           VIEW 3: AI HEALTH & DIAGNOSTIC CONSOLE (صحة خدمة الذكاء الاصطناعي)
           ========================================================================= -->
      <div v-else-if="activeSection === 'ai_health'" class="admin-view-content fade-in">
        
        <!-- Model Status Monitoring -->
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between">
            <div>
              <h2 class="panel-title">{{ isRtl ? 'صحة خدمة الذكاء الاصطناعي وتشخيص النماذج' : 'AI Health & Diagnostic Console' }}</h2>
              <p class="section-subtext">{{ isRtl ? 'لوحة تشخيصية متقدمة لمراقبة الخوادم والنماذج الأساسية والاحتياطية' : 'Advanced telemetry monitoring model latency, fallbacks & status' }}</p>
            </div>
            <div class="ai-status-indicator">
              <span class="status-pulse-dot" :class="{ 'is-ok': aiHealth.status === 'normal' }"></span>
              <span class="status-text">{{ aiHealth.statusText }}</span>
            </div>
          </div>

          <!-- Models Status Grid -->
          <div class="models-status-grid mt-4">
            <div class="model-status-card primary">
              <div class="model-card-head">
                <span class="model-badge-primary">{{ isRtl ? 'الموديل الأساسي' : 'Primary Model' }}</span>
                <span class="status-live-tag"><i class="fa-solid fa-circle-dot"></i> {{ isRtl ? 'نشط 99.8%' : 'Active 99.8%' }}</span>
              </div>
              <h3 class="model-name">DeepSeek-V3 / R1 (Contextual Real Estate)</h3>
              <p class="model-desc">{{ isRtl ? 'معالجة استعلامات لغة العقارات الطبيعية وفك شفرات الـ Vibe والتوافق' : 'Context-aware search parsing natural Arabic/English requests' }}</p>
              <div class="model-meta-stats">
                <span>{{ isRtl ? 'زمن الاستجابة:' : 'Latency:' }} <strong>0.75s</strong></span>
                <span>{{ isRtl ? 'معدل النجاح:' : 'Success:' }} <strong>98.6%</strong></span>
              </div>
            </div>

            <div class="model-status-card fallback">
              <div class="model-card-head">
                <span class="model-badge-fallback">{{ isRtl ? 'الموديل الاحتياطي' : 'Fallback Model' }}</span>
                <span class="status-standby-tag"><i class="fa-regular fa-clock"></i> {{ isRtl ? 'جاهز للاستدعاء' : 'Standby Hot' }}</span>
              </div>
              <h3 class="model-name">Llama-3.3-70B / Gemini-Flash</h3>
              <p class="model-desc">{{ isRtl ? 'يعمل تلقائياً عند حدوث ضغط غير متوقع أو انقطاع في خوادم الموديل الأساسي' : 'Automatic fallback activated if latency spikes or rate limits occur' }}</p>
              <div class="model-meta-stats">
                <span>{{ isRtl ? 'حالات الاستدعاء اليوم:' : 'Triggers Today:' }} <strong>{{ aiHealth.fallbackTriggers }}</strong></span>
                <span>{{ isRtl ? 'جاهزية الربط:' : 'Ready:' }} <strong>100%</strong></span>
              </div>
            </div>
          </div>

          <!-- 4 Operational Metrics Cards -->
          <div class="ai-detailed-grid mt-4">
            <div class="ai-metric-box">
              <span class="metric-title">{{ isRtl ? 'إجمالي الطلبات (Total Requests)' : 'Total Requests' }}</span>
              <div class="metric-val text-cyan">{{ (stats.todaySearches || 224).toLocaleString() }}</div>
              <span class="metric-sub">{{ isRtl ? 'خلال الـ 24 ساعة الماضية' : 'Past 24 hours' }}</span>
            </div>
            <div class="ai-metric-box">
              <span class="metric-title">{{ isRtl ? 'نسبة النجاح (Success Rate %)' : 'Success Rate %' }}</span>
              <div class="metric-val text-green">{{ aiHealth.successRate }}%</div>
              <span class="metric-sub">{{ isRtl ? 'استجابات سليمة بدون أخطاء' : 'Valid 200 responses' }}</span>
            </div>
            <div class="ai-metric-box">
              <span class="metric-title">{{ isRtl ? 'متوسط التأخير (Avg Latency)' : 'Avg Latency' }}</span>
              <div class="metric-val text-amber">{{ aiHealth.avgLatency }}s</div>
              <span class="metric-sub">{{ isRtl ? 'استجابة فائقة السرعة' : 'Ultra low response time' }}</span>
            </div>
            <div class="ai-metric-box">
              <span class="metric-title">{{ isRtl ? 'تفعيل النموذج الاحتياطي (Fallback)' : 'Fallback Triggers' }}</span>
              <div class="metric-val">{{ aiHealth.fallbackTriggers }}</div>
              <span class="metric-sub">{{ isRtl ? 'استدعاء الموديل الثانوي' : 'Fallback activations' }}</span>
            </div>
          </div>

          <!-- Outputs Breakdown & Endpoint Success Rates -->
          <div class="ai-breakdown-row mt-4">
            <!-- Output Statuses -->
            <div class="breakdown-card">
              <h4 class="breakdown-title">{{ isRtl ? 'توزيع حالات المخرجات' : 'Output Status Breakdown' }}</h4>
              <div class="status-bar-group mt-3">
                <div class="status-bar-item">
                  <div class="bar-lbl-row">
                    <span><i class="fa-solid fa-circle-check text-green"></i> success</span>
                    <strong>96.4%</strong>
                  </div>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-green" style="width: 96.4%"></div></div>
                </div>
                <div class="status-bar-item">
                  <div class="bar-lbl-row">
                    <span><i class="fa-solid fa-triangle-exclamation text-amber"></i> rate_limited</span>
                    <strong>1.8%</strong>
                  </div>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-amber" style="width: 1.8%"></div></div>
                </div>
                <div class="status-bar-item">
                  <div class="bar-lbl-row">
                    <span><i class="fa-solid fa-clock text-cyan"></i> timeout</span>
                    <strong>1.1%</strong>
                  </div>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-cyan" style="width: 1.1%"></div></div>
                </div>
                <div class="status-bar-item">
                  <div class="bar-lbl-row">
                    <span><i class="fa-solid fa-circle-question text-red"></i> no_choices</span>
                    <strong>0.7%</strong>
                  </div>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-red" style="width: 0.7%"></div></div>
                </div>
              </div>
            </div>

            <!-- Endpoint Success Rates -->
            <div class="breakdown-card">
              <h4 class="breakdown-title">{{ isRtl ? 'نسبة النجاح حسب الـ Endpoint' : 'Endpoint Success Rates' }}</h4>
              <div class="status-bar-group mt-3">
                <div class="status-bar-item">
                  <div class="bar-lbl-row">
                    <span><code>POST /api/ai-contextual</code></span>
                    <strong class="text-green">97.8%</strong>
                  </div>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-cyan" style="width: 97.8%"></div></div>
                </div>
                <div class="status-bar-item">
                  <div class="bar-lbl-row">
                    <span><code>POST /api/find-properties</code></span>
                    <strong class="text-green">98.2%</strong>
                  </div>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-green" style="width: 98.2%"></div></div>
                </div>
                <div class="status-bar-item">
                  <div class="bar-lbl-row">
                    <span><code>POST /api/reviews/analyze</code></span>
                    <strong class="text-green">94.5%</strong>
                  </div>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-amber" style="width: 94.5%"></div></div>
                </div>
                <div class="status-bar-item">
                  <div class="bar-lbl-row">
                    <span><code>POST /api/vibe-report/generate</code></span>
                    <strong class="text-green">95.1%</strong>
                  </div>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-cyan" style="width: 95.1%"></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Interactive AI Test Console -->
        <section class="admin-glass-panel mt-4">
          <div class="panel-header-line space-between">
            <div>
              <h2 class="panel-title">{{ isRtl ? 'منصة الاختبار السريع (Test Console)' : 'Interactive AI Test Console' }}</h2>
              <p class="section-subtext">{{ isRtl ? 'تجربة إرسال استعلامات ذكاء اصطناعي واختبار الاستجابة وشفرة JSON مباشرة' : 'Execute test prompt payloads to inspect latency and returned JSON structure' }}</p>
            </div>
            <span class="ai-console-badge"><i class="fa-solid fa-terminal"></i> SANDBOX</span>
          </div>

          <!-- Prompt Quick Chips -->
          <div class="prompt-chips-row mt-3">
            <span class="chips-title">{{ isRtl ? 'نماذج جاهزة للتجربة:' : 'Quick Prompts:' }}</span>
            <button 
              v-for="(chip, idx) in sampleTestPrompts" 
              :key="idx" 
              class="prompt-chip-btn"
              @click="testPromptInput = chip"
            >
              {{ chip }}
            </button>
          </div>

          <div class="test-console-form mt-3">
            <div class="console-input-wrap">
              <textarea 
                v-model="testPromptInput" 
                rows="2" 
                class="console-textarea"
                :placeholder="isRtl ? 'اكتب استعلام الذكاء الاصطناعي لاختبار النموذج هنا...' : 'Enter prompt to test model execution...'"
              ></textarea>
              <button 
                class="btn-run-test" 
                :disabled="isTestingAi || !testPromptInput.trim()"
                @click="executeAiTest"
              >
                <i class="fa-solid" :class="isTestingAi ? 'fa-spinner fa-spin' : 'fa-play'"></i>
                <span>{{ isTestingAi ? (isRtl ? 'جاري الفحص...' : 'Executing...') : (isRtl ? 'تشغيل الاختبار' : 'Run Test') }}</span>
              </button>
            </div>

            <!-- Test Result Display -->
            <div v-if="testResult" class="console-output-box mt-3 fade-in">
              <div class="output-header-bar">
                <div class="output-tags">
                  <span class="output-pill tag-status-200">STATUS {{ testResult.status }}</span>
                  <span class="output-pill tag-model">{{ testResult.model }}</span>
                  <span class="output-pill tag-latency"><i class="fa-solid fa-clock"></i> {{ testResult.latency }}s</span>
                </div>
                <button class="btn-copy-json" @click="copyTestResultJson">
                  <i class="fa-regular fa-copy"></i>
                  <span>{{ isCopiedJson ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ JSON' : 'Copy JSON') }}</span>
                </button>
              </div>
              <pre class="json-code-viewer"><code>{{ formattedTestJson }}</code></pre>
            </div>
          </div>
        </section>

        <!-- Recent Events Log -->
        <section class="admin-glass-panel mt-4">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'سجل الأحداث الحية (Recent Events Log)' : 'Live AI Events Log' }}</h2>
            <span class="live-pulse-badge"><span class="pulse-ring"></span> STREAMING</span>
          </div>

          <div class="admin-table-responsive mt-3">
            <table class="admin-data-table font-mono">
              <thead>
                <tr>
                  <th>{{ isRtl ? 'الوقت' : 'Timestamp' }}</th>
                  <th>{{ isRtl ? 'نقطة النهاية (Endpoint)' : 'Endpoint' }}</th>
                  <th>{{ isRtl ? 'الموديل المستخدم' : 'Model' }}</th>
                  <th>{{ isRtl ? 'التأخير (Latency)' : 'Latency' }}</th>
                  <th>{{ isRtl ? 'كود الحالة' : 'Status' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="evt in liveAiEventsList" :key="evt.id">
                  <td>{{ evt.time }}</td>
                  <td><code>{{ evt.endpoint }}</code></td>
                  <td><span class="model-tag-mini">{{ evt.model }}</span></td>
                  <td>{{ evt.latency }}s</td>
                  <td>
                    <span class="status-code-tag" :class="evt.status === 200 ? 'code-ok' : 'code-warn'">
                      {{ evt.status }} {{ evt.status === 200 ? 'OK' : 'RATE_LIMIT' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <!-- =========================================================================
           VIEW 4: VIBE REPORT COVERAGE (تغطية بيانات Vibe Report)
           ========================================================================= -->
      <div v-else-if="activeSection === 'coverage'" class="admin-view-content fade-in">
        
        <!-- Summary KPI Cards -->
        <section class="admin-kpi-row">
          <div class="admin-kpi-card">
            <span class="kpi-title">{{ isRtl ? 'إجمالي نقاط الاهتمام (POIs)' : 'Total POIs' }}</span>
            <div class="kpi-metric-number text-cyan">[12,480]</div>
            <span class="kpi-subtext">{{ isRtl ? 'أماكن ترفيه، مطاعم ومواصلات' : 'Cafes, transit & parks' }}</span>
          </div>

          <div class="admin-kpi-card">
            <span class="kpi-title">{{ isRtl ? 'المراجعات المولّدة (Reviews)' : 'Generated Reviews' }}</span>
            <div class="kpi-metric-number text-green">[4,820]</div>
            <span class="kpi-subtext">{{ isRtl ? 'ملخصات ذكاء اصطناعي معتمدة' : 'AI vibe syntheses' }}</span>
          </div>

          <div class="admin-kpi-card">
            <span class="kpi-title">{{ isRtl ? 'الأحياء ببيانات كافية' : 'Sufficient Data' }}</span>
            <div class="kpi-metric-number text-green">[28 {{ isRtl ? 'حي' : 'zones' }}]</div>
            <span class="kpi-subtext">{{ isRtl ? 'تغطية تتجاوز 75%' : 'Coverage above 75%' }}</span>
          </div>

          <div class="admin-kpi-card">
            <span class="kpi-title">{{ isRtl ? 'بحاجة لمراجعات أكثر' : 'Needs More Data' }}</span>
            <div class="kpi-metric-number text-amber">[7 {{ isRtl ? 'أحياء' : 'zones' }}]</div>
            <span class="kpi-subtext">{{ isRtl ? 'تتطلب تشغيل التوليد' : 'Requires AI harvest' }}</span>
          </div>
        </section>

        <!-- Neighborhoods Readiness Table -->
        <section class="admin-glass-panel mt-4">
          <div class="panel-header-line space-between">
            <div>
              <h2 class="panel-title">{{ isRtl ? 'جدول الأحياء والجاهزية (Neighborhoods Readiness Table)' : 'Neighborhoods Vibe Readiness' }}</h2>
              <p class="section-subtext">{{ isRtl ? 'متابعة نقاط الاهتمام، المراجعات المولدة، وإعادة توليد بيانات الأحياء بالـ AI' : 'Track POIs, generated reviews & re-trigger automated AI vibe synthesis' }}</p>
            </div>
            <button class="btn-admin-primary" @click="generateAllIncompleteReviews" :disabled="isBatchGenerating">
              <i class="fa-solid fa-wand-magic-sparkles" :class="{ 'fa-spin': isBatchGenerating }"></i>
              <span>{{ isBatchGenerating ? (isRtl ? 'جاري التوليد...' : 'Generating...') : (isRtl ? 'توليد كل الأحياء الناقصة' : 'Generate All Incomplete') }}</span>
            </button>
          </div>

          <div class="admin-table-responsive mt-3">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>{{ isRtl ? 'اسم الحي' : 'Neighborhood' }}</th>
                  <th>{{ isRtl ? 'نقاط الاهتمام (POIs)' : 'POIs Count' }}</th>
                  <th>{{ isRtl ? 'المراجعات المولّدة' : 'Reviews' }}</th>
                  <th>{{ isRtl ? 'تاريخ آخر تحديث' : 'Last Updated' }}</th>
                  <th>{{ isRtl ? 'حالة التغطية' : 'Status' }}</th>
                  <th>{{ isRtl ? 'زر الإجراء (Action)' : 'Actions' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="area in richNeighborhoodsList" :key="area.id">
                  <td>
                    <strong>{{ area.name }}</strong>
                    <div class="area-sub-slug">{{ area.slug }}</div>
                  </td>
                  <td><strong>{{ area.poisCount }}</strong> POIs</td>
                  <td>{{ area.reviewsCount }} {{ isRtl ? 'مراجعة' : 'reviews' }}</td>
                  <td>{{ area.lastUpdated }}</td>
                  <td>
                    <span class="coverage-status-tag" :class="area.status === 'sufficient' ? 'tag-green' : 'tag-orange'">
                      {{ area.status === 'sufficient' ? (isRtl ? 'كافية' : 'Sufficient') : (isRtl ? 'ناقصة' : 'Needs More Data') }}
                    </span>
                  </td>
                  <td>
                    <div class="row-actions">
                      <button class="btn-table-action" @click="openAreaDetailsModal(area)">
                        <i class="fa-regular fa-eye"></i> {{ isRtl ? 'عرض التفاصيل' : 'Details' }}
                      </button>
                      <button 
                        class="btn-table-action btn-success" 
                        :disabled="area.isGenerating"
                        @click="triggerNeighborhoodGeneration(area)"
                      >
                        <i class="fa-solid fa-wand-magic-sparkles" :class="{ 'fa-spin': area.isGenerating }"></i>
                        {{ area.isGenerating ? (isRtl ? 'جاري التوليد...' : 'Generating...') : (isRtl ? 'توليد مراجعات' : 'Generate Reviews') }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>

      <!-- =========================================================================
           VIEW 5: COMPLAINTS & REPORTS (الشكاوى والتبليغات)
           ========================================================================= -->
      <div v-else-if="activeSection === 'reports'" class="admin-view-content fade-in">
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between flex-wrap gap-3">
            <div>
              <h2 class="panel-title">{{ isRtl ? 'الشكاوى والتبليغات (Complaints & Reports Hub)' : 'Complaints & Incident Reports Hub' }}</h2>
              <p class="section-subtext">{{ isRtl ? 'إدارة النزاعات والبلاغات المرفوعة على العقارات أو الوسطاء أو الحسابات' : 'Resolve disputes, moderation reports on properties, brokers and users' }}</p>
            </div>

            <!-- Tab Filtering: (مفتوحة [العدد]، قيد المراجعة، مغلقة) -->
            <div class="reports-filter-tabs">
              <button 
                class="report-tab-btn" 
                :class="{ active: reportStatusFilter === 'open' }"
                @click="reportStatusFilter = 'open'"
              >
                <i class="fa-solid fa-envelope-open-text"></i>
                <span>{{ isRtl ? 'مفتوحة' : 'Open' }}</span>
                <span class="tab-count-badge badge-red">{{ openReportsCount }}</span>
              </button>

              <button 
                class="report-tab-btn" 
                :class="{ active: reportStatusFilter === 'reviewing' }"
                @click="reportStatusFilter = 'reviewing'"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
                <span>{{ isRtl ? 'قيد المراجعة' : 'Under Review' }}</span>
                <span class="tab-count-badge badge-amber">{{ reviewingReportsCount }}</span>
              </button>

              <button 
                class="report-tab-btn" 
                :class="{ active: reportStatusFilter === 'resolved' }"
                @click="reportStatusFilter = 'resolved'"
              >
                <i class="fa-solid fa-circle-check"></i>
                <span>{{ isRtl ? 'مغلقة / تم الحل' : 'Resolved' }}</span>
                <span class="tab-count-badge badge-green">{{ resolvedReportsCount }}</span>
              </button>
            </div>
          </div>

          <!-- Reports Table -->
          <div v-if="filteredReportsList.length > 0" class="admin-table-responsive mt-4">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ isRtl ? 'نوع البلاغ' : 'Type' }}</th>
                  <th>{{ isRtl ? 'مقدم الشكوى والطرف المشتكى عليه' : 'Complainant & Target' }}</th>
                  <th>{{ isRtl ? 'موجز الموضوع وتاريخ التقديم' : 'Subject & Date' }}</th>
                  <th>{{ isRtl ? 'حالة البلاغ' : 'Status' }}</th>
                  <th>{{ isRtl ? 'زر الإجراء' : 'Action' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rep in filteredReportsList" :key="rep.id">
                  <td>{{ rep.id }}</td>
                  <td>
                    <span class="report-type-chip" :class="`chip-${rep.type || 'property'}`">
                      <i class="fa-solid" :class="rep.type === 'agent' ? 'fa-briefcase' : rep.type === 'user' ? 'fa-user' : 'fa-building'"></i>
                      {{ rep.type === 'agent' ? (isRtl ? 'وسيط' : 'Agent') : rep.type === 'user' ? (isRtl ? 'مستخدم' : 'User') : (isRtl ? 'عقار' : 'Property') }}
                    </span>
                  </td>
                  <td>
                    <div class="parties-cell">
                      <span class="complainant-name"><i class="fa-regular fa-user"></i> {{ rep.reporterName }}</span>
                      <i class="fa-solid fa-arrow-left text-muted" :class="{ 'fa-flip-horizontal': !isRtl }"></i>
                      <strong class="target-name">{{ rep.targetName || (isRtl ? 'عقار مدرج' : 'Listed Property') }}</strong>
                    </div>
                  </td>
                  <td>
                    <strong>{{ rep.subject }}</strong>
                    <div class="rep-date-sub">{{ rep.dateStr }}</div>
                  </td>
                  <td>
                    <span class="status-pill" :class="rep.status === 'resolved' ? 'pill-active' : rep.status === 'reviewing' ? 'pill-warn' : 'pill-inactive'">
                      <span class="status-dot"></span>
                      {{ rep.status === 'resolved' ? (isRtl ? 'مغلقة' : 'Resolved') : rep.status === 'reviewing' ? (isRtl ? 'قيد المعالجة' : 'In Review') : (isRtl ? 'مفتوحة' : 'Open') }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-table-action btn-approve" @click="openReportModal(rep)">
                      <i class="fa-solid fa-gavel"></i>
                      <span>{{ isRtl ? 'معالجة البلاغ' : 'Handle Report' }}</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty-clean">
            <i class="fa-solid fa-shield-heart"></i>
            <p>{{ isRtl ? 'لا توجد بلاغات تطابق التصفية المحددة' : 'No incident reports in this status' }}</p>
          </div>
        </section>
      </div>

      <!-- =========================================================================
           VIEW 6: SYSTEM SETTINGS (إعدادات النظام)
           ========================================================================= -->
      <div v-else-if="activeSection === 'settings'" class="admin-view-content fade-in">
        
        <!-- Row 1: AI Vibe Metrics Summary & Quality Indicators -->
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between">
            <div>
              <h2 class="panel-title">{{ isRtl ? 'ملخص أداء الـ AI ومعايير الأحياء (Vibe Metrics)' : 'AI Vibe Metrics & Neighborhood Scoring' }}</h2>
              <p class="section-subtext">{{ isRtl ? 'متابعة دقة النموذج العام ومؤشرات جودة الحياة المعتمدة في تقارير Vibe Report' : 'Model accuracy & core livability index ratings across zones' }}</p>
            </div>
            <span class="accuracy-badge"><i class="fa-solid fa-chart-line"></i> {{ isRtl ? 'دقة النموذج: 95.4%' : 'Model Accuracy: 95.4%' }}</span>
          </div>

          <div class="vibe-metrics-cards-grid mt-4">
            <div class="vibe-metric-box">
              <span class="vibe-icon-wrap text-cyan"><i class="fa-solid fa-fire"></i></span>
              <span class="vibe-title">{{ isRtl ? 'مؤشر الحيوية (Lively)' : 'Lively Index' }}</span>
              <strong class="vibe-value">88%</strong>
              <div class="mini-bar-track"><div class="mini-bar-fill fill-cyan" style="width: 88%"></div></div>
            </div>

            <div class="vibe-metric-box">
              <span class="vibe-icon-wrap text-green"><i class="fa-solid fa-person-walking"></i></span>
              <span class="vibe-title">{{ isRtl ? 'سهولة المشي (Walkable)' : 'Walkable Score' }}</span>
              <strong class="vibe-value">92%</strong>
              <div class="mini-bar-track"><div class="mini-bar-fill fill-green" style="width: 92%"></div></div>
            </div>

            <div class="vibe-metric-box">
              <span class="vibe-icon-wrap text-amber"><i class="fa-solid fa-people-roof"></i></span>
              <span class="vibe-title">{{ isRtl ? 'الملائمة العائلية (Family)' : 'Family Friendly' }}</span>
              <strong class="vibe-value">85%</strong>
              <div class="mini-bar-track"><div class="mini-bar-fill fill-amber" style="width: 85%"></div></div>
            </div>

            <div class="vibe-metric-box">
              <span class="vibe-icon-wrap text-purple"><i class="fa-solid fa-moon"></i></span>
              <span class="vibe-title">{{ isRtl ? 'الحياة الليلية (Nightlife)' : 'Nightlife Pulse' }}</span>
              <strong class="vibe-value">78%</strong>
              <div class="mini-bar-track"><div class="mini-bar-fill fill-purple" style="width: 78%"></div></div>
            </div>
          </div>
        </section>

        <!-- Row 2: Basic System Settings & Security -->
        <div class="settings-two-columns mt-4">
          
          <!-- Basic System Settings -->
          <section class="admin-glass-panel">
            <div class="panel-header-line">
              <h2 class="panel-title">{{ isRtl ? 'الإعدادات الأساسية (Basic System Settings)' : 'Basic System Settings' }}</h2>
            </div>

            <div class="settings-form-list mt-3">
              <div class="setting-item-row">
                <div>
                  <label class="setting-lbl">{{ isRtl ? 'اللغة الافتراضية للنظام' : 'Default Platform Language' }}</label>
                  <p class="setting-hint">{{ isRtl ? 'لغة واجهة المستخدم الافتراضية للزوار والتقارير' : 'Fallback locale for users and generated PDF reports' }}</p>
                </div>
                <select v-model="systemSettings.defaultLang" class="admin-select">
                  <option value="ar">العربية (AR)</option>
                  <option value="en">English (EN)</option>
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                </select>
              </div>

              <div class="setting-item-row">
                <div>
                  <label class="setting-lbl">{{ isRtl ? 'المنطقة الزمنية (Timezone)' : 'System Timezone' }}</label>
                  <p class="setting-hint">{{ isRtl ? 'توقيت تسجيل التقارير وأوقات العمليات' : 'Timezone used in timestamps & audit logs' }}</p>
                </div>
                <select v-model="systemSettings.timezone" class="admin-select">
                  <option value="Asia/Dubai">Asia/Dubai (UTC+4 - الإمارات)</option>
                  <option value="Asia/Riyadh">Asia/Riyadh (UTC+3 - السعودية)</option>
                  <option value="Europe/London">Europe/London (UTC+0 - GMT)</option>
                  <option value="America/New_York">America/New_York (UTC-5 - EST)</option>
                </select>
              </div>
            </div>
          </section>

          <!-- System Security & Theme Personalization -->
          <section class="admin-glass-panel">
            <div class="panel-header-line">
              <h2 class="panel-title">{{ isRtl ? 'أمان النظام والمظهر' : 'Security & Appearance' }}</h2>
            </div>

            <div class="settings-form-list mt-3">
              <div class="setting-item-row">
                <div>
                  <label class="setting-lbl">{{ isRtl ? 'المصادقة الثنائية (2FA Security)' : 'System Security 2FA' }}</label>
                  <p class="setting-hint">{{ isRtl ? 'فرض التحقق بخطوتين لكافة حسابات المشرفين والوسطاء' : 'Enforce Two-Factor Authentication on admin accounts' }}</p>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="systemSettings.twoFactorRequired">
                  <span class="slider"></span>
                </label>
              </div>

              <div class="setting-item-row">
                <div>
                  <label class="setting-lbl">{{ isRtl ? 'المظهر الافتراضي (Personalization Theme)' : 'Admin Theme Mode' }}</label>
                  <p class="setting-hint">{{ isRtl ? 'نمط واجهة لوحة التحكم الإدارية' : 'Executive dark theme palette' }}</p>
                </div>
                <div class="theme-badge-current">
                  <i class="fa-solid fa-moon text-cyan"></i>
                  <span>{{ isRtl ? 'داكن سايبربانك (Dark Slate)' : 'Dark Slate Cyberpunk' }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Row 3: Interactive Cost Breakdown & External Data Sources -->
        <section class="admin-glass-panel mt-4">
          <div class="panel-header-line space-between">
            <div>
              <h2 class="panel-title">{{ isRtl ? 'تحليل التكاليف ومصادر البيانات' : 'Cost Breakdown & External Data Sources' }}</h2>
              <p class="section-subtext">{{ isRtl ? 'توزيع تكاليف الخوادم ونماذج الذكاء الاصطناعي ومصادر تغذية Vibe Coverage' : 'Monthly infrastructure spend & sync status of data providers' }}</p>
            </div>
            <span class="cost-total-badge">{{ isRtl ? 'إجمالي الشهر الحالي:' : 'Monthly Spend:' }} <strong>$294.50</strong></span>
          </div>

          <div class="cost-items-grid mt-4">
            <div class="cost-card">
              <span class="cost-type">{{ isRtl ? 'نماذج الذكاء الاصطناعي (AI Tokens)' : 'AI Model Compute' }}</span>
              <div class="cost-amount text-cyan">$145.20</div>
              <span class="cost-desc">DeepSeek-V3 & LLM inference</span>
            </div>

            <div class="cost-card">
              <span class="cost-type">{{ isRtl ? 'قواعد البيانات والتخزين (PostgreSQL)' : 'DB & Storage' }}</span>
              <div class="cost-amount text-green">$85.00</div>
              <span class="cost-desc">Supabase & Vector Embeddings</span>
            </div>

            <div class="cost-card">
              <span class="cost-type">{{ isRtl ? 'شبكة التوزيع السريع (CDN & Media)' : 'CDN & Assets' }}</span>
              <div class="cost-amount text-amber">$25.30</div>
              <span class="cost-desc">Cloudinary & Edge Delivery</span>
            </div>

            <div class="cost-card">
              <span class="cost-type">{{ isRtl ? 'بيانات الخرائط (External APIs)' : 'Maps & Geo Services' }}</span>
              <div class="cost-amount text-purple">$39.00</div>
              <span class="cost-desc">OpenStreetMap & GeoData Sync</span>
            </div>
          </div>

          <!-- Data Sources Sync Status -->
          <div class="sources-sync-row mt-4">
            <div class="source-item">
              <span class="source-status-dot online"></span>
              <span>OpenStreetMap POIs: <strong class="text-green">{{ isRtl ? 'متصل ومحدث' : 'Synced' }}</strong></span>
            </div>
            <div class="source-item">
              <span class="source-status-dot online"></span>
              <span>Weather & Air Quality: <strong class="text-green">{{ isRtl ? 'نشط' : 'Active' }}</strong></span>
            </div>
            <div class="source-item">
              <span class="source-status-dot online"></span>
              <span>Dubai Real Estate DLD Stream: <strong class="text-cyan">{{ isRtl ? 'تدفق يومي' : 'Daily' }}</strong></span>
            </div>
          </div>
        </section>

        <!-- Row 4: Audit Log & Activity Log -->
        <section class="admin-glass-panel mt-4">
          <div class="panel-header-line space-between">
            <div>
              <h2 class="panel-title">{{ isRtl ? 'سجل الأنشطة والأحداث (Audit Log & Activity Log)' : 'Audit & Administrative Activity Log' }}</h2>
              <p class="section-subtext">{{ isRtl ? 'تتبع جميع التعديلات والإجراءات التي تمت داخل لوحة الأدمن مع الطابع الزمني' : 'Immutable chronological record of administrator operations and approvals' }}</p>
            </div>
            <button class="btn-table-action" @click="refreshAuditLogs">
              <i class="fa-solid fa-rotate"></i> {{ isRtl ? 'تحديث السجل' : 'Refresh' }}
            </button>
          </div>

          <div class="admin-table-responsive mt-3">
            <table class="admin-data-table font-mono">
              <thead>
                <tr>
                  <th>{{ isRtl ? 'الوقت والتاريخ' : 'Timestamp' }}</th>
                  <th>{{ isRtl ? 'المشرف المسؤول' : 'Admin User' }}</th>
                  <th>{{ isRtl ? 'الإجراء المتخذ' : 'Action' }}</th>
                  <th>{{ isRtl ? 'الهدف / السجل' : 'Target Entity' }}</th>
                  <th>{{ isRtl ? 'التفاصيل' : 'Details' }}</th>
                  <th>{{ isRtl ? 'الحالة' : 'Status' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in auditLogsList" :key="log.id">
                  <td>{{ log.dateStr }} {{ log.timestamp }}</td>
                  <td><code>{{ log.admin }}</code></td>
                  <td><strong>{{ log.action }}</strong></td>
                  <td>{{ log.target }}</td>
                  <td>{{ log.details }}</td>
                  <td><span class="status-pill pill-active">{{ log.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Row 5: Property Vibe Match & Broadcast Form -->
        <div class="settings-two-columns mt-4">
          
          <!-- Property Vibe Match Rates -->
          <section class="admin-glass-panel">
            <div class="panel-header-line">
              <h2 class="panel-title">{{ isRtl ? 'الخريطة التفاعلية وتطابق العقارات (Property Vibe Match)' : 'Property Vibe Match Insights' }}</h2>
            </div>
            <p class="section-subtext mb-3">{{ isRtl ? 'استعراض معدلات الأسعار للقدم المربع ونسب التطابق العقاري الذكية' : 'Average price per sq.ft and average AI match confidence across prime zones' }}</p>

            <div class="vibe-match-zones-list">
              <div v-for="zone in vibeMatchZones" :key="zone.name" class="vibe-zone-card">
                <div class="zone-head">
                  <strong>{{ zone.name }}</strong>
                  <span class="zone-price text-cyan">{{ zone.avgPrice }} AED/sq.ft</span>
                </div>
                <div class="zone-match-bar mt-2">
                  <span>{{ isRtl ? 'نسبة التطابق الذكي:' : 'Match Rate:' }} <strong>{{ zone.matchRate }}%</strong></span>
                  <div class="mini-bar-track"><div class="mini-bar-fill fill-green" :style="{ width: zone.matchRate + '%' }"></div></div>
                </div>
              </div>
            </div>
          </section>

          <!-- Broadcast System Notification Form -->
          <section class="admin-glass-panel">
            <div class="panel-header-line">
              <h2 class="panel-title">{{ isRtl ? 'إرسال إشعار عام لكافة مستخدمي المنصة' : 'Broadcast System Notification' }}</h2>
            </div>

            <form @submit.prevent="handleBroadcastNotification" class="broadcast-form mt-3">
              <div class="form-field-admin">
                <label>{{ isRtl ? 'عنوان الإشعار' : 'Notification Title' }}</label>
                <input type="text" v-model="broadcastForm.title" required class="admin-form-input" placeholder="e.g. تحديث هام في منصة VibeLocate">
              </div>

              <div class="form-field-admin">
                <label>{{ isRtl ? 'الجمهور المستهدف' : 'Target Audience' }}</label>
                <select v-model="broadcastForm.target" class="admin-select">
                  <option value="all">{{ isRtl ? 'كافة المستخدمين والوسطاء' : 'All Users & Brokers' }}</option>
                  <option value="agents">{{ isRtl ? 'الوسطاء العقاريون فقط' : 'Agents Only' }}</option>
                  <option value="tenants">{{ isRtl ? 'المستأجرون والباحثون عن عقار' : 'Tenants & Buyers' }}</option>
                </select>
              </div>

              <div class="form-field-admin">
                <label>{{ isRtl ? 'نص الرسالة' : 'Message Body' }}</label>
                <textarea v-model="broadcastForm.message" rows="3" required class="admin-form-input" placeholder="اكتب نص الإشعار هنا..."></textarea>
              </div>

              <div class="form-submit-row">
                <button type="submit" class="btn-admin-primary" :disabled="isSendingBroadcast">
                  <i class="fa-solid fa-paper-plane" :class="{ 'fa-spin': isSendingBroadcast }"></i>
                  <span>{{ isSendingBroadcast ? (isRtl ? 'جاري الإرسال...' : 'Sending...') : (isRtl ? 'إرسال الإشعار للجميع' : 'Broadcast Notification') }}</span>
                </button>
              </div>
            </form>
          </section>
        </div>

      </div>

    </main>

    <!-- =========================================================================
         INTERACTIVE ADMIN MODALS
         ========================================================================= -->
    
    <!-- MODAL 1: USER DETAILS & EDIT MODAL -->
    <div v-if="selectedUser" class="admin-modal-overlay fade-in" @click.self="selectedUser = null">
      <div class="admin-modal-box">
        <div class="modal-header-line">
          <h3>{{ userModalMode === 'edit' ? (isRtl ? 'تعديل بيانات المستخدم' : 'Edit User Account') : (isRtl ? 'تفاصيل المستخدم' : 'User Profile Details') }}</h3>
          <button class="btn-modal-close" @click="selectedUser = null"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body-content mt-3">
          <div class="user-modal-header">
            <div class="modal-avatar">
              <img v-if="selectedUser.avatar" :src="selectedUser.avatar" alt="Avatar">
              <span v-else>{{ (selectedUser.name || 'U').charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <h4>{{ selectedUser.name || 'User' }}</h4>
              <p class="modal-email">{{ selectedUser.email }}</p>
              <span class="status-pill mt-1" :class="selectedUser.status === 'active' ? 'pill-active' : 'pill-inactive'">
                {{ selectedUser.status === 'active' ? (isRtl ? 'حساب نشط' : 'Active') : (isRtl ? 'حساب محظور' : 'Suspended') }}
              </span>
            </div>
          </div>

          <div v-if="userModalMode === 'edit'" class="edit-user-form mt-4">
            <div class="form-field-admin">
              <label>{{ isRtl ? 'الاسم الكامل' : 'Full Name' }}</label>
              <input type="text" v-model="selectedUser.name" class="admin-form-input">
            </div>
            <div class="form-field-admin">
              <label>{{ isRtl ? 'الهاتف' : 'Phone' }}</label>
              <input type="text" v-model="selectedUser.phone" class="admin-form-input">
            </div>
            <div class="form-field-admin">
              <label>{{ isRtl ? 'نوع الحساب / الدور' : 'Account Role' }}</label>
              <select v-model="selectedUser.role" class="admin-select">
                <option value="tenant">{{ isRtl ? 'مستأجر / باحث عن عقار' : 'Tenant / Buyer' }}</option>
                <option value="agent">{{ isRtl ? 'وسيط عقاري معتمد' : 'Verified Agent' }}</option>
                <option value="admin">{{ isRtl ? 'مشرف نظام (Admin)' : 'System Admin' }}</option>
              </select>
            </div>
          </div>

          <div v-else class="view-user-details mt-4">
            <div class="detail-row">
              <span class="detail-lbl">{{ isRtl ? 'رقم الهاتف:' : 'Phone:' }}</span>
              <strong>{{ selectedUser.phone || '—' }}</strong>
            </div>
            <div class="detail-row">
              <span class="detail-lbl">{{ isRtl ? 'تاريخ التسجيل:' : 'Registered:' }}</span>
              <strong>{{ formatDate(selectedUser.created_at || '2026-09-01') }}</strong>
            </div>
            <div class="detail-row">
              <span class="detail-lbl">{{ isRtl ? 'العقارات المدرجة:' : 'Listings Count:' }}</span>
              <strong>{{ selectedUser.properties_count || 0 }} {{ isRtl ? 'عقار' : 'properties' }}</strong>
            </div>
          </div>
        </div>

        <div class="modal-footer-line mt-4">
          <button 
            v-if="userModalMode === 'edit'" 
            class="btn-admin-primary" 
            @click="saveUserChanges"
          >
            {{ isRtl ? 'حفظ التعديلات' : 'Save Changes' }}
          </button>
          <button 
            class="btn-table-action" 
            :class="selectedUser.status === 'active' ? 'btn-warn' : 'btn-success'"
            @click="toggleUserStatus(selectedUser)"
          >
            {{ selectedUser.status === 'active' ? (isRtl ? 'حظر الحساب' : 'Suspend User') : (isRtl ? 'فك الحظر' : 'Activate User') }}
          </button>
          <button class="btn-modal-cancel" @click="selectedUser = null">{{ isRtl ? 'إغلاق' : 'Close' }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: PROPERTY REVIEW & MODERATION MODAL -->
    <div v-if="selectedProperty" class="admin-modal-overlay fade-in" @click.self="selectedProperty = null">
      <div class="admin-modal-box">
        <div class="modal-header-line">
          <h3>{{ isRtl ? 'مراجعة وتدقيق العقار' : 'Property Moderation Review' }}</h3>
          <button class="btn-modal-close" @click="selectedProperty = null"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body-content mt-3">
          <div class="property-modal-summary">
            <h4>[{{ selectedProperty.title }}]</h4>
            <p class="prop-modal-loc"><i class="fa-solid fa-location-dot"></i> {{ selectedProperty.location }}</p>
            <div class="prop-modal-meta-grid mt-3">
              <div><span>{{ isRtl ? 'السعر:' : 'Price:' }}</span> <strong class="text-cyan">{{ selectedProperty.price }}</strong></div>
              <div><span>{{ isRtl ? 'النوع:' : 'Type:' }}</span> <strong>{{ selectedProperty.type }}</strong></div>
              <div><span>{{ isRtl ? 'الوسيط:' : 'Agent:' }}</span> <strong>{{ selectedProperty.agentName }}</strong></div>
              <div><span>{{ isRtl ? 'تاريخ التقديم:' : 'Date:' }}</span> <strong>{{ selectedProperty.dateStr }}</strong></div>
            </div>
            <div class="prop-desc-box mt-3">
              <label>{{ isRtl ? 'وصف العقار ومواصفات الـ Vibe:' : 'Description & Vibe Features:' }}</label>
              <p>{{ selectedProperty.description || (isRtl ? 'عقار فاخر مجهز بأعلى المعايير، يقع في منطقة حيوية بالقرب من المرافق العامة والخدمات ووسائل النقل الذكية.' : 'Luxury property furnished to top standards, close to transit and prime amenities.') }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer-line mt-4">
          <button class="btn-table-action btn-approve" @click="approveProperty(selectedProperty.id); selectedProperty = null">
            <i class="fa-solid fa-check"></i> {{ isRtl ? 'اعتماد العقار ونشره' : 'Approve Listing' }}
          </button>
          <button class="btn-table-action btn-reject" @click="rejectProperty(selectedProperty.id); selectedProperty = null">
            <i class="fa-solid fa-xmark"></i> {{ isRtl ? 'رفض العقار' : 'Reject Listing' }}
          </button>
          <button class="btn-modal-cancel" @click="selectedProperty = null">{{ isRtl ? 'إلغاء' : 'Cancel' }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL 3: COMPLAINT RESOLUTION MODAL -->
    <div v-if="selectedReport" class="admin-modal-overlay fade-in" @click.self="selectedReport = null">
      <div class="admin-modal-box">
        <div class="modal-header-line">
          <h3>{{ isRtl ? 'معالجة الشكوى والنزاع' : 'Resolve Incident Report' }} #{{ selectedReport.id }}</h3>
          <button class="btn-modal-close" @click="selectedReport = null"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body-content mt-3">
          <div class="report-detail-card">
            <h4>[{{ selectedReport.subject }}]</h4>
            <div class="rep-meta-row mt-2">
              <span>{{ isRtl ? 'مقدم الشكوى:' : 'Reporter:' }} <strong>{{ selectedReport.reporterName }}</strong></span>
              <span>{{ isRtl ? 'الطرف المشتكى عليه:' : 'Target:' }} <strong>{{ selectedReport.targetName || 'Property' }}</strong></span>
              <span>{{ isRtl ? 'التاريخ:' : 'Date:' }} <strong>{{ selectedReport.dateStr }}</strong></span>
            </div>
            <div class="rep-full-desc mt-3">
              <label>{{ isRtl ? 'تفاصيل البلاغ:' : 'Report Description:' }}</label>
              <p>{{ selectedReport.description || (isRtl ? 'تم تقديم شكوى بخصوص تباين في مواصفات العقار أو عدم تجاوب الوسيط مع مواعيد المعاينة.' : 'Discrepancy reported regarding property features and agent response.') }}</p>
            </div>

            <div class="form-field-admin mt-3">
              <label>{{ isRtl ? 'ملاحظات المشرف الإدارية (Admin Notes):' : 'Admin Resolution Notes:' }}</label>
              <textarea v-model="adminReportNotes" rows="3" class="admin-form-input" :placeholder="isRtl ? 'اكتب الإجراء المتخذ وملاحظات الحل هنا...' : 'Enter resolution details...'"></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer-line mt-4">
          <button class="btn-table-action btn-approve" @click="resolveCurrentReport('resolved')">
            <i class="fa-solid fa-check-double"></i> {{ isRtl ? 'إغلاق البلاغ وحله' : 'Mark as Resolved' }}
          </button>
          <button class="btn-table-action btn-warn" @click="resolveCurrentReport('reviewing')">
            <i class="fa-solid fa-clock"></i> {{ isRtl ? 'تحويل لقيد المراجعة' : 'Set Under Review' }}
          </button>
          <button class="btn-modal-cancel" @click="selectedReport = null">{{ isRtl ? 'إلغاء' : 'Cancel' }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL 4: AREA VIBE DETAILS MODAL -->
    <div v-if="selectedArea" class="admin-modal-overlay fade-in" @click.self="selectedArea = null">
      <div class="admin-modal-box">
        <div class="modal-header-line">
          <h3>{{ isRtl ? 'تفاصيل تغطية الحي' : 'Neighborhood Vibe Details' }} - {{ selectedArea.name }}</h3>
          <button class="btn-modal-close" @click="selectedArea = null"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body-content mt-3">
          <div class="area-detail-summary">
            <div class="area-badges-top">
              <span class="coverage-status-tag" :class="selectedArea.status === 'sufficient' ? 'tag-green' : 'tag-orange'">
                {{ selectedArea.status === 'sufficient' ? (isRtl ? 'تغطية كافية' : 'Sufficient') : (isRtl ? 'تغطية ناقصة' : 'Needs More Data') }}
              </span>
              <span><strong>{{ selectedArea.poisCount }}</strong> POIs</span>
              <span><strong>{{ selectedArea.reviewsCount }}</strong> {{ isRtl ? 'مراجعة مولدة' : 'Reviews' }}</span>
            </div>

            <div class="vibe-radar-bars mt-4">
              <h4 class="mb-3">{{ isRtl ? 'توزيع تصنيفات الـ Vibes في المنطقة:' : 'Vibe Category Distribution:' }}</h4>
              <div class="radar-bar-item">
                <span>{{ isRtl ? 'المقاهي والمطاعم (Dining & Cafes)' : 'Dining & Cafes' }}</span>
                <div class="mini-bar-track"><div class="mini-bar-fill fill-cyan" style="width: 88%"></div></div>
              </div>
              <div class="radar-bar-item">
                <span>{{ isRtl ? 'وسائل النقل والمترو (Transit)' : 'Public Transit' }}</span>
                <div class="mini-bar-track"><div class="mini-bar-fill fill-green" style="width: 94%"></div></div>
              </div>
              <div class="radar-bar-item">
                <span>{{ isRtl ? 'الهدوء والسكينة (Peace & Quiet)' : 'Peace & Quiet' }}</span>
                <div class="mini-bar-track"><div class="mini-bar-fill fill-amber" style="width: 65%"></div></div>
              </div>
              <div class="radar-bar-item">
                <span>{{ isRtl ? 'المساحات الخضراء والحدائق (Parks)' : 'Parks & Walkways' }}</span>
                <div class="mini-bar-track"><div class="mini-bar-fill fill-purple" style="width: 82%"></div></div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer-line mt-4">
          <button 
            class="btn-admin-primary" 
            :disabled="selectedArea.isGenerating"
            @click="triggerNeighborhoodGeneration(selectedArea); selectedArea = null"
          >
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            {{ isRtl ? 'إعادة توليد المراجعات الآن' : 'Regenerate Reviews Now' }}
          </button>
          <button class="btn-modal-cancel" @click="selectedArea = null">{{ isRtl ? 'إغلاق' : 'Close' }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import adminService from '../services/adminService'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const router = useRouter()
const { isRtl, isDark, theme, toggleTheme, toggleLanguage, lang } = useThemeAndLanguage()

const activeSection = ref('overview')
const mobileSidebarOpen = ref(false)
const isRefreshing = ref(false)
const searchQuery = ref('')
const lastUpdatedTime = ref(new Date().toLocaleTimeString())

// Navigation menu definition matching user's image exactly
const navMenuItems = computed(() => [
  { key: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview' },
  { key: 'users', labelAr: 'المستخدمون', labelEn: 'Users', badgeCount: stats.value.totalUsers || null },
  { key: 'properties', labelAr: 'مراجعة العقارات', labelEn: 'Property Reviews', badgeCount: pendingPropertiesList.value.length || null },
  { key: 'ai_health', labelAr: 'صحة خدمة الذكاء الاصطناعي', labelEn: 'AI Service Health' },
  { key: 'coverage', labelAr: 'تغطية Vibe Report', labelEn: 'Vibe Report Coverage' },
  { key: 'reports', labelAr: 'الشكاوى والتبليغات', labelEn: 'Complaints & Reports', badgeCount: openReportsCount.value || null },
  { key: 'settings', labelAr: 'إعدادات النظام', labelEn: 'System Settings' }
])

const currentSectionTitle = computed(() => {
  const item = navMenuItems.value.find(i => i.key === activeSection.value)
  return item ? (isRtl.value ? item.labelAr : item.labelEn) : (isRtl.value ? 'نظرة عامة' : 'Overview')
})

// Top Statistics
const stats = ref({
  totalUsers: 61,
  activeAgents: 12,
  totalProperties: 710,
  todaySearches: 224,
  openReports: 2
})

// AI Health Diagnostics
const aiHealth = ref({
  status: 'normal',
  statusText: isRtl.value ? 'تعمل بشكل طبيعي' : 'Operating Normally',
  successRate: 98.4,
  avgLatency: 0.85,
  needsClarification: 14,
  fallbackTriggers: 0,
  totalRequests: 224
})

// Vibe Report Coverage Areas for Overview Widget
const coverageAreasList = ref([
  { id: 1, name: isRtl.value ? 'دبي مارينا' : 'Dubai Marina', status: 'sufficient', percentage: 92 },
  { id: 2, name: isRtl.value ? 'وسط مدينة دبي (داون تاون)' : 'Downtown Dubai', status: 'sufficient', percentage: 88 },
  { id: 3, name: isRtl.value ? 'قرية جميرا الدائرية (JVC)' : 'Jumeirah Village Circle', status: 'incomplete', percentage: 38 },
  { id: 4, name: isRtl.value ? 'الخليج التجاري (بزنس باي)' : 'Business Bay', status: 'incomplete', percentage: 24 }
])

// Rich Neighborhoods for Coverage Page
const richNeighborhoodsList = ref([
  { id: 1, name: 'Dubai Marina (دبي مارينا)', slug: 'dubai-marina', poisCount: 1420, reviewsCount: 680, lastUpdated: '2026-10-01', status: 'sufficient', isGenerating: false },
  { id: 2, name: 'Downtown Dubai (وسط مدينة دبي)', slug: 'downtown-dubai', poisCount: 1850, reviewsCount: 920, lastUpdated: '2026-10-01', status: 'sufficient', isGenerating: false },
  { id: 3, name: 'Business Bay (الخليج التجاري)', slug: 'business-bay', poisCount: 940, reviewsCount: 310, lastUpdated: '2026-09-30', status: 'incomplete', isGenerating: false },
  { id: 4, name: 'Jumeirah Village Circle (JVC)', slug: 'jvc', poisCount: 810, reviewsCount: 240, lastUpdated: '2026-09-29', status: 'incomplete', isGenerating: false },
  { id: 5, name: 'Palm Jumeirah (نخلة جميرا)', slug: 'palm-jumeirah', poisCount: 1120, reviewsCount: 540, lastUpdated: '2026-10-01', status: 'sufficient', isGenerating: false },
  { id: 6, name: 'Dubai Hills Estate (دبي هيلز)', slug: 'dubai-hills', poisCount: 760, reviewsCount: 410, lastUpdated: '2026-09-28', status: 'sufficient', isGenerating: false },
  { id: 7, name: 'Al Reef & Motor City (الريف وموتور سيتي)', slug: 'al-reef', poisCount: 540, reviewsCount: 180, lastUpdated: '2026-09-25', status: 'incomplete', isGenerating: false }
])

// Pending Properties
const pendingPropertiesList = ref([
  { id: 101, title: 'شقة فاخرة بإطلالة بحرية', titleAr: 'شقة فاخرة بإطلالة بحرية', location: 'Dubai Marina - Tower A', type: 'Apartment', price: 'AED 120,000/yr', agentName: 'أحمد المنصوري', dateStr: '2026-10-01' },
  { id: 102, title: 'بنتهاوس مع مسبح خاص', titleAr: 'بنتهاوس مع مسبح خاص', location: 'Downtown Dubai - Boulevard', type: 'Penthouse', price: 'AED 380,000/yr', agentName: 'سارة خليل', dateStr: '2026-09-30' },
  { id: 103, title: 'تاون هاوس عصري للعائلات', titleAr: 'تاون هاوس عصري للعائلات', location: 'Dubai Hills Estate', type: 'Townhouse', price: 'AED 195,000/yr', agentName: 'خالد السويدي', dateStr: '2026-09-30' },
  { id: 104, title: 'استوديو ذكي بالقرب من المترو', titleAr: 'استوديو ذكي بالقرب من المترو', location: 'Business Bay', type: 'Studio', price: 'AED 75,000/yr', agentName: 'عمر القاسمي', dateStr: '2026-09-29' }
])

// Reports / Complaints
const allReportsList = ref([
  { id: 1, type: 'property', subject: 'تباين في سعر الإيجار المعروض مع العقد', reporterName: 'محمد سالم', targetName: 'شقة في الخليج التجاري (#402)', dateStr: '2026-10-01', status: 'open', description: 'السعر المسجل في التطبيق 85000 درهم، لكن عند التواصل طلب الوسيط 95000 درهم بدون توضيح.' },
  { id: 2, type: 'agent', subject: 'عدم الحضور في موعد المعاينة المحدد', reporterName: 'فاطمة الكعبي', targetName: 'الوسيط خالد العبدالله', dateStr: '2026-09-30', status: 'reviewing', description: 'تم تأكيد موعد معاينة الفيلا في دبي هيلز عبر المنصة ولم يحضر الوسيط ولم يرد على الاتصالات.' },
  { id: 3, type: 'user', subject: 'استخدام صور غير مطابقة للواقع', reporterName: 'يوسف درويش', targetName: 'عقار #109 (قرية جميرا)', dateStr: '2026-09-28', status: 'resolved', description: 'الصور المعروضة تتبع شقة أخرى، تم تعديل الصور واعتماد العقار الحقيقي.' }
])

const recentReportsList = computed(() => allReportsList.value.filter(r => r.status !== 'resolved'))
const reportStatusFilter = ref('open')

const filteredReportsList = computed(() => {
  return allReportsList.value.filter(r => r.status === reportStatusFilter.value)
})

const openReportsCount = computed(() => allReportsList.value.filter(r => r.status === 'open').length)
const reviewingReportsCount = computed(() => allReportsList.value.filter(r => r.status === 'reviewing').length)
const resolvedReportsCount = computed(() => allReportsList.value.filter(r => r.status === 'resolved').length)

// Users Management
const allUsersList = ref([])
const userRoleFilter = ref('all')
const userSearchTerm = ref('')
const currentPageUsers = ref(1)
const usersPerPage = 8

const userFilterOptions = computed(() => [
  { key: 'all', labelAr: 'الكل', labelEn: 'All', count: allUsersList.value.length },
  { key: 'tenant', labelAr: 'مستخدمون', labelEn: 'Users', count: allUsersList.value.filter(u => (u.role_slug || u.role) === 'tenant').length },
  { key: 'agent', labelAr: 'وسطاء', labelEn: 'Brokers', count: allUsersList.value.filter(u => (u.role_slug || u.role) === 'agent').length },
  { key: 'suspended', labelAr: 'محظورون', labelEn: 'Suspended', count: allUsersList.value.filter(u => u.status === 'suspended').length }
])

const filteredUsersList = computed(() => {
  return allUsersList.value.filter(u => {
    // Role filter
    if (userRoleFilter.value === 'tenant' && (u.role_slug || u.role) !== 'tenant') return false
    if (userRoleFilter.value === 'agent' && (u.role_slug || u.role) !== 'agent') return false
    if (userRoleFilter.value === 'suspended' && u.status !== 'suspended') return false
    
    // Search Term
    if (userSearchTerm.value.trim()) {
      const q = userSearchTerm.value.toLowerCase()
      const name = (u.name || `${u.first_name || ''} ${u.last_name || ''}`).toLowerCase()
      const email = (u.email || '').toLowerCase()
      const phone = (u.phone || '').toLowerCase()
      if (!name.includes(q) && !email.includes(q) && !phone.includes(q)) return false
    }
    return true
  })
})

const totalUserPages = computed(() => Math.ceil(filteredUsersList.value.length / usersPerPage) || 1)

const paginatedUsersList = computed(() => {
  const start = (currentPageUsers.value - 1) * usersPerPage
  return filteredUsersList.value.slice(start, start + usersPerPage)
})

const usersPaginationRange = computed(() => {
  const start = (currentPageUsers.value - 1) * usersPerPage + 1
  const end = Math.min(currentPageUsers.value * usersPerPage, filteredUsersList.value.length)
  return `${start}-${end}`
})

// AI Test Console State
const testPromptInput = ref('شقة استوديو فاخرة قرب المترو بدبي بميزانية 8000 شهرياً مع إطلالة مفتوحة')
const isTestingAi = ref(false)
const testResult = ref(null)
const isCopiedJson = ref(false)

const sampleTestPrompts = [
  'شقة استوديو فاخرة قرب المترو بدبي بميزانية 8000 شهرياً',
  'فيلا عائلية في المرابع العربية بحديقة ومسبح خاص',
  'مكتب تجاري في الخليج التجاري مناسب لشركة تقنية'
]

const formattedTestJson = computed(() => {
  if (!testResult.value) return ''
  return JSON.stringify(testResult.value.data, null, 2)
})

// Live AI Events Log
const liveAiEventsList = ref([
  { id: 1, time: '15:42:10', endpoint: 'POST /api/ai-contextual', model: 'DeepSeek-V3', latency: 0.68, status: 200 },
  { id: 2, time: '15:40:02', endpoint: 'POST /api/find-properties', model: 'DeepSeek-V3', latency: 0.81, status: 200 },
  { id: 3, time: '15:37:19', endpoint: 'POST /api/reviews/analyze', model: 'DeepSeek-V3', latency: 0.94, status: 200 },
  { id: 4, time: '15:31:45', endpoint: 'POST /api/ai-contextual', model: 'DeepSeek-V3', latency: 0.72, status: 200 },
  { id: 5, time: '15:25:30', endpoint: 'POST /api/ai-contextual', model: 'Fallback-Llama', latency: 1.15, status: 200 }
])

// System Settings State
const systemSettings = ref({
  defaultLang: 'ar',
  timezone: 'Asia/Dubai',
  twoFactorRequired: true
})

const vibeMatchZones = ref([
  { name: isRtl.value ? 'وسط مدينة دبي (Downtown)' : 'Downtown Dubai', avgPrice: 2450, matchRate: 96 },
  { name: isRtl.value ? 'دبي مارينا (Dubai Marina)' : 'Dubai Marina', avgPrice: 1820, matchRate: 94 },
  { name: isRtl.value ? 'الخليج التجاري (Business Bay)' : 'Business Bay', avgPrice: 1650, matchRate: 91 },
  { name: isRtl.value ? 'نخلة جميرا (Palm Jumeirah)' : 'Palm Jumeirah', avgPrice: 3200, matchRate: 97 }
])

const auditLogsList = ref([])

// Modals State
const selectedUser = ref(null)
const userModalMode = ref('view') // 'view' | 'edit'
const selectedProperty = ref(null)
const selectedReport = ref(null)
const adminReportNotes = ref('')
const selectedArea = ref(null)

// Broadcast Form
const broadcastForm = ref({
  title: '',
  target: 'all',
  message: ''
})
const isSendingBroadcast = ref(false)
const isBatchGenerating = ref(false)

// Formatting Helpers
const formatRoleName = (role) => {
  if (role === 'agent') return isRtl.value ? 'وسيط معتمد' : 'Broker'
  if (role === 'admin' || role === 'super-admin') return isRtl.value ? 'مدير نظام' : 'Admin'
  return isRtl.value ? 'مستخدم' : 'Tenant'
}

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString('ar-EG')
  } catch {
    return dateStr
  }
}

// Modal Openers
const openUserModal = (user, mode = 'view') => {
  selectedUser.value = { ...user }
  userModalMode.value = mode
}

const openPropertyModal = (prop) => {
  selectedProperty.value = prop
}

const openReportModal = (rep) => {
  selectedReport.value = rep
  adminReportNotes.value = ''
}

const openAreaDetailsModal = (area) => {
  selectedArea.value = area
}

// Actions
const saveUserChanges = async () => {
  if (!selectedUser.value) return
  adminService.logAuditAction('تعديل بيانات مستخدم', selectedUser.value.email, `تحديث الدور إلى ${selectedUser.value.role}`)
  const idx = allUsersList.value.findIndex(u => u.id === selectedUser.value.id)
  if (idx !== -1) {
    allUsersList.value[idx] = { ...selectedUser.value }
  }
  selectedUser.value = null
  refreshAuditLogs()
  alert(isRtl.value ? 'تم حفظ التعديلات بنجاح' : 'User updated successfully')
}

const toggleUserStatus = async (user) => {
  const nextStatus = user.status === 'active' ? 'suspended' : 'active'
  const res = await adminService.updateUserStatus(user.id, nextStatus)
  if (res.success) {
    user.status = nextStatus
    adminService.logAuditAction(nextStatus === 'suspended' ? 'حظر حساب مستخدم' : 'فك حظر مستخدم', user.email, `الحالة الجديدة: ${nextStatus}`)
    refreshAuditLogs()
  }
}

const approveProperty = async (id) => {
  const res = await adminService.approveProperty(id)
  if (res.success) {
    const prop = pendingPropertiesList.value.find(p => p.id === id)
    adminService.logAuditAction('اعتماد عقار ونشره', prop ? prop.title : `#${id}`, 'تمت المراجعة والموافقة')
    pendingPropertiesList.value = pendingPropertiesList.value.filter(p => p.id !== id)
    stats.value.totalProperties++
    refreshAuditLogs()
  }
}

const rejectProperty = async (id) => {
  const reason = prompt(isRtl.value ? 'أدخل سبب الرفض:' : 'Enter rejection reason:', 'معلومات العقار غير مكتملة أو غير مطابقة للواقع')
  if (!reason) return
  const res = await adminService.rejectProperty(id, reason)
  if (res.success) {
    const prop = pendingPropertiesList.value.find(p => p.id === id)
    adminService.logAuditAction('رفض عقار معلق', prop ? prop.title : `#${id}`, `السبب: ${reason}`)
    pendingPropertiesList.value = pendingPropertiesList.value.filter(p => p.id !== id)
    refreshAuditLogs()
  }
}

const resolveCurrentReport = async (status) => {
  if (!selectedReport.value) return
  const res = await adminService.updateReportStatus(selectedReport.value.id, status, adminReportNotes.value)
  if (res.success) {
    selectedReport.value.status = status
    adminService.logAuditAction(status === 'resolved' ? 'إغلاق بلاغ ونزاع' : 'تحويل بلاغ للمراجعة', `بلاغ #${selectedReport.value.id}`, adminReportNotes.value || 'تمت المعالجة الإدارية')
    selectedReport.value = null
    refreshAuditLogs()
  }
}

const triggerNeighborhoodGeneration = async (area) => {
  area.isGenerating = true
  const res = await adminService.generateVibeReviews(area.name)
  area.isGenerating = false
  if (res.success) {
    area.status = 'sufficient'
    area.reviewsCount += 45
    area.lastUpdated = new Date().toISOString().split('T')[0]
    adminService.logAuditAction('توليد مراجعات بالذكاء الاصطناعي', area.name, 'تم توليد 45 مراجعة ذكاء اصطناعي بنجاح')
    refreshAuditLogs()
    alert(isRtl.value ? `تم توليد المراجعات الذكية لـ ${area.name} بنجاح!` : `Generated reviews for ${area.name}`)
  }
}

const generateAllIncompleteReviews = async () => {
  isBatchGenerating.value = true
  const incomplete = richNeighborhoodsList.value.filter(a => a.status === 'incomplete')
  for (const area of incomplete) {
    await triggerNeighborhoodGeneration(area)
  }
  isBatchGenerating.value = false
}

const executeAiTest = async () => {
  if (!testPromptInput.value.trim()) return
  isTestingAi.value = true
  testResult.value = null
  const res = await adminService.testAiQuery(testPromptInput.value.trim())
  isTestingAi.value = false
  testResult.value = res

  // Add event to live events stream
  liveAiEventsList.value.unshift({
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    endpoint: 'POST /api/ai-contextual',
    model: res.model || 'DeepSeek-V3',
    latency: res.latency,
    status: res.status
  })
  if (liveAiEventsList.value.length > 8) liveAiEventsList.value.pop()
}

const copyTestResultJson = () => {
  navigator.clipboard.writeText(formattedTestJson.value)
  isCopiedJson.value = true
  setTimeout(() => isCopiedJson.value = false, 2000)
}

const refreshAuditLogs = () => {
  auditLogsList.value = adminService.getAuditLogs()
}

const handleBroadcastNotification = async () => {
  isSendingBroadcast.value = true
  const res = await adminService.broadcastNotification({
    target: broadcastForm.value.target,
    title: broadcastForm.value.title,
    message: broadcastForm.value.message
  })
  isSendingBroadcast.value = false
  if (res.success) {
    adminService.logAuditAction('إرسال إشعار عام', broadcastForm.value.title, `الجمهور: ${broadcastForm.value.target}`)
    refreshAuditLogs()
    alert(isRtl.value ? 'تم إرسال الإشعار بنجاح لكافة المستخدمين!' : 'Notification broadcasted successfully!')
    broadcastForm.value.title = ''
    broadcastForm.value.message = ''
  }
}

const handleSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return
  userSearchTerm.value = q
  activeSection.value = 'users'
}

const handleAdminLogout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('vibe_user_role')
  router.push('/login')
}

// Load real data on mount
const loadAllAdminData = async () => {
  isRefreshing.value = true
  lastUpdatedTime.value = new Date().toLocaleTimeString()

  try {
    // 1. Dashboard summary
    const dashRes = await adminService.getDashboard()
    if (dashRes.success && dashRes.data) {
      const d = dashRes.data
      if (d.total_users !== undefined) stats.value.totalUsers = d.total_users
      if (d.active_agents !== undefined) stats.value.activeAgents = d.active_agents
      if (d.total_properties !== undefined) stats.value.totalProperties = d.total_properties
      if (d.today_searches !== undefined) stats.value.todaySearches = d.today_searches
      if (d.open_reports !== undefined) stats.value.openReports = d.open_reports
      if (d.ai_health) {
        aiHealth.value = { ...aiHealth.value, ...d.ai_health }
      }
    }

    // 2. Users List
    const usersRes = await adminService.getUsers()
    if (usersRes.success && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
      allUsersList.value = usersRes.data
      stats.value.totalUsers = usersRes.data.length
    } else {
      // Realistic default list if backend array is empty
      allUsersList.value = [
        { id: 1, name: 'Admin VibeLocate', email: 'admin@vibelocate.ai', phone: '+971500000001', role: 'admin', role_slug: 'super-admin', status: 'active', joined_date: '2026-08-01' },
        { id: 2, name: 'أحمد المنصوري', email: 'ahmed.mansoori@vibelocate.ai', phone: '+971501234567', role: 'agent', role_slug: 'agent', status: 'active', joined_date: '2026-08-15' },
        { id: 3, name: 'سارة خليل', email: 'sara.khalil@example.com', phone: '+971559876543', role: 'agent', role_slug: 'agent', status: 'active', joined_date: '2026-09-02' },
        { id: 4, name: 'خالد السويدي', email: 'khalid.suwaidi@vibelocate.ai', phone: '+971508889999', role: 'agent', role_slug: 'agent', status: 'active', joined_date: '2026-09-10' },
        { id: 5, name: 'محمد سالم', email: 'mohammed.salem@gmail.com', phone: '+971523334444', role: 'tenant', role_slug: 'tenant', status: 'active', joined_date: '2026-09-12' },
        { id: 6, name: 'فاطمة الكعبي', email: 'fatima.kaabi@hotmail.com', phone: '+971545556666', role: 'tenant', role_slug: 'tenant', status: 'active', joined_date: '2026-09-14' },
        { id: 7, name: 'يوسف درويش', email: 'yousef.darwish@yahoo.com', phone: '+971561112222', role: 'tenant', role_slug: 'tenant', status: 'active', joined_date: '2026-09-18' },
        { id: 8, name: 'حساب غير موثق', email: 'spammer_99@tempmail.com', phone: '+971590000000', role: 'tenant', role_slug: 'tenant', status: 'suspended', joined_date: '2026-09-22' }
      ]
    }

    // 3. Reports
    const repRes = await adminService.getReports()
    if (repRes.success && Array.isArray(repRes.data) && repRes.data.length > 0) {
      allReportsList.value = repRes.data
    }

    // 4. Audit Logs
    refreshAuditLogs()

  } catch (err) {
    console.warn('[Admin] Data fetch error:', err)
  } finally {
    isRefreshing.value = false
  }
}

onMounted(() => {
  loadAllAdminData()
})
</script>

<style scoped>
/* =========================================================================
   VIBELOCATE ADMIN THEME (Dark Executive Cyberpunk / Slate Navy)
   Exact match to user's design reference: #070d19, cyan #06b6d4, cards #0d1e34
   ========================================================================= */
.admin-shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #070d19;
  color: #f1f5f9;
  font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* RIGHT SIDEBAR - FIXED & COMPACT */
.admin-sidebar {
  width: 250px;
  min-width: 250px;
  background: #081120;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  padding: 16px 14px;
  z-index: 1000;
  position: fixed;
  top: 16px;
  right: 16px;
  height: auto;
  max-height: calc(100vh - 32px);
  margin: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(6, 182, 212, 0.05);
  overflow-y: auto;
}

[dir="ltr"] .admin-sidebar {
  right: auto;
  left: 16px;
  margin: 0;
}

.admin-sidebar::-webkit-scrollbar {
  width: 4px;
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: rgba(56, 189, 248, 0.2);
  border-radius: 4px;
}

.admin-brand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 14px 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand-title-wrap {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.brand-white {
  color: #ffffff;
}

.brand-cyan {
  color: #38bdf8;
  margin-right: 4px;
}

[dir="ltr"] .brand-cyan {
  margin-right: 0;
  margin-left: 4px;
}

.admin-badge-live {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  letter-spacing: 0.5px;
}

/* NAV MENU */
.admin-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
  margin-bottom: 12px;
  flex-grow: 0;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid transparent;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-align: right;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

[dir="ltr"] .admin-nav-item {
  text-align: left;
}

.admin-nav-item .nav-dot {
  color: #06b6d4;
  font-size: 15px;
  line-height: 1;
  opacity: 0.7;
}

.admin-nav-item:hover {
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.03);
}

/* ACTIVE PILL (EXACT MATCH TO SCREENSHOT) */
.admin-nav-item.active {
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.65);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.25), inset 0 0 10px rgba(6, 182, 212, 0.1);
  color: #38bdf8;
  font-weight: 600;
}

.admin-nav-item.active .nav-dot {
  opacity: 1;
  color: #38bdf8;
  text-shadow: 0 0 8px #38bdf8;
}

.nav-label {
  flex-grow: 1;
}

.nav-count-badge {
  background: rgba(6, 182, 212, 0.2);
  color: #38bdf8;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  border: 1px solid rgba(6, 182, 212, 0.4);
}

/* SIDEBAR FOOTER */
.admin-sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 12px;
  margin-top: auto;
}

.admin-user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.admin-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7, #06b6d4);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.admin-user-meta {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-email {
  font-size: 12px;
  color: #e2e8f0;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-role {
  font-size: 10px;
  color: #38bdf8;
}

.footer-action-links {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.btn-return-site {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #cbd5e1;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-return-site:hover {
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
}

.btn-admin-logout {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  color: #f87171;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-admin-logout:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* MAIN VIEWPORT */
.admin-main-viewport {
  flex: 1;
  padding: 24px 32px;
  min-height: 100vh;
  margin-right: 282px;
  margin-left: 0;
  width: calc(100% - 282px);
  box-sizing: border-box;
}

[dir="ltr"] .admin-main-viewport {
  margin-right: 0;
  margin-left: 282px;
}

/* TOP HEADER */
.admin-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.3px;
}

.page-timestamp {
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-refresh-data {
  background: none;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
  transition: opacity 0.2s;
}

.btn-refresh-data:hover {
  opacity: 0.8;
}

.top-actions-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-quick-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-ctrl-btn {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #0b172a;
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: #f1f5f9;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
}

.admin-ctrl-btn:hover {
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.5);
  color: #38bdf8;
  transform: translateY(-1px);
}

.sidebar-ctrls-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 10px;
}

.sidebar-ctrl-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  color: #cbd5e1;
  font-size: 11.5px;
  font-weight: 500;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.sidebar-ctrl-btn:hover {
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.3);
  color: #38bdf8;
}

.admin-search-wrap {
  display: flex;
  align-items: center;
  background: #0b172a;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  padding: 4px 6px;
  width: 340px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.admin-search-input {
  background: transparent;
  border: none;
  color: #f1f5f9;
  font-size: 13px;
  padding: 6px 10px;
  flex: 1;
  outline: none;
}

.admin-search-input::placeholder {
  color: #475569;
}

.btn-search-exec {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.4);
  color: #38bdf8;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-search-exec:hover {
  background: rgba(6, 182, 212, 0.25);
}

/* 4 TOP KPI CARDS */
.admin-kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.admin-kpi-card {
  background: #0b172a;
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 10px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  position: relative;
  transition: transform 0.2s, border-color 0.2s;
}

.admin-kpi-card.clickable {
  cursor: pointer;
}

.admin-kpi-card.clickable:hover {
  transform: translateY(-2px);
  border-color: rgba(56, 189, 248, 0.4);
}

.kpi-title {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

.kpi-metric-number {
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  margin: 10px 0 6px 0;
  letter-spacing: -0.5px;
}

.kpi-subtext {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
}

.text-cyan { color: #38bdf8 !important; }
.text-green { color: #10b981 !important; }
.text-amber { color: #f59e0b !important; }
.text-red { color: #ef4444 !important; }
.text-purple { color: #a855f7 !important; }

/* GLASS PANELS */
.admin-glass-panel {
  background: #0b172a;
  border: 1px solid rgba(56, 189, 248, 0.16);
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.panel-header-line {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 14px;
}

.panel-header-line.space-between {
  justify-content: space-between;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
}

.section-subtext {
  font-size: 12px;
  color: #64748b;
  margin-top: 3px;
}

/* MIDDLE GRID */
.admin-middle-grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 16px;
}

/* VIBE COVERAGE PANEL */
.coverage-bars-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 18px;
}

.coverage-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coverage-status-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  min-width: 52px;
  text-align: center;
}

.tag-green {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.tag-orange {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.progress-track {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fill-green { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
.fill-orange { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5); }
.fill-cyan { background: #06b6d4; box-shadow: 0 0 8px rgba(6, 182, 212, 0.5); }
.fill-amber { background: #f59e0b; }
.fill-red { background: #ef4444; }
.fill-purple { background: #a855f7; }

.area-name-label {
  font-size: 13px;
  color: #cbd5e1;
  width: 140px;
  text-align: left;
}

[dir="ltr"] .area-name-label {
  text-align: right;
}

.coverage-footer-link {
  margin-top: 24px;
  text-align: left;
}

[dir="ltr"] .coverage-footer-link {
  text-align: right;
}

.btn-link-chevron {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.btn-link-chevron:hover {
  color: #38bdf8;
}

/* AI HEALTH PANEL */
.ai-status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.status-text {
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
}

.ai-mini-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.ai-mini-stat-card {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.ai-dot-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  margin-top: 5px;
}

.ai-mini-content {
  display: flex;
  flex-direction: column;
}

.ai-stat-lbl {
  font-size: 11px;
  color: #94a3b8;
}

.ai-stat-code {
  font-size: 9px;
  color: #64748b;
  font-family: monospace;
}

.ai-stat-val {
  font-size: 18px;
  color: #ffffff;
  font-weight: 700;
  margin-top: 2px;
}

/* SVG WAVE CHART */
.ai-chart-section {
  margin-top: 18px;
}

.chart-caption {
  font-size: 11px;
  color: #64748b;
  display: block;
  margin-bottom: 6px;
}

.svg-wave-container {
  width: 100%;
  height: 90px;
  position: relative;
  background: rgba(2, 132, 199, 0.05);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(56, 189, 248, 0.1);
}

.ai-wave-svg {
  width: 100%;
  height: 70px;
}

.chart-timeline-ticks {
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 9px;
  color: #64748b;
}

/* TABLES */
.admin-table-responsive {
  width: 100%;
  overflow-x: auto;
}

.admin-data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: right;
  font-size: 13px;
}

[dir="ltr"] .admin-data-table {
  text-align: left;
}

.admin-data-table th {
  padding: 10px 14px;
  color: #64748b;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12px;
}

.admin-data-table td {
  padding: 12px 14px;
  color: #cbd5e1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.admin-data-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.prop-sub-loc {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.row-actions {
  display: flex;
  gap: 6px;
}

.btn-table-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-table-action:hover {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.3);
}

.btn-approve {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.btn-approve:hover {
  background: rgba(16, 185, 129, 0.25);
  color: #10b981;
}

.btn-reject {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.btn-reject:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #ef4444;
}

.btn-warn {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.btn-success {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
  color: #10b981;
}

/* REPORTS STRIP */
.recent-reports-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.report-strip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.1);
  padding: 10px 14px;
  border-radius: 8px;
  transition: all 0.2s;
}

.report-strip-item.clickable:hover {
  border-color: rgba(56, 189, 248, 0.35);
  background: rgba(255, 255, 255, 0.03);
}

.report-strip-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dot-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.dot-red { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
.dot-amber { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

.report-subject-text {
  font-size: 13px;
  color: #f1f5f9;
}

.report-meta-tag {
  font-size: 11px;
  color: #64748b;
  background: rgba(255, 255, 255, 0.04);
  padding: 1px 6px;
  border-radius: 4px;
}

.report-strip-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.report-time {
  font-size: 11px;
  color: #64748b;
}

.btn-strip-view {
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
}

/* USER MANAGEMENT STYLES */
.user-filter-pills {
  display: flex;
  gap: 8px;
}

.filter-pill-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.filter-pill-btn:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.filter-pill-btn.active {
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.6);
  color: #38bdf8;
  font-weight: 600;
}

.panel-search-bar {
  display: flex;
}

.admin-subsearch-input-wrap {
  display: flex;
  align-items: center;
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 8px;
  padding: 6px 12px;
  width: 100%;
  max-width: 480px;
  gap: 8px;
  color: #64748b;
}

.admin-subsearch-input {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 13px;
  flex: 1;
  outline: none;
}

.btn-clear-input {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
}

.user-cell-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-cell-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1e293b;
  border: 1px solid rgba(56, 189, 248, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #38bdf8;
  overflow: hidden;
}

.user-cell-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-cell-email {
  font-size: 11px;
  color: #64748b;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.role-tenant { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }
.role-agent { background: rgba(2, 132, 199, 0.15); color: #38bdf8; border: 1px solid rgba(2, 132, 199, 0.3); }
.role-super-admin, .role-admin { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
}

.status-pill .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.pill-active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.pill-active .status-dot { background: #10b981; }
.pill-inactive { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.pill-inactive .status-dot { background: #ef4444; }
.pill-warn { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.pill-warn .status-dot { background: #f59e0b; }

/* PAGINATION */
.admin-pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 14px;
}

.pagination-info {
  font-size: 12px;
  color: #64748b;
}

.pagination-buttons {
  display: flex;
  gap: 6px;
}

.btn-page-nav, .btn-page-num {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.15);
  color: #cbd5e1;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.btn-page-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-page-num.active {
  background: rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.6);
  color: #38bdf8;
  font-weight: 700;
}

/* AI HEALTH VIEW STYLES */
.models-status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.model-status-card {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 10px;
  padding: 18px;
}

.model-status-card.primary {
  border-color: rgba(6, 182, 212, 0.35);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.08);
}

.model-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.model-badge-primary {
  background: rgba(6, 182, 212, 0.15);
  color: #38bdf8;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.model-badge-fallback {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-live-tag {
  color: #10b981;
  font-size: 11px;
  font-weight: 600;
}

.status-standby-tag {
  color: #94a3b8;
  font-size: 11px;
}

.model-name {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 10px 0 4px 0;
}

.model-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}

.model-meta-stats {
  display: flex;
  gap: 16px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 12px;
  color: #64748b;
}

.model-meta-stats strong {
  color: #ffffff;
}

.ai-detailed-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.ai-metric-box {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 8px;
  padding: 16px;
}

.metric-title {
  font-size: 12px;
  color: #94a3b8;
}

.metric-val {
  font-size: 26px;
  font-weight: 800;
  color: #ffffff;
  margin: 6px 0 2px 0;
}

.metric-sub {
  font-size: 10px;
  color: #64748b;
}

.ai-breakdown-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.breakdown-card {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 8px;
  padding: 16px;
}

.breakdown-title {
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
}

.status-bar-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-bar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar-lbl-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #cbd5e1;
}

.bar-lbl-row code {
  color: #38bdf8;
  font-family: monospace;
}

.mini-bar-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  overflow: hidden;
}

.mini-bar-fill {
  height: 100%;
  border-radius: 999px;
}

/* TEST CONSOLE */
.ai-console-badge {
  background: rgba(168, 85, 247, 0.15);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.prompt-chips-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chips-title {
  font-size: 12px;
  color: #64748b;
}

.prompt-chip-btn {
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: #cbd5e1;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.prompt-chip-btn:hover {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
}

.console-input-wrap {
  display: flex;
  gap: 12px;
}

.console-textarea {
  flex: 1;
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  padding: 12px;
  color: #ffffff;
  font-size: 13px;
  outline: none;
  resize: vertical;
}

.console-textarea:focus {
  border-color: #38bdf8;
}

.btn-run-test {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #0284c7, #06b6d4);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-run-test:hover:not(:disabled) {
  opacity: 0.9;
}

.console-output-box {
  background: #060b13;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  padding: 14px;
}

.output-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.output-tags {
  display: flex;
  gap: 8px;
}

.output-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}

.tag-status-200 { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.tag-model { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
.tag-latency { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }

.btn-copy-json {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-copy-json:hover {
  color: #38bdf8;
}

.json-code-viewer {
  color: #38bdf8;
  font-family: monospace;
  font-size: 12px;
  max-height: 250px;
  overflow-y: auto;
  line-height: 1.5;
}

/* LIVE PULSE BADGE */
.live-pulse-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
}

.pulse-ring {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.font-mono {
  font-family: monospace;
}

.model-tag-mini {
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.status-code-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.code-ok { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.code-warn { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }

/* REPORTS HUB VIEW */
.reports-filter-tabs {
  display: flex;
  gap: 8px;
}

.report-tab-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #94a3b8;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.report-tab-btn:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.report-tab-btn.active {
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.6);
  color: #38bdf8;
  font-weight: 600;
}

.tab-count-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
}

.badge-red { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.badge-amber { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.badge-green { background: rgba(16, 185, 129, 0.2); color: #10b981; }

.report-type-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}

.chip-property { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
.chip-agent { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.chip-user { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

.parties-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.complainant-name {
  color: #cbd5e1;
}

.target-name {
  color: #f1f5f9;
}

.rep-date-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

/* SETTINGS VIEW */
.accuracy-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.vibe-metrics-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.vibe-metric-box {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.vibe-icon-wrap {
  font-size: 20px;
  margin-bottom: 8px;
}

.vibe-title {
  font-size: 12px;
  color: #94a3b8;
}

.vibe-value {
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  margin: 4px 0 8px 0;
}

.settings-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.settings-form-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.setting-lbl {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
  display: block;
}

.setting-hint {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.admin-select {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.2);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
}

/* TOGGLE SWITCH */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1e293b;
  transition: 0.3s;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

.theme-badge-current {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  color: #f1f5f9;
}

/* COST CARDS */
.cost-total-badge {
  font-size: 13px;
  color: #94a3b8;
}

.cost-total-badge strong {
  color: #10b981;
}

.cost-items-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.cost-card {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 8px;
  padding: 16px;
}

.cost-type {
  font-size: 12px;
  color: #94a3b8;
}

.cost-amount {
  font-size: 24px;
  font-weight: 800;
  margin: 6px 0 2px 0;
}

.cost-desc {
  font-size: 11px;
  color: #64748b;
}

.sources-sync-row {
  display: flex;
  gap: 20px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 12px;
  color: #94a3b8;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.source-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.source-status-dot.online {
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

/* PROPERTY VIBE MATCH */
.vibe-match-zones-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vibe-zone-card {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 8px;
  padding: 12px;
}

.zone-head {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #ffffff;
}

.zone-match-bar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11px;
  color: #94a3b8;
}

/* BROADCAST FORM */
.broadcast-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-field-admin {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field-admin label {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}

.admin-form-input {
  background: #091220;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: #ffffff;
  font-size: 13px;
  outline: none;
}

.admin-form-input:focus {
  border-color: #38bdf8;
}

.btn-admin-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0284c7, #06b6d4);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-admin-primary:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-admin-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* MODALS */
.admin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.admin-modal-box {
  background: #0b172a;
  border: 1px solid rgba(56, 189, 248, 0.3);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
}

.modal-header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 14px;
}

.modal-header-line h3 {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.btn-modal-close {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
}

.user-modal-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.modal-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  overflow: hidden;
}

.modal-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-email {
  font-size: 12px;
  color: #64748b;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 13px;
}

.detail-lbl {
  color: #94a3b8;
}

.modal-footer-line {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 16px;
}

.btn-modal-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

/* UTILITIES */
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 14px; }
.mt-4 { margin-top: 22px; }
.mb-3 { margin-bottom: 14px; }
.gap-3 { gap: 12px; }
.flex-wrap { flex-wrap: wrap; }

.fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.admin-empty-clean {
  text-align: center;
  padding: 36px 20px;
  color: #64748b;
}

.admin-empty-clean i {
  font-size: 32px;
  margin-bottom: 10px;
  opacity: 0.5;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .admin-kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .admin-middle-grid,
  .settings-two-columns,
  .models-status-grid,
  .ai-breakdown-row {
    grid-template-columns: 1fr;
  }
  .ai-detailed-grid,
  .cost-items-grid,
  .vibe-metrics-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.admin-mobile-toggle,
.admin-mobile-close-btn,
.admin-sidebar-backdrop {
  display: none;
}

.top-bar-left-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 900px) {
  .admin-mobile-toggle {
    display: inline-flex !important;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    background: rgba(6, 182, 212, 0.16);
    border: 1.5px solid rgba(6, 182, 212, 0.45);
    border-radius: 10px;
    color: #06b6d4;
    font-weight: 700;
    font-size: 0.88rem;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(6, 182, 212, 0.2);
    transition: all 0.2s ease;
  }
  .admin-mobile-toggle:hover {
    background: rgba(6, 182, 212, 0.28);
    border-color: #06b6d4;
    color: #ffffff;
  }
  .admin-mobile-close-btn {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    cursor: pointer;
  }
  .admin-sidebar {
    position: fixed !important;
    top: 0;
    bottom: 0;
    right: 0;
    width: 280px !important;
    max-width: 82vw;
    z-index: 99999;
    transform: translateX(110%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: -10px 0 35px rgba(0, 0, 0, 0.6);
    max-height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
    overflow-y: auto;
  }
  [dir="ltr"] .admin-sidebar {
    right: auto;
    left: 0;
    transform: translateX(-110%);
    box-shadow: 10px 0 35px rgba(0, 0, 0, 0.6);
  }
  .admin-sidebar.mobile-open {
    transform: translateX(0) !important;
  }
  .admin-sidebar-backdrop {
    display: block !important;
    position: fixed;
    inset: 0;
    background: rgba(11, 19, 41, 0.75);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 99998;
  }
  .admin-main-viewport {
    margin-right: 0 !important;
    margin-left: 0 !important;
    width: 100% !important;
    padding: 16px 14px;
  }
  .admin-top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .top-actions-group {
    width: 100%;
    flex-wrap: wrap;
  }
  .admin-search-wrap {
    flex: 1;
    min-width: 200px;
  }
  .admin-kpi-row {
    grid-template-columns: 1fr;
  }
}
/* =========================================================================
   LIGHT THEME PALETTE FOR ADMIN PANEL (When .light-theme is active)
   ========================================================================= */
.admin-shell.light-theme {
  background-color: #f8fafc;
  color: #0f172a;
}

.admin-shell.light-theme .admin-sidebar {
  background: #ffffff;
  border-color: rgba(2, 132, 199, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.admin-shell.light-theme .brand-white {
  color: #0f172a;
}

.admin-shell.light-theme .admin-nav-item {
  color: #475569;
}

.admin-shell.light-theme .admin-nav-item:hover {
  background: rgba(2, 132, 199, 0.06);
  color: #0284c7;
}

.admin-shell.light-theme .admin-nav-item.active {
  background: rgba(2, 132, 199, 0.12);
  border-color: #0284c7;
  color: #0284c7;
  box-shadow: 0 0 12px rgba(2, 132, 199, 0.15);
}

.admin-shell.light-theme .page-title {
  color: #0f172a;
}

.admin-shell.light-theme .admin-glass-panel,
.admin-shell.light-theme .admin-kpi-card {
  background: #ffffff;
  border-color: rgba(2, 132, 199, 0.15);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05);
  color: #0f172a;
}

.admin-shell.light-theme .panel-title,
.admin-shell.light-theme .kpi-metric-number,
.admin-shell.light-theme .model-name,
.admin-shell.light-theme .breakdown-title,
.admin-shell.light-theme .vibe-value,
.admin-shell.light-theme .setting-lbl,
.admin-shell.light-theme .zone-head strong,
.admin-shell.light-theme .modal-header-line h3,
.admin-shell.light-theme .user-modal-header h4,
.admin-shell.light-theme .property-modal-summary h4,
.admin-shell.light-theme .report-detail-card h4,
.admin-shell.light-theme .report-subject-text {
  color: #0f172a;
}

.admin-shell.light-theme .admin-search-wrap,
.admin-shell.light-theme .admin-subsearch-input-wrap,
.admin-shell.light-theme .admin-form-input,
.admin-shell.light-theme .admin-select,
.admin-shell.light-theme .console-textarea {
  background: #f8fafc;
  border-color: rgba(2, 132, 199, 0.25);
  color: #0f172a;
}

.admin-shell.light-theme .admin-search-input,
.admin-shell.light-theme .admin-subsearch-input {
  color: #0f172a;
}

.admin-shell.light-theme .admin-search-input::placeholder,
.admin-shell.light-theme .admin-subsearch-input::placeholder {
  color: #94a3b8;
}

.admin-shell.light-theme .admin-data-table td {
  color: #334155;
  border-bottom-color: rgba(0, 0, 0, 0.06);
}

.admin-shell.light-theme .admin-data-table th {
  color: #64748b;
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.admin-shell.light-theme .admin-data-table tbody tr:hover {
  background: rgba(2, 132, 199, 0.03);
}

.admin-shell.light-theme .report-strip-item,
.admin-shell.light-theme .ai-mini-stat-card,
.admin-shell.light-theme .model-status-card,
.admin-shell.light-theme .ai-metric-box,
.admin-shell.light-theme .breakdown-card,
.admin-shell.light-theme .vibe-metric-box,
.admin-shell.light-theme .cost-card,
.admin-shell.light-theme .vibe-zone-card,
.admin-shell.light-theme .admin-modal-box {
  background: #ffffff;
  border-color: rgba(2, 132, 199, 0.18);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.admin-shell.light-theme .ai-stat-val,
.admin-shell.light-theme .metric-val {
  color: #0f172a;
}

.admin-shell.light-theme .console-output-box {
  background: #f8fafc;
  border-color: rgba(2, 132, 199, 0.2);
}

.admin-shell.light-theme .json-code-viewer {
  color: #0284c7;
}

.admin-shell.light-theme .filter-pill-btn,
.admin-shell.light-theme .report-tab-btn,
.admin-shell.light-theme .btn-page-nav,
.admin-shell.light-theme .btn-page-num {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.1);
  color: #475569;
}

.admin-shell.light-theme .filter-pill-btn:hover,
.admin-shell.light-theme .report-tab-btn:hover {
  background: rgba(2, 132, 199, 0.06);
  color: #0284c7;
}

.admin-shell.light-theme .filter-pill-btn.active,
.admin-shell.light-theme .report-tab-btn.active {
  background: rgba(2, 132, 199, 0.12);
  border-color: #0284c7;
  color: #0284c7;
}

.admin-shell.light-theme .admin-user-pill {
  background: #f8fafc;
  border-color: rgba(0, 0, 0, 0.06);
}

.admin-shell.light-theme .admin-email {
  color: #0f172a;
}

.admin-shell.light-theme .btn-return-site {
  background: #f8fafc;
  border-color: rgba(0, 0, 0, 0.1);
  color: #334155;
}

.admin-shell.light-theme .btn-return-site:hover {
  background: rgba(2, 132, 199, 0.1);
  color: #0284c7;
}

.admin-shell.light-theme .admin-ctrl-btn {
  background: #ffffff;
  border-color: rgba(2, 132, 199, 0.25);
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.admin-shell.light-theme .admin-ctrl-btn:hover {
  background: rgba(2, 132, 199, 0.08);
  border-color: #0284c7;
  color: #0284c7;
}

.admin-shell.light-theme .sidebar-ctrl-btn {
  background: #f8fafc;
  border-color: rgba(0, 0, 0, 0.1);
  color: #334155;
}

.admin-shell.light-theme .sidebar-ctrl-btn:hover {
  background: rgba(2, 132, 199, 0.08);
  border-color: #0284c7;
  color: #0284c7;
}
</style>
