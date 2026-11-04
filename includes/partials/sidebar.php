<aside id="appSidebar" class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white text-slate-600 flex flex-col transition-transform duration-200 -translate-x-full lg:translate-x-0 shrink-0 border-r border-slate-200">
  
  <div class="sidebar-brand px-5 py-5 flex items-center justify-between">
    <div class="flex min-w-0 items-center gap-3">
      <span class="sidebar-logo-frame">
        <img src="assets/images/graha-segara-logo.png?v=2" alt="Logo PT. Graha Segara" class="h-full w-full object-contain" />
      </span>
      <div class="sidebar-brand-copy min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-extrabold text-white text-xl tracking-tight leading-none">WMS</span>
          <span class="px-1.5 py-0.5 text-[9px] font-semibold bg-white/15 text-sky-100 rounded border border-white/20">v4.2</span>
        </div>
        <p class="text-[11px] text-sky-100/80 truncate mt-1">Management System</p>
      </div>
    </div>
    <button type="button" onclick="toggleMobileSidebar(false)" class="lg:hidden p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10" aria-label="Tutup Navigasi">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>

  
  <div class="px-3.5 pt-3.5 pb-2 border-b border-slate-100 bg-white">
    <label for="globalHubFilter" class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-1">Filter Gudang Divisi</label>
    <select id="globalHubFilter" onchange="handleGlobalHubChange(this.value)" class="w-full bg-slate-50 text-slate-700 text-xs font-medium rounded-xl px-2.5 py-2 border border-slate-200 focus:outline-none focus:border-blue-600 transition">
      <option value="ALL">Semua Gudang Divisi (5)</option>
      <option value="WH-GA-PROPERTY">GA Property</option>
      <option value="WH-GA-BUILDING">GA Building</option>
      <option value="WH-ALBER">Alber</option>
      <option value="WH-EKONOMI">Ekonomi</option>
      <option value="WH-KALIBARU">Kalibaru</option>
    </select>
  </div>

  
  <nav class="flex-1 overflow-y-auto custom-scroll py-3 px-3 space-y-1 bg-white" aria-label="Menu Utama WMS">
    <div class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Menu Utama</div>
    <button type="button" onclick="switchPage('dashboard')" id="nav-dashboard" title="Ringkasan" class="nav-item active w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        <span>Dashboard</span>
      </span>
      <span class="nav-badge px-1.5 py-0.5 text-[10px] rounded-md bg-blue-50 text-blue-600 font-mono">Live</span>
    </button>

    <div class="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Operasional</div>
    <button type="button" onclick="switchPage('stockin')" id="nav-stockin" title="Stock In / Barang Masuk" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
        <span>Barang Masuk</span>
      </span>
    </button>

    <button type="button" onclick="switchPage('stockout')" id="nav-stockout" title="Stock Out / Barang Keluar" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
        <span>Barang Keluar</span>
      </span>
    </button>

    <button type="button" onclick="switchPage('inventory')" id="nav-inventory" title="Barang dan stok" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        <span>Barang & Stok</span>
      </span>
      <span id="badge-inventory-count" class="nav-badge px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-600 font-mono">12</span>
    </button>

    <button type="button" onclick="switchPage('movements')" id="nav-movements" title="Riwayat Transaksi / Movement" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
        <span>Riwayat</span>
      </span>
      <span id="badge-movement-count" class="nav-badge px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-600 font-mono">14</span>
    </button>

    <div class="pt-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Data Pendukung</div>
    <button type="button" onclick="switchPage('reports')" id="nav-reports" title="Laporan" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <span>Laporan</span>
      </span>
    </button>

    <button type="button" onclick="switchPage('warehouse')" id="nav-warehouse" title="Gudang" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        <span>Gudang</span>
      </span>
      <span id="badge-warehouse-count" class="nav-badge px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-600 font-mono">5 Gudang</span>
    </button>

    <button type="button" onclick="switchPage('vendors')" id="nav-vendors" title="Vendor" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <span>Master Vendor</span>
      </span>
      <span id="badge-vendor-count" class="nav-badge px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-600 font-mono">6</span>
    </button>

    <button type="button" onclick="switchPage('catalog')" id="nav-catalog" title="Katalog Vendor" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
        <span>Katalog Vendor</span>
      </span>
      <span class="nav-badge px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-600 font-mono">e-Proc</span>
    </button>

    <button type="button" onclick="switchPage('users')" id="nav-users" title="Pengguna dan akses" class="nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition">
      <span class="flex items-center gap-3">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        <span>Pengguna & Akses</span>
      </span>
      <span id="badge-user-count" class="nav-badge px-1.5 py-0.5 text-[10px] rounded-md bg-slate-100 text-slate-600 font-mono">6</span>
    </button>
  </nav>

  
  <div class="p-3 bg-white border-t border-slate-100">
    <div class="sidebar-user-card p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2.5 min-w-0">
        <div id="sidebarProfileAvatar" class="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <div class="truncate">
          <p class="text-xs font-bold text-slate-900 truncate" data-profile-name>Hendra Saputra</p>
          <p class="text-[10px] text-slate-500 truncate" data-profile-role>Kepala Gudang</p>
        </div>
      </div>
      <button type="button" onclick="resetDemoData()" title="Reset Data Demo ke Awal" class="text-[10px] font-semibold px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shrink-0 transition">
        Reset
      </button>
    </div>
  </div>
</aside>
