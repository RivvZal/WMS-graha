    function renderInventory(container) {
      const subTab = state.inventorySubTab || 'list';

      container.innerHTML = `
        <div class="space-y-5 animate-fade">
          
          <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-1.5">
              <button type="button" onclick="state.inventorySubTab='list'; renderInventory(document.getElementById('viewContainer'))" class="px-3.5 py-2 rounded-xl text-xs font-semibold transition ${subTab === 'list' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                Daftar & Detail Barang (${state.items.length})
              </button>
              <button type="button" onclick="state.inventorySubTab='categories'; renderInventory(document.getElementById('viewContainer'))" class="px-3.5 py-2 rounded-xl text-xs font-semibold transition ${subTab === 'categories' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                Kategori & Satuan Barang
              </button>
              <button type="button" onclick="state.inventorySubTab='vendorPricing'; renderInventory(document.getElementById('viewContainer'))" class="px-3.5 py-2 rounded-xl text-xs font-semibold transition ${subTab === 'vendorPricing' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                Informasi & Harga Vendor
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="openItemModal()" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                <span>Tambah Barang Baru</span>
              </button>
            </div>
          </div>

          <div id="inventorySubContent"></div>
        </div>
      `;

      const subEl = document.getElementById('inventorySubContent');
      if (subTab === 'list') renderInventoryListTab(subEl);
      else if (subTab === 'categories') renderInventoryCategoriesTab(subEl);
      else renderInventoryVendorPricingTab(subEl);
    }

    function renderInventoryListTab(subEl) {
      subEl.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Cari Nama Barang / SKU / Spesifikasi</label>
              <input id="invSearchInput" type="text" oninput="filterInventoryTable()" placeholder="Ketik nama barang atau kode SKU (mis. GS-RFC-001)..." class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Filter Kategori</label>
              <select id="invCategoryFilter" onchange="filterInventoryTable()" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500">
                <option value="ALL">Semua Kategori</option>
                ${state.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Status Ketersediaan</label>
              <select id="invStatusFilter" onchange="filterInventoryTable()" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500">
                <option value="ALL">Semua Status Stok</option>
                <option value="NORMAL">Stok Aman (Normal)</option>
                <option value="LOW">Stok Menipis (Low Stock)</option>
              </select>
            </div>
          </div>

          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-[10px]">
                  <th class="py-3 px-3">Kode SKU</th>
                  <th class="py-3 px-3">Nama & Spesifikasi Barang</th>
                  <th class="py-3 px-3">Kategori</th>
                  <th class="py-3 px-3 text-right">Stok (${state.globalHub === 'ALL' ? 'Nasional' : state.globalHub})</th>
                  <th class="py-3 px-3 text-right">Min. Stok</th>
                  <th class="py-3 px-3 text-right">Harga Standar</th>
                  <th class="py-3 px-3">Vendor Utama</th>
                  <th class="py-3 px-3 text-center inventory-status-column">Status</th>
                  <th class="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody id="inventoryTableBody" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      `;
      filterInventoryTable();
    }

    function filterInventoryTable() {
      const q = (document.getElementById('invSearchInput')?.value || '').toLowerCase();
      const cat = document.getElementById('invCategoryFilter')?.value || 'ALL';
      const status = document.getElementById('invStatusFilter')?.value || 'ALL';
      const tbody = document.getElementById('inventoryTableBody');
      if (!tbody) return;

      const filtered = state.items.filter(item => {
        const matchQ = !q || item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q) || (item.specs || '').toLowerCase().includes(q);
        const matchCat = cat === 'ALL' || item.category === cat;
        const qty = getItemTotalStock(item, state.globalHub);
        const minThreshold = state.globalHub === 'ALL' ? item.minStock : Math.ceil(item.minStock / 3);
        const isLow = qty <= minThreshold;
        const matchStatus = status === 'ALL' || (status === 'LOW' && isLow) || (status === 'NORMAL' && !isLow);
        return matchQ && matchCat && matchStatus;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-slate-400">Tidak ada barang yang sesuai dengan filter pencarian.</td></tr>`;
        return;
      }

      tbody.innerHTML = filtered.map(item => {
        const qty = getItemTotalStock(item, state.globalHub);
        const minThreshold = state.globalHub === 'ALL' ? item.minStock : Math.ceil(item.minStock / 3);
        const isLow = qty <= minThreshold;
        const vendor = getVendorById(item.preferredVendorId);

        return `
          <tr class="hover:bg-slate-50/90 transition">
            <td class="py-3 px-3 font-mono font-bold text-sky-700">${item.sku}</td>
            <td class="py-3 px-3">
              <div class="font-semibold text-slate-900">${item.name}</div>
              <div class="text-[11px] text-slate-500 truncate max-w-xs">${item.specs || '-'}</div>
            </td>
            <td class="py-3 px-3">
              <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">${item.category}</span>
            </td>
            <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">${qty.toLocaleString('id-ID')} <span class="font-normal text-slate-500">${item.unit}</span></td>
            <td class="py-3 px-3 text-right font-mono text-slate-500">${minThreshold} ${item.unit}</td>
            <td class="py-3 px-3 text-right font-mono font-medium text-slate-800">${formatRupiah(item.basePrice)}</td>
            <td class="py-3 px-3 text-slate-700">${vendor.name}</td>
            <td class="py-3 px-3 text-center inventory-status-column" style="min-width: 7.5rem; white-space: nowrap">
              ${isLow
                ? `<span class="stock-status-badge stock-status-low px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200" style="display: inline-flex; white-space: nowrap">Stok Menipis</span>`
                : `<span class="stock-status-badge stock-status-safe px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200" style="display: inline-flex; white-space: nowrap">Aman</span>`
              }
            </td>
            <td class="py-3 px-3 text-right whitespace-nowrap space-x-1">
              <button type="button" onclick="showItemDetailModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-semibold">Detail</button>
              <button type="button" onclick="openItemModal('${item.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-semibold">Edit</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function showItemDetailModal(itemId) {
      const item = getItemById(itemId);
      const totalQty = getItemTotalStock(item, 'ALL');
      const itemMovements = state.movements.filter(m => m.itemId === item.id).slice(0, 5);

      const html = `
        <div class="space-y-5 text-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-[11px]">${item.sku}</span>
              <h4 class="text-base font-bold text-slate-900 mt-1">${item.name}</h4>
              <p class="text-slate-500 mt-0.5">${item.specs || '-'}</p>
            </div>
            <div class="text-left sm:text-right shrink-0">
              <p class="text-[11px] text-slate-500">Total Stok Nasional</p>
              <p class="text-2xl font-extrabold text-slate-900 font-mono">${totalQty} ${item.unit}</p>
              <p class="text-[11px] text-sky-700 font-semibold">${formatRupiah(item.basePrice)} / ${item.unit}</p>
            </div>
          </div>

          
          <div>
            <h5 class="font-bold text-slate-800 mb-2">Sebaran Stok per Gudang</h5>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${state.warehouses.map(wh => {
                const q = Number(item.stockByWh[wh.id] || 0);
                return `
                  <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-slate-800">${wh.name}</div>
                      <div class="text-[11px] text-slate-500">Kode Gudang: ${wh.id}</div>
                    </div>
                    <div class="font-mono font-bold text-sm ${q === 0 ? 'text-rose-600' : 'text-slate-900'}">${q} ${item.unit}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          
          <div>
            <h5 class="font-bold text-slate-800 mb-2">Daftar Penawaran & Harga Vendor Pemasok</h5>
            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                    <th class="py-2 px-3">Nama Vendor</th>
                    <th class="py-2 px-3 text-right">Harga Kontrak</th>
                    <th class="py-2 px-3 text-right">MOQ</th>
                    <th class="py-2 px-3 text-right">Lead Time</th>
                    <th class="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${(item.vendorOffers || []).map(off => {
                    const v = getVendorById(off.vendorId);
                    return `
                      <tr>
                        <td class="py-2 px-3 font-medium text-slate-800">${v.name}</td>
                        <td class="py-2 px-3 text-right font-mono font-semibold">${formatRupiah(off.price)}</td>
                        <td class="py-2 px-3 text-right font-mono">${off.moq} ${item.unit}</td>
                        <td class="py-2 px-3 text-right">${off.leadTime} Hari</td>
                        <td class="py-2 px-3">
                          ${off.vendorId === item.preferredVendorId
                            ? `<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">Vendor Utama</span>`
                            : `<span class="text-slate-400 text-[11px]">Alternatif</span>`}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          
          <div>
            <h5 class="font-bold text-slate-800 mb-2">5 Riwayat Mutasi Terakhir Barang Ini</h5>
            ${itemMovements.length === 0 ? `<p class="text-slate-400">Belum ada riwayat transaksi untuk barang ini.</p>` : `
              <div class="space-y-1.5">
                ${itemMovements.map(m => `
                  <div class="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                    <div>
                      <span class="font-mono font-semibold text-slate-800">${m.docNo}</span>
                      <span class="text-slate-500 ml-2">${m.date} • ${m.warehouseId}</span>
                    </div>
                    <span class="font-mono font-bold ${m.type === 'IN' ? 'text-emerald-600' : 'text-amber-600'}">${m.type === 'IN' ? '+' : '-'}${m.qty} ${item.unit}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="closeModal(); openItemModal('${item.id}')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold">Edit Data Barang</button>
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">Tutup</button>
          </div>
        </div>
      `;
      openModal(`Detail Barang — ${item.sku}`, html, 'max-w-3xl');
    }

    function openItemModal(editItemId = null) {
      const isEdit = Boolean(editItemId);
      const item = isEdit ? getItemById(editItemId) : {
        sku: `GS-NEW-${String(state.items.length + 1).padStart(3, '0')}`,
        name: '',
        category: state.categories[0]?.name || '',
        unit: state.units[0]?.code || 'Pcs',
        minStock: 20,
        basePrice: 250000,
        preferredVendorId: state.vendors[0]?.id || 'VND-001',
        specs: '',
        stockByWh: { 'WH-JKT-01': 25, 'WH-JKT-02': 0, 'WH-MDN-01': 0, 'WH-SBY-01': 0 }
      };

      const html = `
        <form onsubmit="saveItemForm(event, '${editItemId || ''}')" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode SKU Barang *</label>
              <input id="formItemSku" type="text" required value="${item.sku}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kategori Barang *</label>
              <select id="formItemCategory" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500">
                ${state.categories.map(c => `<option value="${c.name}" ${c.name === item.category ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap Barang *</label>
              <input id="formItemName" type="text" required value="${item.name}" placeholder="Contoh: Sensor Temperatur Kontainer Reefer..." class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Satuan (UoM) *</label>
              <select id="formItemUnit" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500">
                ${state.units.map(u => `<option value="${u.code}" ${u.code === item.unit ? 'selected' : ''}>${u.code} — ${u.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Batas Minimum Stok (Safety Stock) *</label>
              <input id="formItemMinStock" type="number" min="0" required value="${item.minStock}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Harga Standar / Kontrak (Rp) *</label>
              <input id="formItemPrice" type="number" min="0" required value="${item.basePrice}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Vendor Utama (Preferred Vendor) *</label>
              <select id="formItemVendor" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500">
                ${state.vendors.map(v => `<option value="${v.id}" ${v.id === item.preferredVendorId ? 'selected' : ''}>${v.name}</option>`).join('')}
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Spesifikasi Teknis & Keterangan</label>
              <textarea id="formItemSpecs" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-sky-500">${item.specs || ''}</textarea>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div class="font-bold text-slate-800">Stok Awal / Koreksi Stok per Gudang</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${state.warehouses.map(wh => `
                <div class="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                  <div class="min-w-0">
                    <div class="font-semibold text-slate-800 truncate">${wh.id}</div>
                    <div class="text-[10px] text-slate-500 truncate">${wh.name}</div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <input type="number" min="0" id="formWhStock_${wh.id}" value="${Number(item.stockByWh?.[wh.id] || 0)}" class="w-20 px-2 py-1 text-right font-mono border border-slate-300 rounded-lg" />
                    <span class="text-[10px] text-slate-500">Unit</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">Batal</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-xs">${isEdit ? 'Simpan Perubahan' : 'Tambahkan Barang'}</button>
          </div>
        </form>
      `;
      openModal(isEdit ? `Edit Data Barang — ${item.sku}` : 'Tambah Master Barang Baru', html);
    }

    function saveItemForm(e, editItemId) {
      e.preventDefault();
      const sku = document.getElementById('formItemSku').value.trim();
      const name = document.getElementById('formItemName').value.trim();
      const category = document.getElementById('formItemCategory').value;
      const unit = document.getElementById('formItemUnit').value;
      const minStock = Number(document.getElementById('formItemMinStock').value) || 0;
      const basePrice = Number(document.getElementById('formItemPrice').value) || 0;
      const preferredVendorId = document.getElementById('formItemVendor').value;
      const specs = document.getElementById('formItemSpecs').value.trim();

      const stockByWh = {};
      state.warehouses.forEach(wh => {
        stockByWh[wh.id] = Number(document.getElementById(`formWhStock_${wh.id}`)?.value || 0);
      });

      if (editItemId) {
        const idx = state.items.findIndex(i => i.id === editItemId);
        if (idx !== -1) {
          state.items[idx] = {
            ...state.items[idx],
            sku, name, category, unit, minStock, basePrice, preferredVendorId, specs, stockByWh
          };
        }
        showToast(`Data barang ${name} (${sku}) berhasil diperbarui.`);
      } else {
        const newId = `ITM-${String(state.items.length + 1).padStart(3, '0')}`;
        state.items.unshift({
          id: newId,
          sku, name, category, unit, minStock, basePrice, preferredVendorId, specs,
          stockByWh,
          vendorOffers: [
            { vendorId: preferredVendorId, price: basePrice, moq: 5, leadTime: 3, quoteNo: `QT/NEW/2026/${state.items.length + 1}`, validUntil: '2026-12-31', warranty: '12 Bulan', isPreferred: true }
          ]
        });
        showToast(`Barang baru ${name} (${sku}) berhasil ditambahkan ke Inventory.`);
      }

      saveState();
      closeModal();
      renderInventory(document.getElementById('viewContainer'));
    }

    function renderInventoryCategoriesTab(subEl) {
      subEl.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-slate-900">Master Kategori Barang</h3>
                <p class="text-xs text-slate-500">Klasifikasi suku cadang reefer, alat berat MHE, segel karantina & logistik</p>
              </div>
            </div>
            <form onsubmit="addCategoryForm(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <input id="newCatCode" type="text" required placeholder="Kode (mis. OIL)" class="px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono" />
              <input id="newCatName" type="text" required placeholder="Nama Kategori Baru..." class="px-2.5 py-1.5 rounded-lg border border-slate-300" />
              <button type="submit" class="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold">+ Tambah Kategori</button>
            </form>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                    <th class="py-2.5 px-3">Kode</th>
                    <th class="py-2.5 px-3">Nama Kategori</th>
                    <th class="py-2.5 px-3 text-right">Jumlah SKU</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${state.categories.map(c => {
                    const count = state.items.filter(i => i.category === c.name).length;
                    return `
                      <tr>
                        <td class="py-2.5 px-3 font-mono font-bold text-sky-700">${c.code}</td>
                        <td class="py-2.5 px-3">
                          <div class="font-semibold text-slate-900">${c.name}</div>
                          <div class="text-[11px] text-slate-500">${c.desc}</div>
                        </td>
                        <td class="py-2.5 px-3 text-right font-mono font-semibold">${count} SKU</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          
          <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Master Satuan Barang (Unit of Measure)</h3>
              <p class="text-xs text-slate-500">Satuan hitung stok inventaris gudang</p>
            </div>
            <form onsubmit="addUnitForm(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <input id="newUnitCode" type="text" required placeholder="Kode (mis. Drum)" class="px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono" />
              <input id="newUnitName" type="text" required placeholder="Keterangan Satuan..." class="px-2.5 py-1.5 rounded-lg border border-slate-300" />
              <button type="submit" class="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold">+ Tambah Satuan</button>
            </form>
            <div class="space-y-2">
              ${state.units.map(u => `
                <div class="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span class="font-mono font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100">${u.code}</span>
                    <span class="font-semibold text-slate-800 ml-2">${u.name}</span>
                    <p class="text-[11px] text-slate-500 mt-1">${u.desc}</p>
                  </div>
                  <span class="font-mono text-[11px] text-slate-500">${state.items.filter(i => i.unit === u.code).length} Barang</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    function addCategoryForm(e) {
      e.preventDefault();
      const code = document.getElementById('newCatCode').value.trim().toUpperCase();
      const name = document.getElementById('newCatName').value.trim();
      if (!code || !name) return;
      state.categories.push({ id: `CAT-${Date.now()}`, code, name, desc: 'Kategori tambahan operasional gudang' });
      saveState();
      renderInventory(document.getElementById('viewContainer'));
      showToast(`Kategori "${name}" berhasil ditambahkan.`);
    }

    function addUnitForm(e) {
      e.preventDefault();
      const code = document.getElementById('newUnitCode').value.trim();
      const name = document.getElementById('newUnitName').value.trim();
      if (!code || !name) return;
      state.units.push({ code, name, desc: 'Satuan inventaris terdaftar' });
      saveState();
      renderInventory(document.getElementById('viewContainer'));
      showToast(`Satuan "${code}" berhasil ditambahkan.`);
    }

    function renderInventoryVendorPricingTab(subEl) {
      subEl.innerHTML = `
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Matriks Informasi & Harga Vendor per Barang</h3>
              <p class="text-xs text-slate-500">Perbandingan harga kontrak, Minimum Order Quantity (MOQ), dan waktu tunggu pengiriman (Lead Time) tiap pemasok</p>
            </div>
            <button type="button" onclick="switchPage('catalog')" class="text-xs font-semibold text-sky-600 hover:underline">Buka Katalog & Seleksi Penawaran →</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                  <th class="py-3 px-3">SKU / Nama Barang</th>
                  <th class="py-3 px-3">Vendor Penyedia</th>
                  <th class="py-3 px-3">No. Kontrak / Kuotasi</th>
                  <th class="py-3 px-3 text-right">Harga Satuan</th>
                  <th class="py-3 px-3 text-right">MOQ</th>
                  <th class="py-3 px-3 text-right">Lead Time</th>
                  <th class="py-3 px-3 text-center">Status Penunjukan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${state.items.map(item => (item.vendorOffers || []).map(off => {
                  const v = getVendorById(off.vendorId);
                  const isPref = item.preferredVendorId === off.vendorId;
                  return `
                    <tr class="hover:bg-slate-50">
                      <td class="py-2.5 px-3">
                        <div class="font-semibold text-slate-900">${item.name}</div>
                        <div class="font-mono text-[10px] text-sky-700">${item.sku}</div>
                      </td>
                      <td class="py-2.5 px-3">
                        <div class="font-medium text-slate-800">${v.name}</div>
                        <div class="text-[10px] text-slate-500">PIC: ${v.picName} (${v.phone})</div>
                      </td>
                      <td class="py-2.5 px-3 font-mono text-[11px] text-slate-600">${off.quoteNo}</td>
                      <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${formatRupiah(off.price)} / ${item.unit}</td>
                      <td class="py-2.5 px-3 text-right font-mono">${off.moq} ${item.unit}</td>
                      <td class="py-2.5 px-3 text-right">${off.leadTime} Hari</td>
                      <td class="py-2.5 px-3 text-center">
                        ${isPref
                          ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Vendor Utama</span>`
                          : `<button type="button" onclick="setPreferredVendor('${item.id}', '${off.vendorId}', ${off.price})" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 font-semibold text-[11px] transition">Jadikan Utama</button>`
                        }
                      </td>
                    </tr>
                  `;
                }).join('')).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    function setPreferredVendor(itemId, vendorId, newBasePrice) {
      const item = getItemById(itemId);
      if (!item) return;
      item.preferredVendorId = vendorId;
      item.basePrice = Number(newBasePrice) || item.basePrice;
      if (item.vendorOffers) {
        item.vendorOffers.forEach(o => { o.isPreferred = (o.vendorId === vendorId); });
      }
      saveState();
      renderCurrentPage();
      showToast(`${getVendorById(vendorId).name} ditetapkan sebagai Vendor Utama untuk ${item.name}.`);
    }

