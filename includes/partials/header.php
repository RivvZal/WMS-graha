<header class="wms-header bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-3 shrink-0 z-20">
        <div class="header-start flex items-center gap-3 min-w-0">
          <button id="sidebarToggle" type="button" onclick="toggleSidebar()" class="p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 shrink-0" aria-label="Sembunyikan menu samping" aria-controls="appSidebar" aria-expanded="true" title="Tampilkan atau sembunyikan menu samping">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <span class="header-logo-frame"><img src="assets/images/graha-segara-logo.png?v=2" alt="Logo PT. Graha Segara" class="h-full w-full object-contain" /></span>
          <div class="header-page-context min-w-0">
            <div class="flex items-center gap-2">
              <h1 id="pageHeaderTitle" class="text-base sm:text-lg font-bold text-slate-900 truncate">Dashboard Operasional WMS</h1>
              <span id="activeHubBadge" class="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
                Semua Hub Nasional
              </span>
            </div>
            <p id="pageHeaderSubtitle" class="text-xs text-slate-500 truncate">PT. Graha Segara • Jl. Timor Raya No. 1, Koja, Tanjung Priok, Jakarta Utara</p>
          </div>
        </div>

        
        <div class="header-actions flex items-center gap-2 sm:gap-3">
          <div class="header-search relative hidden md:block w-60">
            <input id="globalQuickSearch" type="text" oninput="handleGlobalSearch(this.value)" placeholder="Cari SKU, barang, GRN, gudang..." class="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-500" />
            <svg class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <div id="globalSearchDropdown" class="hidden absolute right-0 left-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 max-h-72 overflow-y-auto z-50 p-1.5"></div>
          </div>

          <div class="header-menu-root">
            <button id="notificationToggle" type="button" onclick="toggleHeaderMenu('notificationMenu')" class="header-icon-button" aria-label="Buka notifikasi" aria-expanded="false" aria-controls="notificationMenu" title="Notifikasi">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>
              <span id="notificationBadge" class="notification-badge hidden"></span>
            </button>
            <div id="notificationMenu" class="header-dropdown hidden">
              <div class="header-dropdown-heading">
                <div>
                  <p class="font-semibold text-slate-900">Notifikasi</p>
                  <p class="text-[11px] text-slate-500">Pembaruan persediaan dan transaksi</p>
                </div>
                <span id="notificationSummary" class="text-[11px] text-slate-500"></span>
              </div>
              <div id="notificationList" class="header-dropdown-list"></div>
            </div>
          </div>

          <div class="header-menu-root">
            <button id="profileToggle" type="button" onclick="toggleHeaderMenu('profileMenu')" class="profile-toggle" aria-label="Buka menu profil" aria-expanded="false" aria-controls="profileMenu">
              <span class="profile-avatar" data-profile-avatar>HS</span>
              <span class="profile-name" data-profile-name>Hendra Saputra</span>
              <svg class="w-3.5 h-3.5 profile-caret" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 9 6 6 6-6"/></svg>
            </button>
            <div id="profileMenu" class="header-dropdown profile-dropdown hidden">
              <div class="profile-menu-heading">
                <span class="profile-avatar" data-profile-avatar>HS</span>
                <div class="min-w-0">
                  <p class="font-semibold text-slate-900 truncate" data-profile-name>Hendra Saputra</p>
                  <p class="text-[11px] text-slate-500 truncate" data-profile-role>Kepala Gudang</p>
                </div>
              </div>
              <button type="button" onclick="openSettingsModal()" class="profile-menu-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.7 2.94-.08-.02a1.7 1.7 0 00-1.76.5l-.06.06h-3.4l-.04-.08a1.7 1.7 0 00-1.53-.95h-.08l-2.95-1.7.02-.08a1.7 1.7 0 00-.5-1.76l-.06-.06v-3.4l.08-.04a1.7 1.7 0 00.95-1.53v-.08l1.7-2.95.08.02a1.7 1.7 0 001.76-.5l.06-.06h3.4l.04.08a1.7 1.7 0 001.53.95h.08l2.95 1.7-.02.08a1.7 1.7 0 00.5 1.76l.06.06v3.4l-.08.04a1.7 1.7 0 00-.95 1.53z"/></svg>
                <span>Pengaturan</span>
              </button>
              <button type="button" onclick="requestLogout()" class="profile-menu-item profile-menu-logout">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M10 17l5-5-5-5m5 5H3m9-9h6a2 2 0 012 2v14a2 2 0 01-2 2h-6"/></svg>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>
