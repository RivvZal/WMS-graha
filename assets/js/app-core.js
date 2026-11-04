    function formatRupiah(num) {
      const n = Number(num) || 0;
      return 'Rp ' + n.toLocaleString('id-ID');
    }

    function getItemTotalStock(item, hubFilter = state.globalHub) {
      if (!item || !item.stockByWh) return 0;
      if (hubFilter && hubFilter !== 'ALL') {
        return Number(item.stockByWh[hubFilter] || 0);
      }
      return Object.values(item.stockByWh).reduce((acc, v) => acc + Number(v || 0), 0);
    }

    function getWarehouseById(whId) {
      return state.warehouses.find(w => w.id === whId) || { id: whId, name: whId, zones: [] };
    }

    function getVendorById(vId) {
      return state.vendors.find(v => v.id === vId) || { id: vId, name: 'Internal / Non-Vendor' };
    }

    function getItemById(itemId) {
      return state.items.find(i => i.id === itemId) || { id: itemId, sku: '-', name: 'Barang Terhapus', unit: 'Pcs', basePrice: 0, stockByWh: {} };
    }

    function showToast(message, type = 'success') {
      const container = document.getElementById('toastContainer');
      if (!container) return;
      const colors = {
        success: 'bg-emerald-600 border-emerald-500 text-white',
        warning: 'bg-amber-600 border-amber-500 text-white',
        error: 'bg-rose-600 border-rose-500 text-white',
        info: 'bg-sky-700 border-sky-600 text-white'
      };
      const el = document.createElement('div');
      el.className = `pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium animate-fade ${colors[type] || colors.info}`;
      el.innerHTML = `
        <div class="flex items-center gap-2.5">
          <span class="w-2 h-2 rounded-full bg-white shrink-0"></span>
          <span>${message}</span>
        </div>
        <button type="button" onclick="this.parentElement.remove()" class="opacity-80 hover:opacity-100 text-white font-bold">✕</button>
      `;
      container.appendChild(el);
      setTimeout(() => {
        if (el && el.parentElement) el.remove();
      }, 4200);
    }

    function openModal(title, htmlContent, maxWidthClass = 'max-w-2xl') {
      const overlay = document.getElementById('modalOverlay');
      const box = document.getElementById('modalBox');
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalBody').innerHTML = htmlContent;
      box.className = `bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${maxWidthClass} overflow-hidden animate-fade my-8`;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
    }

    function closeModal() {
      const overlay = document.getElementById('modalOverlay');
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }

    function toggleMobileSidebar(open) {
      const sb = document.getElementById('appSidebar');
      const bd = document.getElementById('sidebarBackdrop');
      const toggle = document.getElementById('sidebarToggle');
      if (open) {
        sb.classList.remove('-translate-x-full');
        bd.classList.remove('hidden');
      } else {
        sb.classList.add('-translate-x-full');
        bd.classList.add('hidden');
      }
      if (toggle && window.matchMedia('(max-width: 1023px)').matches) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Tutup menu samping' : 'Buka menu samping');
      }
    }

    function toggleSidebar() {
      const shell = document.getElementById('appShell');
      const toggle = document.getElementById('sidebarToggle');
      if (!shell) return;

      if (window.matchMedia('(max-width: 1023px)').matches) {
        const isOpen = !document.getElementById('appSidebar')?.classList.contains('-translate-x-full');
        toggleMobileSidebar(!isOpen);
        return;
      }

      const isHidden = shell.classList.toggle('sidebar-hidden');
      try {
        localStorage.setItem('WMS_SIDEBAR_HIDDEN', isHidden ? '1' : '0');
      } catch (err) {
        // Sidebar tetap dapat dipakai meski penyimpanan browser tidak tersedia.
      }
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(!isHidden));
        toggle.setAttribute('aria-label', isHidden ? 'Tampilkan menu samping' : 'Sembunyikan menu samping');
      }
    }

    function closeHeaderMenus() {
      ['notificationMenu', 'profileMenu'].forEach(id => {
        const menu = document.getElementById(id);
        if (menu) menu.classList.add('hidden');
      });
      ['notificationToggle', 'profileToggle'].forEach(id => {
        const button = document.getElementById(id);
        if (button) button.setAttribute('aria-expanded', 'false');
      });
    }

    function toggleHeaderMenu(menuId) {
      const menu = document.getElementById(menuId);
      const buttonId = menuId === 'profileMenu' ? 'profileToggle' : 'notificationToggle';
      const button = document.getElementById(buttonId);
      if (!menu) return;
      const willOpen = menu.classList.contains('hidden');
      closeHeaderMenus();
      if (willOpen) {
        menu.classList.remove('hidden');
        if (button) button.setAttribute('aria-expanded', 'true');
      }
    }

    function renderHeaderNotifications() {
      const list = document.getElementById('notificationList');
      const badge = document.getElementById('notificationBadge');
      const summary = document.getElementById('notificationSummary');
      if (!list || !badge) return;

      let settings = {};
      try {
        settings = JSON.parse(localStorage.getItem('WMS_USER_SETTINGS') || '{}');
      } catch (err) {
        settings = {};
      }

      const lowStockItems = state.items.filter(item =>
        getItemTotalStock(item, 'ALL') <= Number(item.minStock || 0)
      );
      const recentMovements = [...state.movements].slice(-3).reverse();

      if (settings.notificationsEnabled === false) {
        badge.classList.add('hidden');
        if (summary) summary.textContent = 'Nonaktif';
        list.innerHTML = '<div class="notification-empty">Notifikasi dinonaktifkan di Pengaturan.</div>';
        return;
      }

      badge.textContent = lowStockItems.length > 9 ? '9+' : String(lowStockItems.length);
      badge.classList.toggle('hidden', lowStockItems.length === 0);
      if (summary) summary.textContent = lowStockItems.length ? `${lowStockItems.length} stok menipis` : 'Terbaru';

      if (lowStockItems.length) {
        list.innerHTML = lowStockItems.slice(0, 4).map(item => `
          <button type="button" class="notification-item" onclick="closeHeaderMenus(); switchPage('inventory'); showItemDetailModal('${item.id}')">
            <span class="notification-dot notification-dot-warning"></span>
            <span class="min-w-0 flex-1">
              <span class="block font-semibold text-slate-800 truncate">Stok menipis · ${item.name}</span>
              <span class="block text-[11px] text-slate-500">${item.sku} · ${getItemTotalStock(item, 'ALL')} ${item.unit} tersisa</span>
            </span>
          </button>
        `).join('');
        return;
      }

      if (!recentMovements.length) {
        list.innerHTML = '<div class="notification-empty">Belum ada notifikasi baru.</div>';
        return;
      }

      list.innerHTML = recentMovements.map(movement => `
        <button type="button" class="notification-item" onclick="closeHeaderMenus(); switchPage('movements')">
          <span class="notification-dot ${movement.type === 'IN' ? 'notification-dot-success' : 'notification-dot-info'}"></span>
          <span class="min-w-0 flex-1">
            <span class="block font-semibold text-slate-800 truncate">${movement.type === 'IN' ? 'Barang masuk' : movement.type === 'OUT' ? 'Barang keluar' : 'Perpindahan stok'}</span>
            <span class="block text-[11px] text-slate-500">${movement.docNo} · ${movement.date}</span>
          </span>
        </button>
      `).join('');
    }

    function openSettingsModal() {
      closeHeaderMenus();
      let settings = {};
      try {
        settings = JSON.parse(localStorage.getItem('WMS_USER_SETTINGS') || '{}');
      } catch (err) {
        settings = {};
      }
      const hubOptions = state.warehouses.map(warehouse => `
        <option value="${warehouse.id}" ${warehouse.id === state.globalHub ? 'selected' : ''}>${warehouse.id} · ${warehouse.name}</option>
      `).join('');
      const form = `
        <form onsubmit="saveUserSettings(event)" class="space-y-4 text-sm">
          <div>
            <label for="settingsHub" class="block text-xs font-semibold text-slate-700 mb-1.5">Hub yang sedang ditampilkan</label>
            <select id="settingsHub" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
              <option value="ALL" ${state.globalHub === 'ALL' ? 'selected' : ''}>Semua Hub Nasional</option>
              ${hubOptions}
            </select>
          </div>
          <label class="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
            <input id="settingsNotifications" type="checkbox" class="mt-0.5 accent-blue-700" ${settings.notificationsEnabled === false ? '' : 'checked'} />
            <span><span class="block text-xs font-semibold text-slate-800">Notifikasi persediaan</span><span class="mt-0.5 block text-[11px] text-slate-500">Tampilkan peringatan stok menipis dan transaksi terbaru.</span></span>
          </label>
          <div class="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button type="button" onclick="closeModal()" class="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">Batal</button>
            <button type="submit" class="rounded-lg bg-blue-800 px-4 py-2 text-xs font-semibold text-white">Simpan Pengaturan</button>
          </div>
        </form>
      `;
      openModal('Pengaturan WMS', form, 'max-w-lg');
    }

    function saveUserSettings(event) {
      event.preventDefault();
      const selectedHub = document.getElementById('settingsHub').value;
      const settings = { notificationsEnabled: document.getElementById('settingsNotifications').checked };
      try {
        localStorage.setItem('WMS_USER_SETTINGS', JSON.stringify(settings));
      } catch (err) {
        showToast('Pengaturan hanya berlaku sampai halaman ditutup.', 'warning');
      }
      closeModal();
      renderHeaderNotifications();
      if (selectedHub !== state.globalHub) {
        handleGlobalHubChange(selectedHub);
      } else {
        showToast('Pengaturan berhasil disimpan.');
      }
    }

    function requestLogout() {
      closeHeaderMenus();
      const message = `
        <div class="space-y-4 text-sm">
          <p class="text-slate-600">Akun yang sedang dipakai masih berupa akun demo. Proses keluar akan tersedia setelah autentikasi backend disiapkan.</p>
          <div class="flex justify-end">
            <button type="button" onclick="closeModal()" class="rounded-lg bg-blue-800 px-4 py-2 text-xs font-semibold text-white">Mengerti</button>
          </div>
        </div>
      `;
      openModal('Keluar dari WMS', message, 'max-w-md');
    }

    function updateSidebarBadges() {
      const invBadge = document.getElementById('badge-inventory-count');
      const whBadge = document.getElementById('badge-warehouse-count');
      const vndBadge = document.getElementById('badge-vendor-count');
      const movBadge = document.getElementById('badge-movement-count');
      const usrBadge = document.getElementById('badge-user-count');
      if (invBadge) invBadge.textContent = state.items.length;
      if (whBadge) whBadge.textContent = state.warehouses.length + ' Hub';
      if (vndBadge) vndBadge.textContent = state.vendors.length;
      if (movBadge) movBadge.textContent = state.movements.length;
      if (usrBadge) usrBadge.textContent = state.users.length;
    }

    function handleGlobalHubChange(hubId) {
      state.globalHub = hubId;
      if (hubId !== 'ALL') {
        state.warehouseSelectedId = hubId;
      }
      const badge = document.getElementById('activeHubBadge');
      if (badge) {
        badge.textContent = hubId === 'ALL' ? 'Semua Hub Nasional' : getWarehouseById(hubId).name;
      }
      saveState();
      renderCurrentPage();
      showToast(`Filter tampilan diubah ke: ${hubId === 'ALL' ? 'Semua Gudang Nasional' : getWarehouseById(hubId).name}`, 'info');
    }

    function handleGlobalSearch(query) {
      const dropdown = document.getElementById('globalSearchDropdown');
      const q = (query || '').trim().toLowerCase();
      if (!q) {
        dropdown.classList.add('hidden');
        return;
      }
      const matchedItems = state.items.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q)).slice(0, 4);
      const matchedVendors = state.vendors.filter(v => v.name.toLowerCase().includes(q)).slice(0, 3);
      const matchedTrx = state.movements.filter(m => m.docNo.toLowerCase().includes(q)).slice(0, 3);

      let html = '';
      if (matchedItems.length) {
        html += `<div class="px-2 py-1 text-[10px] font-bold uppercase text-slate-400">Barang / SKU</div>`;
        matchedItems.forEach(item => {
          html += `<button type="button" onclick="document.getElementById('globalSearchDropdown').classList.add('hidden'); switchPage('inventory'); showItemDetailModal('${item.id}')" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 flex items-center justify-between text-xs">
            <span class="truncate font-medium text-slate-800">${item.name}</span>
            <span class="font-mono text-[10px] text-sky-600 shrink-0 ml-2">${item.sku}</span>
          </button>`;
        });
      }
      if (matchedVendors.length) {
        html += `<div class="px-2 py-1 mt-1 text-[10px] font-bold uppercase text-slate-400">Vendor</div>`;
        matchedVendors.forEach(v => {
          html += `<button type="button" onclick="document.getElementById('globalSearchDropdown').classList.add('hidden'); switchPage('vendors'); showVendorDetailModal('${v.id}')" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 flex items-center justify-between text-xs">
            <span class="truncate font-medium text-slate-800">${v.name}</span>
            <span class="text-[10px] text-slate-500">${v.city}</span>
          </button>`;
        });
      }
      if (matchedTrx.length) {
        html += `<div class="px-2 py-1 mt-1 text-[10px] font-bold uppercase text-slate-400">Dokumen Transaksi</div>`;
        matchedTrx.forEach(t => {
          html += `<button type="button" onclick="document.getElementById('globalSearchDropdown').classList.add('hidden'); switchPage('movements'); showTransactionDetailModal('${t.id}')" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-sky-50 flex items-center justify-between text-xs">
            <span class="font-mono text-[11px] font-semibold text-slate-800">${t.docNo}</span>
            <span class="text-[10px] text-slate-500">${t.type}</span>
          </button>`;
        });
      }
      if (!html) {
        html = `<div class="p-3 text-center text-xs text-slate-400">Tidak ditemukan hasil untuk "${query}"</div>`;
      }
      dropdown.innerHTML = html;
      dropdown.classList.remove('hidden');
    }

    const PAGE_META = {
      dashboard: {
        title: 'Dashboard Operasional WMS',
        subtitle: 'Ringkasan stok real-time, grafik arus keluar-masuk barang, utilisasi gudang & peringatan stok'
      },
      inventory: {
        title: 'Manajemen Inventory & Master Barang',
        subtitle: 'Daftar barang, detail spesifikasi, kategori/satuan, serta komparasi harga multi-vendor'
      },
      warehouse: {
        title: 'Data Gudang & Lokasi Penyimpanan (Warehouse)',
        subtitle: 'Manajemen cabang gudang PT. Graha Segara, denah zona/rak penyimpanan & distribusi stok'
      },
      vendors: {
        title: 'Vendor Management (Mitra Pemasok)',
        subtitle: 'Direktori rekanan penyedia barang, kontak PIC, SLA pengiriman & daftar barang pemasok'
      },
      catalog: {
        title: 'Vendor Catalog & Pemilihan Penawaran',
        subtitle: 'Katalog penawaran harga dari vendor, detail spesifikasi kontrak & seleksi vendor utama'
      },
      stockin: {
        title: 'Stock In — Penerimaan Barang Masuk (Inbound / GRN)',
        subtitle: 'Formulir input penerimaan barang dari vendor ke lokasi rak gudang & riwayat GRN'
      },
      stockout: {
        title: 'Stock Out — Pengeluaran Barang (Outbound / DO)',
        subtitle: 'Formulir pengeluaran barang dari gudang asal ke unit operasional/tujuan & riwayat Surat Jalan'
      },
      movements: {
        title: 'Riwayat Transaksi & Pergerakan Stok (Stock Movement)',
        subtitle: 'Jurnal lengkap pergerakan stok (Inbound, Outbound, dan Transfer Antar Gudang)'
      },
      reports: {
        title: 'Laporan & Analitik Eksekutif (WMS Report)',
        subtitle: 'Valuasi persediaan, rekapitulasi mutasi barang, kapasitas gudang & evaluasi performa vendor'
      },
      users: {
        title: 'Manajemen Pengguna & Hak Akses (User Management)',
        subtitle: 'Pengaturan akun personel gudang, otorisasi cabang hub & log aktivitas operator'
      }
    };

    function switchPage(pageKey) {
      state.activePage = pageKey;
      saveState();
      toggleMobileSidebar(false);

      document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
      const activeNav = document.getElementById(`nav-${pageKey}`);
      if (activeNav) activeNav.classList.add('active');

      const meta = PAGE_META[pageKey] || PAGE_META.dashboard;
      document.getElementById('pageHeaderTitle').textContent = meta.title;
      document.getElementById('pageHeaderSubtitle').textContent = meta.subtitle;

      renderCurrentPage();
      document.getElementById('mainViewport').scrollTop = 0;
    }

    function destroyCharts() {
      Object.values(chartInstances).forEach(ch => {
        if (ch && typeof ch.destroy === 'function') ch.destroy();
      });
      chartInstances = {};
    }

    function renderCurrentPage() {
      destroyCharts();
      updateSidebarBadges();
      const container = document.getElementById('viewContainer');
      switch (state.activePage) {
        case 'dashboard': renderDashboard(container); break;
        case 'inventory': renderInventory(container); break;
        case 'warehouse': renderWarehouse(container); break;
        case 'vendors': renderVendors(container); break;
        case 'catalog': renderCatalog(container); break;
        case 'stockin': renderStockIn(container); break;
        case 'stockout': renderStockOut(container); break;
        case 'movements': renderMovements(container); break;
        case 'reports': renderReports(container); break;
        case 'users': renderUsers(container); break;
        default: renderDashboard(container);
      }
    }

