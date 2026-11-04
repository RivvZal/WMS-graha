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
      return state.warehouses.find(w => w.id === whId) || { id: whId, name: whId };
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

    function readUserProfile() {
      const defaults = {
        name: 'Hendra Saputra',
        role: 'Kepala Gudang',
        department: 'Operasional Gudang',
        email: '',
        phone: '+62-21-4390-4902',
        photo: ''
      };
      try {
        return { ...defaults, ...JSON.parse(localStorage.getItem('WMS_USER_PROFILE') || '{}') };
      } catch (err) {
        return defaults;
      }
    }

    function escapeProfileValue(value) {
      return String(value || '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[char]);
    }

    function profileInitials(name) {
      return String(name || 'User').trim().split(/\s+/).slice(0, 2).map(part => part.charAt(0)).join('').toUpperCase() || 'U';
    }

    function renderUserProfile() {
      const profile = readUserProfile();
      document.querySelectorAll('[data-profile-name]').forEach(element => { element.textContent = profile.name; });
      document.querySelectorAll('[data-profile-role]').forEach(element => { element.textContent = profile.role; });
      document.querySelectorAll('[data-profile-avatar]').forEach(element => {
        element.replaceChildren();
        if (profile.photo) {
          const image = document.createElement('img');
          image.src = profile.photo;
          image.alt = `Foto ${profile.name}`;
          image.className = 'h-full w-full rounded-full object-cover';
          element.appendChild(image);
        } else {
          element.textContent = profileInitials(profile.name);
        }
      });
      const sidebarAvatar = document.getElementById('sidebarProfileAvatar');
      if (sidebarAvatar) {
        sidebarAvatar.replaceChildren();
        if (profile.photo) {
          const image = document.createElement('img');
          image.src = profile.photo;
          image.alt = `Foto ${profile.name}`;
          image.className = 'h-full w-full object-cover';
          sidebarAvatar.appendChild(image);
        } else {
          sidebarAvatar.textContent = profileInitials(profile.name);
        }
      }
    }

    function previewProfilePhoto(input) {
      const file = input.files && input.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showToast('Pilih file gambar untuk foto profil.', 'warning');
        input.value = '';
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        showToast('Ukuran foto maksimal 8 MB.', 'warning');
        input.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const scale = Math.min(1, 512 / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          window.profilePhotoDraft = canvas.toDataURL('image/jpeg', 0.82);
          const preview = document.querySelector('.profile-photo-preview');
          if (preview) {
            const photo = document.createElement('img');
            photo.src = window.profilePhotoDraft;
            photo.alt = 'Pratinjau foto profil';
            photo.className = 'h-full w-full rounded-full object-cover';
            preview.replaceChildren(photo);
          }
        };
        image.onerror = () => showToast('Foto tidak dapat dibuka. Coba file gambar lain.', 'error');
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    }

    function openSettingsModal() {
      closeHeaderMenus();
      const profile = readUserProfile();
      window.profilePhotoDraft = profile.photo;
      const initial = escapeProfileValue(profileInitials(profile.name));
      const preview = profile.photo
        ? `<img src="${escapeProfileValue(profile.photo)}" alt="Foto profil" class="h-full w-full rounded-full object-cover" />`
        : `<span class="profile-photo-initials">${initial}</span>`;
      const form = `
        <form onsubmit="saveUserProfile(event)" class="profile-settings-form">
          <div class="profile-settings-intro">
            <div class="profile-photo-control">
              <div class="profile-photo-preview">${preview}</div>
              <label for="profilePhotoInput" class="profile-photo-upload">Ubah foto</label>
              <input id="profilePhotoInput" type="file" accept="image/*" class="sr-only" onchange="previewProfilePhoto(this)" />
            </div>
            <div class="min-w-0">
              <h3>Profil pengguna</h3>
              <p>Perbarui informasi yang ditampilkan pada akun dan navigasi.</p>
            </div>
          </div>
          <div class="profile-fields-grid">
            <label class="profile-field profile-field-wide"><span>Nama lengkap</span><input id="profileName" type="text" maxlength="80" required value="${escapeProfileValue(profile.name)}" autocomplete="name" /></label>
            <div class="profile-field"><span>Jabatan</span><p class="profile-readonly-value">${escapeProfileValue(profile.role)}</p></div>
            <div class="profile-field"><span>Departemen / area</span><p class="profile-readonly-value">${escapeProfileValue(profile.department)}</p></div>
            <label class="profile-field"><span>Email</span><input id="profileEmail" type="email" maxlength="120" value="${escapeProfileValue(profile.email)}" autocomplete="email" placeholder="nama@perusahaan.co.id" /></label>
            <label class="profile-field"><span>Nomor telepon</span><input id="profilePhone" type="tel" maxlength="30" value="${escapeProfileValue(profile.phone)}" autocomplete="tel" /></label>
          </div>
          <p class="profile-settings-note">Jabatan dan departemen hanya dapat diubah oleh Super Admin. Perubahan profil tersimpan di browser ini selama versi backend belum terhubung.</p>
          <div class="profile-settings-actions">
            <button type="button" onclick="closeModal()" class="profile-cancel-button">Batal</button>
            <button type="submit" class="profile-save-button">Simpan profil</button>
          </div>
        </form>
      `;
      openModal('Pengaturan Akun', form, 'max-w-2xl');
    }

    function saveUserProfile(event) {
      event.preventDefault();
      const currentProfile = readUserProfile();
      const profile = {
        name: document.getElementById('profileName').value.trim(),
        role: currentProfile.role,
        department: currentProfile.department,
        email: document.getElementById('profileEmail').value.trim(),
        phone: document.getElementById('profilePhone').value.trim(),
        photo: window.profilePhotoDraft || ''
      };
      try {
        localStorage.setItem('WMS_USER_PROFILE', JSON.stringify(profile));
      } catch (err) {
        showToast('Profil gagal disimpan. Coba gunakan foto yang lebih kecil.', 'error');
        return;
      }
      renderUserProfile();
      closeModal();
      showToast('Profil berhasil diperbarui.');
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
        title: 'Ringkasan',
        subtitle: 'Pantau stok, transaksi, dan kondisi gudang'
      },
      inventory: {
        title: 'Barang & Stok',
        subtitle: 'Cari barang, lihat jumlah stok, dan kelola data barang'
      },
      warehouse: {
        title: 'Gudang',
        subtitle: 'Ringkasan fasilitas dan stok di setiap gudang'
      },
      vendors: {
        title: 'Vendor',
        subtitle: 'Daftar pemasok, kontak, dan barang yang disediakan'
      },
      catalog: {
        title: 'Katalog Vendor',
        subtitle: 'Bandingkan harga dan waktu pengiriman dari vendor'
      },
      stockin: {
        title: 'Barang Masuk',
        subtitle: 'Riwayat penerimaan barang dan formulir barang masuk'
      },
      stockout: {
        title: 'Barang Keluar',
        subtitle: 'Riwayat pengeluaran barang dan formulir barang keluar'
      },
      movements: {
        title: 'Riwayat Transaksi',
        subtitle: 'Barang masuk, barang keluar, dan transfer antar gudang'
      },
      reports: {
        title: 'Laporan',
        subtitle: 'Ringkasan persediaan, transaksi, dan kapasitas gudang'
      },
      users: {
        title: 'Pengguna & Akses',
        subtitle: 'Kelola akun pengguna dan akses gudang'
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

