    function renderStockIn(container) {
      const pre = state.prefillStockIn || {};
      const selectedWhId = pre.warehouseId || (state.globalHub !== 'ALL' ? state.globalHub : 'WH-JKT-01');
      const selectedVendorId = pre.vendorId || state.vendors[0].id;
      const selectedItemId = pre.itemId || state.items[0].id;
      const defaultQty = pre.qty || 15;
      state.prefillStockIn = null;

      const inboundHistory = state.movements.filter(m => m.type === 'IN');
      const nextGrnNo = `GRN/GS-JKT/2026/${1102 + inboundHistory.length}`;

      container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade">
          
          <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 self-start">
            <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">Formulir Inbound / GRN</span>
                <h3 class="text-base font-bold text-slate-900 mt-1">Input Penerimaan Barang Masuk</h3>
              </div>
              <span class="font-mono text-xs font-bold text-slate-500">${nextGrnNo}</span>
            </div>

            <form onsubmit="submitStockInForm(event)" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Nomor Dokumen GRN / Referensi PO *</label>
                <input id="stockInDocNo" type="text" required value="${nextGrnNo}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono bg-slate-50" />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Pilih Mitra Vendor Pengirim *</label>
                <select id="stockInVendor" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600">
                  ${state.vendors.map(v => `<option value="${v.id}" ${v.id === selectedVendorId ? 'selected' : ''}>${v.name} (${v.city})</option>`).join('')}
                </select>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Pilih Gudang Tujuan *</label>
                  <select id="stockInWarehouse" onchange="updateStockInZones()" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600">
                    ${state.warehouses.map(w => `<option value="${w.id}" ${w.id === selectedWhId ? 'selected' : ''}>${w.id} • ${w.name}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Zona / Rak Penyimpanan *</label>
                  <select id="stockInZone" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono focus:outline-none focus:border-emerald-600"></select>
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Pilih Barang / SKU yang Diterima *</label>
                <select id="stockInItem" onchange="updateStockInItemHelper()" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600">
                  ${state.items.map(it => `<option value="${it.id}" ${it.id === selectedItemId ? 'selected' : ''}>${it.sku} — ${it.name} (${it.unit})</option>`).join('')}
                </select>
                <p id="stockInItemInfo" class="text-[11px] text-slate-500 mt-1"></p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Jumlah Barang Masuk *</label>
                  <input id="stockInQty" type="number" min="1" required value="${defaultQty}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-emerald-700 focus:outline-none focus:border-emerald-600" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Tanggal & Jam Penerimaan *</label>
                  <input id="stockInDate" type="text" required value="2026-11-04 08:30" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Catatan Pemeriksaan Fisik / QC Inbound</label>
                <textarea id="stockInNotes" rows="2" placeholder="Contoh: Kemasan utuh, segel pabrikan lengkap, sesuai Surat Jalan vendor..." class="w-full px-3 py-2 rounded-xl border border-slate-300">Sesuai PO & lolos pemeriksaan QC gudang PT. Graha Segara.</textarea>
              </div>

              <button type="submit" class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span>Simpan Penerimaan & Tambah Stok Gudang</span>
              </button>
            </form>
          </div>

          
          <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-bold text-slate-900">Riwayat Barang Masuk (Inbound Log / GRN)</h3>
                <p class="text-xs text-slate-500">Daftar penerimaan barang dari vendor yang telah diverifikasi masuk ke gudang</p>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">${inboundHistory.length} Dokumen GRN</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                    <th class="py-2.5 px-3">No. GRN & Tanggal</th>
                    <th class="py-2.5 px-3">Barang Diterima</th>
                    <th class="py-2.5 px-3">Vendor Pengirim</th>
                    <th class="py-2.5 px-3">Gudang Tujuan</th>
                    <th class="py-2.5 px-3 text-right">Jumlah</th>
                    <th class="py-2.5 px-3 text-right">Bukti</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${inboundHistory.map(m => {
                    const it = getItemById(m.itemId);
                    return `
                      <tr class="hover:bg-slate-50">
                        <td class="py-3 px-3">
                          <div class="font-mono font-bold text-slate-900">${m.docNo}</div>
                          <div class="font-mono text-[10px] text-slate-500">${m.date}</div>
                        </td>
                        <td class="py-3 px-3">
                          <div class="font-semibold text-slate-900">${it.name}</div>
                          <div class="font-mono text-[10px] text-sky-700">${it.sku}</div>
                        </td>
                        <td class="py-3 px-3 text-slate-700">${m.recipientOrSource}</td>
                        <td class="py-3 px-3">
                          <span class="font-semibold text-slate-800">${m.warehouseId}</span>
                          <span class="text-[11px] font-mono text-slate-500 block">Rak: ${m.zoneCode}</span>
                        </td>
                        <td class="py-3 px-3 text-right font-mono font-bold text-emerald-600">+${m.qty} ${it.unit}</td>
                        <td class="py-3 px-3 text-right">
                          <button type="button" onclick="showTransactionDetailModal('${m.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 text-sky-700 font-semibold text-[11px]">Cetak GRN</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      updateStockInZones();
      updateStockInItemHelper();
    }

    function updateStockInZones() {
      const whId = document.getElementById('stockInWarehouse')?.value;
      const zoneSelect = document.getElementById('stockInZone');
      if (!whId || !zoneSelect) return;
      const wh = getWarehouseById(whId);
      zoneSelect.innerHTML = wh.zones.map(z => `<option value="${z.code}">${z.code} — ${z.name}</option>`).join('');
      updateStockInItemHelper();
    }

    function updateStockInItemHelper() {
      const itemId = document.getElementById('stockInItem')?.value;
      const whId = document.getElementById('stockInWarehouse')?.value;
      const infoEl = document.getElementById('stockInItemInfo');
      if (!itemId || !infoEl) return;
      const item = getItemById(itemId);
      const currentWhStock = Number(item.stockByWh?.[whId] || 0);
      infoEl.textContent = `Stok saat ini di ${whId}: ${currentWhStock} ${item.unit} • Harga Kontrak: ${formatRupiah(item.basePrice)}/${item.unit}`;
    }

    function submitStockInForm(e) {
      e.preventDefault();
      const docNo = document.getElementById('stockInDocNo').value.trim();
      const vendorId = document.getElementById('stockInVendor').value;
      const warehouseId = document.getElementById('stockInWarehouse').value;
      const zoneCode = document.getElementById('stockInZone').value;
      const itemId = document.getElementById('stockInItem').value;
      const qty = Number(document.getElementById('stockInQty').value) || 0;
      const date = document.getElementById('stockInDate').value.trim();
      const notes = document.getElementById('stockInNotes').value.trim();

      if (qty <= 0) {
        showToast('Jumlah barang masuk harus lebih dari 0.', 'error');
        return;
      }

      const item = getItemById(itemId);
      const vendor = getVendorById(vendorId);
      item.stockByWh[warehouseId] = Number(item.stockByWh[warehouseId] || 0) + qty;
      if (!item.rackLocation) item.rackLocation = {};
      item.rackLocation[warehouseId] = zoneCode;

      const newTrx = {
        id: `TRX-${Date.now()}`,
        docNo,
        type: 'IN',
        date,
        itemId,
        qty,
        warehouseId,
        zoneCode,
        vendorId,
        recipientOrSource: vendor.name,
        operator: 'Hendra Saputra',
        notes
      };
      state.movements.unshift(newTrx);
      saveState();
      renderStockIn(document.getElementById('viewContainer'));
      showToast(`Penerimaan ${qty} ${item.unit} ${item.name} ke ${warehouseId} (${zoneCode}) berhasil disimpan!`, 'success');
    }

