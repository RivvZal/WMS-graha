    function renderCatalog(container) {
      container.innerHTML = `
        <div class="space-y-5 animate-fade">
          
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Cari Barang di Katalog Penawaran Vendor</label>
              <input id="catSearchInput" type="text" oninput="filterCatalogItems()" placeholder="Cari nama barang, nomor kuotasi, atau nama vendor..." class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500" />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Filter Mitra Vendor</label>
              <select id="catVendorFilter" onchange="filterCatalogItems()" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500">
                <option value="ALL">Semua Mitra Vendor</option>
                ${state.vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Urutkan Penawaran</label>
              <select id="catSortFilter" onchange="filterCatalogItems()" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500">
                <option value="PREFERRED">Vendor Utama Terlebih Dahulu</option>
                <option value="PRICE_ASC">Harga Terendah ke Tertinggi</option>
                <option value="LEAD_ASC">Pengiriman Tercepat (Lead Time)</option>
              </select>
            </div>
          </div>

          <div id="catalogCardsContainer" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"></div>
        </div>
      `;
      filterCatalogItems();
    }

    function filterCatalogItems() {
      const q = (document.getElementById('catSearchInput')?.value || '').toLowerCase();
      const vFilter = document.getElementById('catVendorFilter')?.value || 'ALL';
      const sortBy = document.getElementById('catSortFilter')?.value || 'PREFERRED';
      const grid = document.getElementById('catalogCardsContainer');
      if (!grid) return;

      const entries = [];
      state.items.forEach(item => {
        (item.vendorOffers || []).forEach(off => {
          const vendor = getVendorById(off.vendorId);
          const isPref = item.preferredVendorId === off.vendorId;
          entries.push({ item, off, vendor, isPref });
        });
      });

      const filtered = entries.filter(({ item, off, vendor }) => {
        const matchV = vFilter === 'ALL' || vendor.id === vFilter;
        const matchQ = !q ||
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          vendor.name.toLowerCase().includes(q) ||
          off.quoteNo.toLowerCase().includes(q);
        return matchV && matchQ;
      });

      if (sortBy === 'PRICE_ASC') filtered.sort((a, b) => a.off.price - b.off.price);
      else if (sortBy === 'LEAD_ASC') filtered.sort((a, b) => a.off.leadTime - b.off.leadTime);
      else filtered.sort((a, b) => Number(b.isPref) - Number(a.isPref));

      grid.innerHTML = filtered.map(({ item, off, vendor, isPref }) => `
        <div class="bg-white rounded-2xl border ${isPref ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-slate-200'} p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="font-mono text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">${off.quoteNo}</span>
              ${isPref
                ? `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">★ Vendor Terpilih</span>`
                : `<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">Penawaran Alternatif</span>`
              }
            </div>
            <h4 class="font-bold text-sm text-slate-900">${item.name}</h4>
            <p class="text-[11px] font-mono text-slate-500 mt-0.5">SKU: ${item.sku} • Kategori: ${item.category}</p>

            <div class="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Vendor Penyedia:</span>
                <span class="font-semibold text-slate-900">${vendor.name}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Harga Penawaran:</span>
                <span class="font-mono font-extrabold text-sm text-emerald-700">${formatRupiah(off.price)} / ${item.unit}</span>
              </div>
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-slate-500">Minimum Order (MOQ):</span>
                <span class="font-mono font-semibold text-slate-800">${off.moq} ${item.unit}</span>
              </div>
              <div class="flex items-center justify-between text-[11px]">
                <span class="text-slate-500">Lead Time / Garansi:</span>
                <span class="font-semibold text-slate-800">${off.leadTime} Hari • ${off.warranty}</span>
              </div>
            </div>
          </div>

          <div class="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <button type="button" onclick="showQuotationDetailModal('${item.id}', '${vendor.id}')" class="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold">
              Detail Penawaran
            </button>
            ${!isPref ? `
              <button type="button" onclick="setPreferredVendor('${item.id}', '${vendor.id}', ${off.price})" class="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold">
                Pilih Vendor Ini
              </button>
            ` : `
              <button type="button" onclick="state.prefillStockIn={itemId:'${item.id}', vendorId:'${vendor.id}', qty:${off.moq}}; switchPage('stockin')" class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Order / Stock In →
              </button>
            `}
          </div>
        </div>
      `).join('');
    }

    function showQuotationDetailModal(itemId, vendorId) {
      const item = getItemById(itemId);
      const vendor = getVendorById(vendorId);
      const off = (item.vendorOffers || []).find(o => o.vendorId === vendorId) || item.vendorOffers[0];
      const isPref = item.preferredVendorId === vendorId;

      const html = `
        <div class="space-y-4 text-xs">
          <div class="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="text-[10px] uppercase tracking-wider text-sky-400 font-bold">Dokumen Kuotasi Harga Vendor</span>
              <h4 class="text-base font-bold font-mono mt-0.5">${off.quoteNo}</h4>
              <p class="text-slate-300 text-[11px]">Berlaku s/d: ${off.validUntil} • Termin: ${vendor.paymentTerms}</p>
            </div>
            <div class="text-left sm:text-right">
              <span class="text-[11px] text-slate-300 block">Harga Kontrak Satuan</span>
              <span class="text-xl font-extrabold text-emerald-400 font-mono">${formatRupiah(off.price)} / ${item.unit}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div class="text-[10px] font-bold uppercase text-slate-400">Spesifikasi Barang</div>
              <div class="font-bold text-slate-900">${item.name}</div>
              <div class="font-mono text-sky-700 text-[11px]">SKU: ${item.sku}</div>
              <p class="text-slate-600 pt-1">${item.specs}</p>
            </div>
            <div class="p-3.5 rounded-xl border border-slate-200 space-y-1">
              <div class="text-[10px] font-bold uppercase text-slate-400">Informasi Mitra Pemasok</div>
              <div class="font-bold text-slate-900">${vendor.name}</div>
              <div class="text-slate-600">PIC: ${vendor.picName} (${vendor.phone})</div>
              <div class="text-slate-600">Garansi: <strong>${off.warranty}</strong></div>
              <div class="text-slate-600">Estimasi Tiba: <strong>${off.leadTime} Hari Kerja</strong></div>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div class="font-bold text-slate-800 mb-2">Simulasi Nilai Pemesanan Berdasarkan MOQ (${off.moq} ${item.unit})</div>
            <div class="flex items-center justify-between text-slate-700">
              <span>Subtotal (${off.moq} ${item.unit} × ${formatRupiah(off.price)})</span>
              <span class="font-mono font-bold">${formatRupiah(off.moq * off.price)}</span>
            </div>
            <div class="flex items-center justify-between text-slate-700 mt-1">
              <span>PPN 11%</span>
              <span class="font-mono">${formatRupiah(Math.round(off.moq * off.price * 0.11))}</span>
            </div>
            <div class="flex items-center justify-between text-slate-900 font-bold pt-2 mt-2 border-t border-slate-200 text-sm">
              <span>Total Estimasi PO</span>
              <span class="font-mono text-sky-700">${formatRupiah(Math.round(off.moq * off.price * 1.11))}</span>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            ${!isPref ? `
              <button type="button" onclick="closeModal(); setPreferredVendor('${item.id}', '${vendor.id}', ${off.price})" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold">
                Tetapkan Sebagai Vendor Utama
              </button>
            ` : ''}
            <button type="button" onclick="closeModal(); state.prefillStockIn={itemId:'${item.id}', vendorId:'${vendor.id}', qty:${off.moq}}; switchPage('stockin')" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              Lanjut ke Penerimaan Barang (Stock In)
            </button>
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">Tutup</button>
          </div>
        </div>
      `;
      openModal(`Detail Penawaran Vendor — ${off.quoteNo}`, html);
    }

