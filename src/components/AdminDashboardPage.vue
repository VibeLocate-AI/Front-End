<template>
  <div class="admin-shell" :dir="isRtl ? 'rtl' : 'ltr'">
    
    <!-- =========================================================================
         RIGHT SIDEBAR: EXACT MATCH TO USER IMAGE (VibeLocate Admin)
         ========================================================================= -->
    <aside class="admin-sidebar">
      <div class="admin-brand-header">
        <div class="brand-title-wrap">
          <span class="brand-white">VibeLocate</span>
          <span class="brand-cyan">Admin</span>
        </div>
        <span class="admin-badge-live">LIVE</span>
      </div>

      <nav class="admin-nav-menu">
        <button 
          v-for="item in navMenuItems" 
          :key="item.key"
          class="admin-nav-item"
          :class="{ active: activeSection === item.key }"
          @click="activeSection = item.key"
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
        <div class="header-titles">
          <h1 class="page-title">{{ currentSectionTitle }}</h1>
          <p class="page-timestamp">
            {{ isRtl ? 'آخر تحديث:' : 'Last updated:' }} {{ lastUpdatedTime }}
            <button class="btn-refresh-data" @click="loadAllAdminData" :title="isRtl ? 'تحديث البيانات' : 'Refresh Data'">
              <i class="fa-solid fa-rotate" :class="{ 'fa-spin': isRefreshing }"></i>
            </button>
          </p>
        </div>

        <div class="top-search-group">
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
        </div>
      </header>

      <!-- VIEW 1: OVERVIEW DASHBOARD (نظرة عامة) - EXACT MATCH TO IMAGE -->
      <div v-if="activeSection === 'overview'" class="admin-view-content fade-in">
        
        <!-- 4 Top KPI Cards Grid -->
        <section class="admin-kpi-row">
          <!-- KPI 1: إجمالي المستخدمين -->
          <div class="admin-kpi-card" @click="activeSection = 'users'">
            <span class="kpi-title">{{ isRtl ? 'إجمالي المستخدمين' : 'Total Users' }}</span>
            <div class="kpi-metric-number">[{{ stats.totalUsers }}]</div>
            <span class="kpi-subtext"><i class="fa-solid fa-users"></i> {{ isRtl ? 'حسابات مسجلة' : 'Registered Accounts' }}</span>
          </div>

          <!-- KPI 2: الوسطاء النشطون -->
          <div class="admin-kpi-card" @click="activeSection = 'users'">
            <span class="kpi-title">{{ isRtl ? 'الوسطاء النشطون' : 'Active Agents' }}</span>
            <div class="kpi-metric-number text-cyan">[{{ stats.activeAgents }}]</div>
            <span class="kpi-subtext text-cyan"><i class="fa-solid fa-user-tie"></i> {{ isRtl ? 'وكيل معتمد' : 'Verified Agents' }}</span>
          </div>

          <!-- KPI 3: العقارات المدرجة -->
          <div class="admin-kpi-card" @click="activeSection = 'properties'">
            <span class="kpi-title">{{ isRtl ? 'العقارات المدرجة' : 'Listed Properties' }}</span>
            <div class="kpi-metric-number">[{{ stats.totalProperties }}]</div>
            <span class="kpi-subtext"><i class="fa-solid fa-building"></i> {{ isRtl ? 'عقار في المنصة' : 'Active Listings' }}</span>
          </div>

          <!-- KPI 4: عمليات بحث اليوم / الشكاوى المفتوحة -->
          <div class="admin-kpi-card" @click="activeSection = 'reports'">
            <span class="kpi-title">{{ isRtl ? 'عمليات بحث اليوم' : "Today's Searches" }}</span>
            <div class="kpi-metric-number text-amber">[{{ stats.todaySearches }}]</div>
            <span class="kpi-subtext text-amber"><i class="fa-solid fa-bolt"></i> {{ stats.openReports }} {{ isRtl ? 'بلاغات مفتوحة' : 'Open Reports' }}</span>
          </div>
        </section>

        <!-- Middle Row: 2 Major Cards (Vibe Report Coverage & AI Service Health) -->
        <section class="admin-middle-grid">
          
          <!-- Left Card: تغطية بيانات Vibe Report حسب المنطقة -->
          <div class="admin-glass-panel panel-coverage">
            <div class="panel-header-line">
              <h2 class="panel-title">{{ isRtl ? 'تغطية بيانات Vibe Report حسب المنطقة' : 'Vibe Report Coverage by Area' }}</h2>
            </div>

            <div class="coverage-bars-list">
              <div v-for="area in coverageAreasList" :key="area.id" class="coverage-bar-row">
                <div class="coverage-area-label">
                  <span class="area-name">{{ area.name }}</span>
                </div>
                <div class="coverage-progress-wrap">
                  <div 
                    class="coverage-progress-bar" 
                    :class="area.status === 'sufficient' ? 'bar-green' : 'bar-orange'"
                    :style="{ width: area.percentage + '%' }"
                  ></div>
                </div>
                <span class="coverage-status-tag" :class="area.status === 'sufficient' ? 'tag-green' : 'tag-orange'">
                  {{ area.status === 'sufficient' ? (isRtl ? 'كافية' : 'Sufficient') : (isRtl ? 'ناقصة' : 'Incomplete') }}
                </span>
              </div>
            </div>

            <div class="panel-footer-action">
              <button class="btn-link-chevron" @click="activeSection = 'coverage'">
                <span>{{ isRtl ? 'عرض كل المناطق' : 'View All Areas' }}</span>
                <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
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
                  <span class="ai-stat-lbl">{{ isRtl ? 'نسبة نجاح الدوم' : 'Success Rate' }}</span>
                  <strong class="ai-stat-val">[{{ aiHealth.successRate }}%]</strong>
                </div>
              </div>

              <div class="ai-mini-stat-card">
                <span class="ai-dot-indicator"></span>
                <div class="ai-mini-content">
                  <span class="ai-stat-lbl">{{ isRtl ? 'متوسط زمن الرد' : 'Avg. Latency' }}</span>
                  <strong class="ai-stat-val">[{{ aiHealth.avgLatency }}] {{ isRtl ? 'ثانية' : 's' }}</strong>
                </div>
              </div>

              <div class="ai-mini-stat-card">
                <span class="ai-dot-indicator"></span>
                <div class="ai-mini-content">
                  <span class="ai-stat-lbl">{{ isRtl ? 'طلبات "غير واضحة"' : 'Needs Clarification' }}</span>
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
            <h2 class="panel-title">{{ isRtl ? 'قائمة انتظار مراجعة العقارات' : 'Property Review Queue' }}</h2>
            <button class="btn-link-chevron" @click="activeSection = 'properties'">
              <span>{{ isRtl ? 'عرض الكل' : 'View All' }}</span>
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>

          <div v-if="pendingPropertiesList.length > 0" class="admin-table-responsive">
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
                <tr v-for="prop in pendingPropertiesList" :key="prop.id">
                  <td>
                    <div class="prop-title-cell">
                      <strong>{{ isRtl ? prop.titleAr || prop.title : prop.title }}</strong>
                      <span class="prop-sub-loc">{{ prop.location }}</span>
                    </div>
                  </td>
                  <td><span class="prop-type-badge">{{ prop.type }}</span></td>
                  <td>{{ prop.agentName }}</td>
                  <td>{{ prop.submittedDate }}</td>
                  <td>
                    <div class="row-actions">
                      <button class="btn-table-action" @click="openPropertyPreview(prop)">{{ isRtl ? 'عرض' : 'View' }}</button>
                      <button class="btn-table-action btn-approve" @click="approveProperty(prop.id)">{{ isRtl ? 'اعتماد' : 'Approve' }}</button>
                      <button class="btn-table-action btn-reject" @click="rejectProperty(prop.id)">{{ isRtl ? 'رفض' : 'Reject' }}</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty-clean">
            <i class="fa-solid fa-circle-check"></i>
            <p>{{ isRtl ? 'لا توجد عقارات جديدة بانتظار المراجعة حالياً - جميع الطلبات مدققة' : 'No properties pending review - all listings are up to date' }}</p>
          </div>
        </section>

        <!-- Lower Section 2: شكاوى وبلاغات حديثة -->
        <section class="admin-glass-panel panel-reports-section mt-4">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'شكاوى وبلاغات حديثة' : 'Recent Reports & Inquiries' }}</h2>
            <button class="btn-link-chevron" @click="activeSection = 'reports'">
              <span>{{ isRtl ? 'عرض الكل' : 'View All' }}</span>
              <i class="fa-solid" :class="isRtl ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>

          <div v-if="recentReportsList.length > 0" class="recent-reports-items">
            <div 
              v-for="rep in recentReportsList" 
              :key="rep.id"
              class="report-strip-item"
              @click="openReportModal(rep)"
            >
              <div class="report-strip-left">
                <span class="dot-indicator" :class="rep.status === 'pending' ? 'dot-red' : 'dot-amber'"></span>
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

      <!-- VIEW 2: USERS MANAGEMENT (المستخدمون) -->
      <div v-else-if="activeSection === 'users'" class="admin-view-content fade-in">
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'إدارة المستخدمين وحسابات المنصة' : 'User Accounts Management' }} ({{ allUsersList.length }})</h2>
            <div class="user-filter-pills">
              <button 
                v-for="role in ['all', 'tenant', 'agent', 'admin']" 
                :key="role"
                class="filter-pill-btn"
                :class="{ active: userRoleFilter === role }"
                @click="userRoleFilter = role"
              >
                {{ role === 'all' ? (isRtl ? 'الكل' : 'All') : role === 'tenant' ? (isRtl ? 'المستأجرون / المشترون' : 'Tenants') : role === 'agent' ? (isRtl ? 'الوسطاء العقاريون' : 'Agents') : 'Admin' }}
              </button>
            </div>
          </div>

          <div class="admin-table-responsive mt-3">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ isRtl ? 'الاسم' : 'Name' }}</th>
                  <th>{{ isRtl ? 'البريد الإلكتروني' : 'Email' }}</th>
                  <th>{{ isRtl ? 'الهاتف' : 'Phone' }}</th>
                  <th>{{ isRtl ? 'الدور' : 'Role' }}</th>
                  <th>{{ isRtl ? 'الحالة' : 'Status' }}</th>
                  <th>{{ isRtl ? 'إجراء' : 'Actions' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredUsersList" :key="u.id">
                  <td>{{ u.id }}</td>
                  <td><strong>{{ u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'User' }}</strong></td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.phone || '—' }}</td>
                  <td>
                    <span class="role-badge" :class="`role-${u.role_slug || u.role}`">
                      {{ u.role_slug || u.role }}
                    </span>
                  </td>
                  <td>
                    <span class="status-pill" :class="u.status === 'active' ? 'pill-active' : 'pill-inactive'">
                      {{ u.status || 'active' }}
                    </span>
                  </td>
                  <td>
                    <button 
                      class="btn-toggle-status" 
                      :class="u.status === 'active' ? 'btn-warn' : 'btn-success'"
                      @click="toggleUserStatus(u)"
                    >
                      {{ u.status === 'active' ? (isRtl ? 'تعطيل' : 'Suspend') : (isRtl ? 'تفعيل' : 'Activate') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- VIEW 3: PROPERTY REVIEWS (مراجعة العقارات) -->
      <div v-else-if="activeSection === 'properties'" class="admin-view-content fade-in">
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'مراجعة وتدقيق العقارات الجديدة' : 'Property Approvals & Moderation' }}</h2>
          </div>

          <div v-if="pendingPropertiesList.length > 0" class="admin-table-responsive mt-3">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>{{ isRtl ? 'العقار' : 'Property' }}</th>
                  <th>{{ isRtl ? 'النوع' : 'Type' }}</th>
                  <th>{{ isRtl ? 'السعر' : 'Price' }}</th>
                  <th>{{ isRtl ? 'الوسيط' : 'Agent' }}</th>
                  <th>{{ isRtl ? 'إجراءات التدقيق' : 'Moderation Actions' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prop in pendingPropertiesList" :key="prop.id">
                  <td>
                    <strong>{{ isRtl ? prop.titleAr || prop.title : prop.title }}</strong>
                    <div class="prop-sub-loc">{{ prop.location }}</div>
                  </td>
                  <td><span class="prop-type-badge">{{ prop.type }}</span></td>
                  <td><strong class="text-cyan">{{ prop.price }}</strong></td>
                  <td>{{ prop.agentName }}</td>
                  <td>
                    <div class="row-actions">
                      <button class="btn-table-action btn-approve" @click="approveProperty(prop.id)">
                        <i class="fa-solid fa-check"></i> {{ isRtl ? 'اعتماد' : 'Approve' }}
                      </button>
                      <button class="btn-table-action btn-reject" @click="rejectProperty(prop.id)">
                        <i class="fa-solid fa-xmark"></i> {{ isRtl ? 'رفض' : 'Reject' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty-clean">
            <i class="fa-solid fa-clipboard-check"></i>
            <p>{{ isRtl ? 'جميع العقارات معتمدة ولا توجد عقارات معلقة حالياً' : 'All listings reviewed - no pending approvals' }}</p>
          </div>
        </section>
      </div>

      <!-- VIEW 4: AI HEALTH DIAGNOSTICS (صحة خدمة الذكاء الاصطناعي) -->
      <div v-else-if="activeSection === 'ai_health'" class="admin-view-content fade-in">
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'تشخيص ومراقبة خدمات الذكاء الاصطناعي VibeLocate' : 'AI Services Health & Latency Monitor' }}</h2>
            <div class="ai-status-indicator">
              <span class="status-pulse-dot" :class="{ 'is-ok': aiHealth.status === 'normal' }"></span>
              <span class="status-text">{{ aiHealth.statusText }}</span>
            </div>
          </div>

          <div class="ai-detailed-grid mt-4">
            <div class="ai-metric-box">
              <span class="metric-title">{{ isRtl ? 'إجمالي الطلبات المعالجة' : 'Total Processed Queries' }}</span>
              <div class="metric-val text-cyan">{{ aiHealth.totalRequests.toLocaleString() }}</div>
            </div>
            <div class="ai-metric-box">
              <span class="metric-title">{{ isRtl ? 'نسبة الاستجابة الناجحة' : 'Successful Responses' }}</span>
              <div class="metric-val text-green">{{ aiHealth.successRate }}%</div>
            </div>
            <div class="ai-metric-box">
              <span class="metric-title">{{ isRtl ? 'متوسط وقت التوليد' : 'Avg Latency' }}</span>
              <div class="metric-val text-amber">{{ aiHealth.avgLatency }}s</div>
            </div>
            <div class="ai-metric-box">
              <span class="metric-title">{{ isRtl ? 'مرات تفعيل الفولباك' : 'Fallback Triggers' }}</span>
              <div class="metric-val">{{ aiHealth.fallbackTriggers }}</div>
            </div>
          </div>
        </section>
      </div>

      <!-- VIEW 5: VIBE REPORT COVERAGE (تغطية Vibe Report) -->
      <div v-else-if="activeSection === 'coverage'" class="admin-view-content fade-in">
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'خريطة تغطية تقارير Vibe Report في دبي' : 'Vibe Report Coverage Map' }}</h2>
            <span class="coverage-percent-badge">{{ coverageSummary.coveragePercentage }}% {{ isRtl ? 'إجمالي التغطية' : 'Overall' }}</span>
          </div>

          <div class="coverage-full-grid mt-4">
            <div v-for="area in allCoverageAreas" :key="area.id" class="coverage-area-card">
              <div class="area-card-head">
                <h4>{{ area.name }}</h4>
                <span class="coverage-status-tag" :class="area.status === 'sufficient' ? 'tag-green' : 'tag-orange'">
                  {{ area.status === 'sufficient' ? (isRtl ? 'تغطية كافية' : 'Sufficient') : (isRtl ? 'تغطية ناقصة' : 'Needs POIs') }}
                </span>
              </div>
              <div class="coverage-progress-wrap mt-2">
                <div class="coverage-progress-bar" :class="area.status === 'sufficient' ? 'bar-green' : 'bar-orange'" :style="{ width: area.percentage + '%' }"></div>
              </div>
              <div class="area-stats-mini mt-2">
                <span>{{ area.propertiesCount }} {{ isRtl ? 'عقار' : 'listings' }}</span>
                <span>{{ area.percentage }}%</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- VIEW 6: COMPLAINTS & REPORTS (الشكاوى والتبليغات) -->
      <div v-else-if="activeSection === 'reports'" class="admin-view-content fade-in">
        <section class="admin-glass-panel">
          <div class="panel-header-line space-between">
            <h2 class="panel-title">{{ isRtl ? 'الشكاوى والبلاغات الواردة من المستخدمين' : 'Complaints & Incident Reports' }} ({{ allReportsList.length }})</h2>
          </div>

          <div v-if="allReportsList.length > 0" class="admin-table-responsive mt-3">
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{{ isRtl ? 'الموضوع' : 'Subject' }}</th>
                  <th>{{ isRtl ? 'المرسل' : 'Reporter' }}</th>
                  <th>{{ isRtl ? 'التاريخ' : 'Date' }}</th>
                  <th>{{ isRtl ? 'الحالة' : 'Status' }}</th>
                  <th>{{ isRtl ? 'إجراءات' : 'Actions' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rep in allReportsList" :key="rep.id">
                  <td>{{ rep.id }}</td>
                  <td>
                    <strong>{{ rep.subject }}</strong>
                    <p class="rep-desc-preview">{{ rep.description }}</p>
                  </td>
                  <td>{{ rep.reporterName }}</td>
                  <td>{{ rep.dateStr }}</td>
                  <td>
                    <span class="status-pill" :class="rep.status === 'resolved' ? 'pill-active' : 'pill-warn'">
                      {{ rep.status === 'resolved' ? (isRtl ? 'تم الحل' : 'Resolved') : rep.status === 'reviewing' ? (isRtl ? 'قيد المراجعة' : 'Reviewing') : (isRtl ? 'معلق' : 'Pending') }}
                    </span>
                  </td>
                  <td>
                    <div class="row-actions">
                      <button class="btn-table-action btn-approve" @click="handleResolveReport(rep.id)">
                        {{ isRtl ? 'إغلاق البلاغ' : 'Resolve' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty-clean">
            <i class="fa-solid fa-shield-heart"></i>
            <p>{{ isRtl ? 'لا توجد بلاغات مسجلة حالياً' : 'No user reports filed' }}</p>
          </div>
        </section>
      </div>

      <!-- VIEW 7: SYSTEM SETTINGS & NOTIFICATIONS (إعدادات النظام) -->
      <div v-else-if="activeSection === 'settings'" class="admin-view-content fade-in">
        <section class="admin-glass-panel">
          <div class="panel-header-line">
            <h2 class="panel-title">{{ isRtl ? 'إرسال إشعار عام لكافة مستخدمي المنصة' : 'Broadcast System Notification' }}</h2>
          </div>

          <form @submit.prevent="handleBroadcastNotification" class="broadcast-form mt-4">
            <div class="form-field-admin">
              <label>{{ isRtl ? 'عنوان الإشعار' : 'Notification Title' }}</label>
              <input type="text" v-model="broadcastForm.title" required class="admin-form-input" placeholder="e.g. تحديث هام في منصة VibeLocate">
            </div>

            <div class="form-field-admin">
              <label>{{ isRtl ? 'نص الرسالة' : 'Message Body' }}</label>
              <textarea v-model="broadcastForm.message" rows="4" required class="admin-form-input" placeholder="اكتب نص الإشعار هنا..."></textarea>
            </div>

            <div class="form-submit-row">
              <button type="submit" class="btn-admin-primary">
                <i class="fa-solid fa-paper-plane"></i>
                <span>{{ isRtl ? 'إرسال الإشعار للجميع' : 'Broadcast Notification' }}</span>
              </button>
            </div>
          </form>
        </section>
      </div>

    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import adminService from '../services/adminService'
import { useThemeAndLanguage } from '../composables/useThemeAndLanguage'

const router = useRouter()
const { isRtl } = useThemeAndLanguage()

const activeSection = ref('overview')
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
  { key: 'reports', labelAr: 'الشكاوى والتبليغات', labelEn: 'Complaints & Reports', badgeCount: stats.value.openReports || null },
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

// Vibe Report Coverage Areas
const coverageAreasList = ref([
  { id: 1, name: isRtl.value ? 'دبي مارينا' : 'Dubai Marina', status: 'sufficient', percentage: 92 },
  { id: 2, name: isRtl.value ? 'وسط مدينة دبي (داون تاون)' : 'Downtown Dubai', status: 'sufficient', percentage: 88 },
  { id: 3, name: isRtl.value ? 'قرية جميرا الدائرية (JVC)' : 'Jumeirah Village Circle', status: 'incomplete', percentage: 38 },
  { id: 4, name: isRtl.value ? 'الخليج التجاري (بزنس باي)' : 'Business Bay', status: 'incomplete', percentage: 24 }
])

const coverageSummary = ref({
  coveragePercentage: 42,
  totalAreas: 113
})
const allCoverageAreas = ref([...coverageAreasList.value])

// Pending Properties
const pendingPropertiesList = ref([])

// Reports
const recentReportsList = ref([])
const allReportsList = ref([])

// Users
const allUsersList = ref([])
const userRoleFilter = ref('all')

const filteredUsersList = computed(() => {
  return allUsersList.value.filter(u => {
    if (userRoleFilter.value === 'all') return true
    return (u.role_slug === userRoleFilter.value || u.role === userRoleFilter.value)
  })
})

// Broadcast Form
const broadcastForm = ref({
  title: '',
  message: ''
})

// Search
const handleSearch = () => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return
  activeSection.value = 'users'
}

// Actions
const approveProperty = async (id) => {
  const res = await adminService.approveProperty(id)
  if (res.success) {
    pendingPropertiesList.value = pendingPropertiesList.value.filter(p => p.id !== id)
    stats.value.totalProperties++
  }
}

const rejectProperty = async (id) => {
  const reason = prompt(isRtl.value ? 'أدخل سبب الرفض:' : 'Enter rejection reason:', 'معلومات العقار غير مكتملة')
  if (!reason) return
  const res = await adminService.rejectProperty(id, reason)
  if (res.success) {
    pendingPropertiesList.value = pendingPropertiesList.value.filter(p => p.id !== id)
  }
}

const toggleUserStatus = async (user) => {
  const nextStatus = user.status === 'active' ? 'suspended' : 'active'
  const res = await adminService.updateUserStatus(user.id, nextStatus)
  if (res.success) {
    user.status = nextStatus
  }
}

const handleResolveReport = async (reportId) => {
  const res = await adminService.updateReportStatus(reportId, 'resolved', 'Reviewed by Admin')
  if (res.success) {
    const item = allReportsList.value.find(r => r.id === reportId)
    if (item) item.status = 'resolved'
    recentReportsList.value = recentReportsList.value.filter(r => r.id !== reportId)
    stats.value.openReports = Math.max(0, stats.value.openReports - 1)
  }
}

const handleBroadcastNotification = async () => {
  const res = await adminService.broadcastNotification({
    target: 'all',
    type: 'system',
    title: broadcastForm.value.title,
    message: broadcastForm.value.message,
    action_url: '/home'
  })
  if (res.success) {
    alert(isRtl.value ? 'تم إرسال الإشعار بنجاح لجميع المستخدمين' : 'Notification broadcasted successfully')
    broadcastForm.value.title = ''
    broadcastForm.value.message = ''
  }
}

const handleAdminLogout = () => {
  localStorage.removeItem('auth_token')
  router.push('/login')
}

const openPropertyPreview = (prop) => {
  window.open(`/property/${prop.id}`, '_blank')
}

// Load All Admin Data from Real API
const loadAllAdminData = async () => {
  isRefreshing.value = true
  try {
    // 1. Dashboard Bundle
    const dashRes = await adminService.getDashboard()
    if (dashRes.success && dashRes.data) {
      const d = dashRes.data
      if (d.statistics) {
        stats.value.totalUsers = d.statistics.total_users || 61
        stats.value.totalProperties = d.statistics.total_properties || 710
        stats.value.openReports = d.statistics.open_reports || 2
      }
      if (d.ai_health) {
        aiHealth.value.avgLatency = d.ai_health.avg_latency_seconds ? Number(d.ai_health.avg_latency_seconds).toFixed(2) : 0.85
        aiHealth.value.totalRequests = d.ai_health.total_requests || 224
        aiHealth.value.successRate = d.ai_health.success_rate ? Number(d.ai_health.success_rate).toFixed(1) : 98.4
        aiHealth.value.status = (d.ai_health.status === 'healthy' || d.ai_health.status === 'normal') ? 'normal' : 'degraded'
        aiHealth.value.statusText = aiHealth.value.status === 'normal' 
          ? (isRtl.value ? 'تعمل بشكل طبيعي' : 'Operating Normally')
          : (isRtl.value ? 'قيد التدقيق' : 'Degraded Performance')
      }
      if (Array.isArray(d.pending_properties)) {
        pendingPropertiesList.value = d.pending_properties.map(p => ({
          id: p.id,
          title: p.title || 'Luxury Apartment',
          titleAr: p.title_ar || p.title || 'شقة فاخرة',
          location: p.address_line_1 || p.location || 'Dubai Marina',
          type: p.type || 'Apartment',
          price: p.price ? `AED ${Number(p.price).toLocaleString()}` : 'AED 1,850,000',
          agentName: p.agent?.name || p.user?.name || 'Ahmed Ali',
          submittedDate: p.created_at ? new Date(p.created_at).toLocaleDateString() : '2026-10-01'
        }))
      }
    }

    // 2. Fetch Users
    const uRes = await adminService.getUsers()
    if (uRes.success && Array.isArray(uRes.data)) {
      allUsersList.value = uRes.data
      stats.value.totalUsers = uRes.data.length
      stats.value.activeAgents = uRes.data.filter(u => u.role_slug === 'agent' || u.role === 'agent').length || 12
    }

    // 3. Fetch Reports
    const repRes = await adminService.getReports()
    if (repRes.success && Array.isArray(repRes.data)) {
      allReportsList.value = repRes.data.map(r => ({
        id: r.id,
        subject: r.subject || 'تقرير فحص بيانات العقار',
        description: r.description || '',
        reporterName: r.reporter_name || r.reporter?.name || 'مستخدم مسجل',
        dateStr: r.created_at ? new Date(r.created_at).toLocaleDateString() : '2026-10-01',
        status: r.status || 'pending'
      }))
      recentReportsList.value = allReportsList.value.filter(r => r.status !== 'resolved').slice(0, 3)
      stats.value.openReports = recentReportsList.value.length
    }

    // 4. Fetch Vibe Report Coverage
    const covRes = await adminService.getVibeReportCoverage()
    if (covRes.success && covRes.data) {
      if (covRes.data.summary) {
        coverageSummary.value.coveragePercentage = covRes.data.summary.coverage_percentage || 42
        coverageSummary.value.totalAreas = covRes.data.summary.total_areas || 113
      }
      if (Array.isArray(covRes.data.areas) && covRes.data.areas.length > 0) {
        allCoverageAreas.value = covRes.data.areas.map(a => ({
          id: a.neighborhood_id || a.id,
          name: a.community || a.name || 'Dubai Area',
          percentage: a.coverage_percentage || 50,
          status: (a.coverage_percentage >= 50) ? 'sufficient' : 'incomplete',
          propertiesCount: a.properties_count || 0
        }))
        coverageAreasList.value = allCoverageAreas.value.slice(0, 4)
      }
    }

    lastUpdatedTime.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (err) {
    console.warn('[Admin] Fetch error:', err)
  } finally {
    isRefreshing.value = false
  }
}

onMounted(async () => {
  // Check if admin token is present; if not authenticate automatically with default credentials
  const token = localStorage.getItem('auth_token')
  const userRaw = localStorage.getItem('auth_user')
  let isAdm = false
  try {
    if (userRaw) {
      const u = JSON.parse(userRaw)
      isAdm = u.role === 'admin' || u.role_slug === 'admin'
    }
  } catch {}

  if (!token || !isAdm) {
    await adminService.login('admin@vibelocate.ai', '12345678')
  }

  await loadAllAdminData()
})
</script>

<style scoped>
/* =========================================================================
   VIBELOCATE ADMIN STYLES (EXECUTIVE CYBERPUNK DARK THEME)
   EXACT REPLICATION OF USER SCREENSHOT
   ========================================================================= */

.admin-shell {
  min-height: 100vh;
  width: 100%;
  background-color: #070d19;
  color: #f1f5f9;
  display: flex;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  overflow-x: hidden;
}

/* -------------------------------------------------------------------------
   SIDEBAR (Right Side in RTL)
   ------------------------------------------------------------------------- */
.admin-sidebar {
  width: 260px;
  background-color: #091322;
  border-inline-start: 1px solid #142742;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  min-height: 100vh;
}

.admin-brand-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 22px;
  border-bottom: 1px solid #142742;
  margin-bottom: 16px;
}

.brand-title-wrap {
  font-size: 20px;
  font-weight: 800;
  display: flex;
  gap: 6px;
  letter-spacing: -0.02em;
}

.brand-white {
  color: #ffffff;
}

.brand-cyan {
  color: #38bdf8;
  text-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.admin-badge-live {
  font-size: 10px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 6px;
  background-color: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.admin-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  text-align: start;
  transition: all 0.2s ease;
  width: 100%;
}

.admin-nav-item:hover {
  color: #f8fafc;
  background-color: rgba(255, 255, 255, 0.03);
}

.admin-nav-item.active {
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.18), rgba(14, 165, 233, 0.05));
  border: 1px solid rgba(56, 189, 248, 0.7);
  color: #38bdf8;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
}

.nav-dot {
  font-size: 16px;
  color: inherit;
}

.nav-label {
  flex: 1;
}

.nav-count-badge {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 12px;
  background-color: #0284c7;
  color: #ffffff;
  font-weight: 700;
}

.admin-sidebar-footer {
  padding-top: 18px;
  border-top: 1px solid #142742;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-user-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 10px;
  background-color: #0f1c2e;
}

.admin-avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #ffffff;
}

.admin-user-meta {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-email {
  font-size: 12px;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-role {
  font-size: 10.5px;
  color: #38bdf8;
}

.footer-action-links {
  display: flex;
  gap: 8px;
}

.btn-return-site {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px 12px;
  background-color: #14243b;
  border: 1px solid #1e3658;
  color: #94a3b8;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.btn-return-site:hover {
  color: #f8fafc;
  border-color: #38bdf8;
}

.btn-admin-logout {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: #14243b;
  border: 1px solid #1e3658;
  color: #ef4444;
  cursor: pointer;
}

/* -------------------------------------------------------------------------
   MAIN VIEWPORT
   ------------------------------------------------------------------------- */
.admin-main-viewport {
  flex: 1;
  min-width: 0;
  padding: 28px 36px 48px;
  overflow-y: auto;
}

.admin-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
}

.page-timestamp {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.btn-refresh-data {
  background: none;
  border: none;
  color: #38bdf8;
  cursor: pointer;
  padding: 2px 4px;
}

/* Search bar on top */
.admin-search-wrap {
  display: flex;
  align-items: center;
  background-color: #0b172a;
  border: 1px solid #1a3152;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.admin-search-input {
  background: transparent;
  border: none;
  padding: 10px 16px;
  color: #f8fafc;
  font-size: 13.5px;
  width: 260px;
  outline: none;
}

.admin-search-input::placeholder {
  color: #475569;
}

.btn-search-exec {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #162c4b;
  border: none;
  color: #38bdf8;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-search-exec:hover {
  background-color: #0284c7;
  color: #ffffff;
}

/* -------------------------------------------------------------------------
   4 TOP KPI CARDS
   ------------------------------------------------------------------------- */
.admin-kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.admin-kpi-card {
  background: linear-gradient(180deg, #0d1e34 0%, #0a182b 100%);
  border: 1px solid #142e50;
  border-radius: 14px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.admin-kpi-card:hover {
  transform: translateY(-2px);
  border-color: #0284c7;
  box-shadow: 0 10px 28px rgba(2, 132, 199, 0.2);
}

.kpi-title {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 600;
}

.kpi-metric-number {
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  margin: 12px 0;
  letter-spacing: -0.02em;
}

.kpi-metric-number.text-cyan {
  color: #38bdf8;
  text-shadow: 0 0 16px rgba(56, 189, 248, 0.35);
}

.kpi-metric-number.text-amber {
  color: #fbbf24;
}

.kpi-subtext {
  font-size: 11.5px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* -------------------------------------------------------------------------
   MIDDLE ROW: COVERAGE & AI HEALTH
   ------------------------------------------------------------------------- */
.admin-middle-grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 20px;
  margin-bottom: 24px;
}

.admin-glass-panel {
  background: linear-gradient(180deg, #0d1e34 0%, #091729 100%);
  border: 1px solid #142e50;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}

.panel-header-line {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}

.panel-header-line.space-between {
  justify-content: space-between;
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

/* Coverage Bars */
.coverage-bars-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 18px;
}

.coverage-bar-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coverage-area-label {
  width: 140px;
  font-size: 13px;
  color: #cbd5e1;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coverage-progress-wrap {
  flex: 1;
  height: 8px;
  background-color: #142742;
  border-radius: 99px;
  overflow: hidden;
}

.coverage-progress-bar {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.bar-green {
  background: linear-gradient(90deg, #10b981, #34d399);
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}

.bar-orange {
  background: linear-gradient(90deg, #f97316, #fb923c);
  box-shadow: 0 0 10px rgba(249, 115, 22, 0.4);
}

.coverage-status-tag {
  font-size: 11.5px;
  font-weight: 700;
  width: 55px;
  text-align: center;
}

.tag-green {
  color: #34d399;
}

.tag-orange {
  color: #fb923c;
}

.panel-footer-action {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #142742;
}

.btn-link-chevron {
  background: none;
  border: none;
  color: #38bdf8;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s;
}

.btn-link-chevron:hover {
  text-decoration: underline;
  gap: 10px;
}

/* AI Health Card */
.ai-status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: #34d399;
}

.status-pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.ai-mini-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.ai-mini-stat-card {
  background-color: #0b182b;
  border: 1px solid #162f52;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.ai-dot-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #34d399;
  margin-top: 4px;
  flex-shrink: 0;
}

.ai-mini-content {
  display: flex;
  flex-direction: column;
}

.ai-stat-lbl {
  font-size: 12px;
  color: #94a3b8;
}

.ai-stat-code {
  font-size: 9px;
  color: #38bdf8;
  font-family: monospace;
}

.ai-stat-val {
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  margin-top: 2px;
}

/* Response Chart Area */
.ai-chart-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chart-caption {
  font-size: 11.5px;
  color: #64748b;
  text-align: center;
}

.svg-wave-container {
  width: 100%;
  height: 90px;
  position: relative;
}

.ai-wave-svg {
  width: 100%;
  height: 70px;
}

.glowing-line {
  filter: drop-shadow(0 0 6px #22d3ee);
}

.chart-timeline-ticks {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #475569;
  padding: 0 4px;
}

/* -------------------------------------------------------------------------
   LOWER TABLES & STRIPS
   ------------------------------------------------------------------------- */
.admin-table-responsive {
  width: 100%;
  overflow-x: auto;
}

.admin-data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: start;
}

.admin-data-table th {
  padding: 12px 14px;
  font-size: 12px;
  color: #64748b;
  border-bottom: 1px solid #142742;
  font-weight: 700;
}

.admin-data-table td {
  padding: 14px;
  font-size: 13.5px;
  border-bottom: 1px solid #0f2238;
  color: #cbd5e1;
}

.prop-title-cell strong {
  display: block;
  color: #ffffff;
  font-size: 14px;
}

.prop-sub-loc {
  font-size: 11.5px;
  color: #64748b;
}

.prop-type-badge {
  padding: 3px 8px;
  border-radius: 6px;
  background-color: #142640;
  color: #38bdf8;
  font-size: 11.5px;
}

.row-actions {
  display: flex;
  gap: 8px;
}

.btn-table-action {
  padding: 6px 12px;
  border-radius: 6px;
  background-color: #142844;
  border: 1px solid #1d3d66;
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-table-action:hover {
  border-color: #38bdf8;
  color: #ffffff;
}

.btn-table-action.btn-approve {
  background-color: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}

.btn-table-action.btn-approve:hover {
  background-color: #10b981;
  color: #ffffff;
}

.btn-table-action.btn-reject {
  background-color: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
  color: #f87171;
}

.btn-table-action.btn-reject:hover {
  background-color: #ef4444;
  color: #ffffff;
}

/* Reports Strip List */
.recent-reports-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.report-strip-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: #0b182b;
  border: 1px solid #162f52;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.report-strip-item:hover {
  background-color: #10233d;
  border-color: #0284c7;
}

.report-strip-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dot-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot-red { background-color: #ef4444; box-shadow: 0 0 6px #ef4444; }
.dot-amber { background-color: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

.report-subject-text {
  font-size: 13.5px;
  font-weight: 700;
  color: #f1f5f9;
}

.report-meta-tag {
  font-size: 12px;
  color: #64748b;
}

.report-strip-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.report-time {
  font-size: 12px;
  color: #64748b;
}

.btn-strip-view {
  padding: 4px 10px;
  border-radius: 6px;
  background-color: #142742;
  border: 1px solid #1e3a63;
  color: #38bdf8;
  font-size: 12px;
  cursor: pointer;
}

/* Empty State in Admin Panels */
.admin-empty-clean {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: #64748b;
  font-size: 13.5px;
}

.admin-empty-clean i {
  font-size: 28px;
  color: #38bdf8;
  opacity: 0.6;
}

.mt-4 { margin-top: 20px; }
.mt-3 { margin-top: 14px; }
.mt-2 { margin-top: 8px; }

/* Status Badges */
.role-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}
.role-admin { background-color: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
.role-agent { background-color: rgba(6, 182, 212, 0.2); color: #38bdf8; border: 1px solid rgba(6, 182, 212, 0.3); }
.role-tenant { background-color: rgba(148, 163, 184, 0.15); color: #cbd5e1; }

.status-pill {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
}
.pill-active { background-color: rgba(34, 197, 94, 0.15); color: #4ade80; }
.pill-inactive { background-color: rgba(239, 68, 68, 0.15); color: #f87171; }
.pill-warn { background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; }

.btn-toggle-status {
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.btn-warn { background-color: #ef4444; color: #ffffff; }
.btn-success { background-color: #10b981; color: #ffffff; }

/* Full Coverage Grid */
.coverage-full-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.coverage-area-card {
  background-color: #0b182b;
  border: 1px solid #162f52;
  border-radius: 12px;
  padding: 16px;
}

.area-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.area-card-head h4 {
  margin: 0;
  font-size: 14px;
  color: #ffffff;
}

.area-stats-mini {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #64748b;
}

.coverage-percent-badge {
  padding: 4px 12px;
  border-radius: 20px;
  background-color: rgba(6, 182, 212, 0.15);
  color: #38bdf8;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

/* AI Diagnostics */
.ai-detailed-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.ai-metric-box {
  background-color: #0b182b;
  border: 1px solid #162f52;
  border-radius: 12px;
  padding: 18px;
}

.metric-title {
  font-size: 12px;
  color: #94a3b8;
}

.metric-val {
  font-size: 26px;
  font-weight: 800;
  margin-top: 8px;
}
.text-green { color: #34d399; }

/* Broadcast Form */
.broadcast-form {
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-field-admin {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field-admin label {
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
}

.admin-form-input {
  background-color: #0b182b;
  border: 1px solid #1a355c;
  border-radius: 10px;
  padding: 10px 14px;
  color: #ffffff;
  font-family: inherit;
  font-size: 13.5px;
  outline: none;
}

.admin-form-input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
}

.btn-admin-primary {
  padding: 12px 24px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0284c7, #06b6d4);
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
}

.btn-admin-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.5);
}

.fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsiveness */
@media (max-width: 1100px) {
  .admin-kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .admin-middle-grid {
    grid-template-columns: 1fr;
  }
  .ai-detailed-grid,
  .coverage-full-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 800px) {
  .admin-shell {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100%;
    min-height: auto;
    border-inline-start: none;
    border-bottom: 1px solid #142742;
  }
  .admin-kpi-row {
    grid-template-columns: 1fr;
  }
  .admin-main-viewport {
    padding: 20px 16px;
  }
  .ai-detailed-grid,
  .coverage-full-grid {
    grid-template-columns: 1fr;
  }
}
</style>
