    function renderStockOut(container) {
      const outboundHistory = state.movements.filter(m => m.type === 'OUT');
      const nextDoNo = `DO/GS-JKT/2026/${895 + outboundHistory.length}`;
      const defaultWh = state.globalHub !== 'ALL' ? state.globalHub : 'WH-JKT-01';

      container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade">
          
          <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 self-start">
            <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase">Formulir Outbound / DO</span>
                <h3 class="text-base font-bold text-slate-900 mt-1">Input Pengeluaran Barang (Stock Out)</h3>
              </div>
              <span class="font-mono text-xs font-bold text-slate-500">${nextDoNo}</span>
            </div>

            <form onsubmit="submitStockOutForm(event)" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-semibold text-slate-700 mb-1">Nomor Surat Jalan / Goods Issue (DO) *</label>
                <input id="stockOutDocNo" type="text" required value="${nextDoNo}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono bg-slate-50" />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Pilih Gudang Asal *</label>
                <select id="stockOutWarehouse" onchange="updateStockOutHelper()" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600">
                  ${state.warehouses.map(w => `<option value="${w.id}" ${w.id === defaultWh ? 'selected' : ''}>${w.id} • ${w.name}</option>`).join('')}
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Pilih Barang yang Dikeluarkan *</label>
                <select id="stockOutItem" onchange="updateStockOutHelper()" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600">
                  ${state.items.map(it => `<option value="${it.id}">${it.sku} — ${it.name} (${it.unit})</option>`).join('')}
                </select>
                <div id="stockOutAvailBanner" class="mt-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between"></div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Jumlah Barang Keluar *</label>
                  <input id="stockOutQty" type="number" min="1" required value="5" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-amber-700 focus:outline-none focus:border-amber-600" />
                </div>
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Tanggal & Jam Keluar *</label>
                  <input id="stockOutDate" type="text" required value="2026-11-04 09:00" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
                </div>
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Unit Tujuan / Divisi Penerima *</label>
                <input id="stockOutRecipient" type="text" required placeholder="Contoh: Tim Inspeksi TPFT Blok A / Workshop MHE..." value="Tim Operasional Lapangan TPFT Tanjung Priok" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600" />
              </div>

              <div>
                <label class="block font-semibold text-slate-700 mb-1">Keperluan / Catatan Pengeluaran</label>
                <textarea id="stockOutNotes" rows="2" class="w-full px-3 py-2 rounded-xl border border-slate-300">Kebutuhan operasional harian pemeriksaan kontainer & pemeliharaan fasilitas.</textarea>
              </div>

              <button type="submit" class="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm transition flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
                <span>Proses Pengeluaran Barang & Kurangi Stok</span>
              </button>
            </form>
          </div>

          
          <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-bold text-slate-900">Riwayat Barang Keluar (Outbound Log / DO)</h3>
                <p class="text-xs text-slate-500">Daftar pengeluaran barang dari gudang ke unit operasional atau penerima</p>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-50 text-amber-700 border border-amber-200">${outboundHistory.length} Dokumen DO</span>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                    <th class="py-2.5 px-3">No. DO & Tanggal</th>
                    <th class="py-2.5 px-3">Barang Keluar</th>
                    <th class="py-2.5 px-3">Gudang Asal</th>
                    <th class="py-2.5 px-3">Tujuan / Penerima</th>
                    <th class="py-2.5 px-3 text-right">Jumlah</th>
                    <th class="py-2.5 px-3 text-right">Surat Jalan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${outboundHistory.map(m => {
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
                        <td class="py-3 px-3">
                          <span class="font-semibold text-slate-800">${m.warehouseId}</span>
                          <span class="text-[10px] font-mono text-slate-500 block">Rak: ${m.zoneCode}</span>
                        </td>
                        <td class="py-3 px-3 text-slate-700">${m.recipientOrSource}</td>
                        <td class="py-3 px-3 text-right font-mono font-bold text-amber-600">-${m.qty} ${it.unit}</td>
                        <td class="py-3 px-3 text-right">
                          <button type="button" onclick="showTransactionDetailModal('${m.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-amber-700 font-semibold text-[11px]">Cetak DO</button>
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
      updateStockOutHelper();
    }

    function updateStockOutHelper() {
      const whId = document.getElementById('stockOutWarehouse')?.value;
      const itemId = document.getElementById('stockOutItem')?.value;
      const banner = document.getElementById('stockOutAvailBanner');
      if (!whId || !itemId || !banner) return;
      const item = getItemById(itemId);
      const avail = Number(item.stockByWh?.[whId] || 0);
      const rack = item.rackLocation?.[whId] || 'Z-01';
      banner.innerHTML = `
        <span>Stok Tersedia di <strong>${whId}</strong> (Rak <span class="font-mono">${rack}</span>):</span>
        <span class="font-mono font-bold text-sm ${avail > 0 ? 'text-emerald-700' : 'text-rose-600'}">${avail} ${item.unit}</span>
      `;
    }

    function submitStockOutForm(e) {
      e.preventDefault();
      const docNo = document.getElementById('stockOutDocNo').value.trim();
      const warehouseId = document.getElementById('stockOutWarehouse').value;
      const itemId = document.getElementById('stockOutItem').value;
      const qty = Number(document.getElementById('stockOutQty').value) || 0;
      const date = document.getElementById('stockOutDate').value.trim();
      const recipientOrSource = document.getElementById('stockOutRecipient').value.trim();
      const notes = document.getElementById('stockOutNotes').value.trim();

      const item = getItemById(itemId);
      const avail = Number(item.stockByWh?.[warehouseId] || 0);

      if (qty <= 0) {
        showToast('Jumlah pengeluaran barang harus lebih dari 0.', 'error');
        return;
      }
      if (qty > avail) {
        showToast(`Stok di ${warehouseId} tidak mencukupi! Tersedia: ${avail} ${item.unit}, diminta: ${qty} ${item.unit}.`, 'error');
        return;
      }

      item.stockByWh[warehouseId] = avail - qty;
      const zoneCode = item.rackLocation?.[warehouseId] || getWarehouseById(warehouseId).zones[0]?.code || 'Z-01';

      state.movements.unshift({
        id: `TRX-${Date.now()}`,
        docNo,
        type: 'OUT',
        date,
        itemId,
        qty,
        warehouseId,
        zoneCode,
        vendorId: null,
        recipientOrSource,
        operator: 'Hendra Saputra',
        notes
      });

      saveState();
      renderStockOut(document.getElementById('viewContainer'));
      showToast(`Pengeluaran ${qty} ${item.unit} ${item.name} dari ${warehouseId} berhasil dicatat!`, 'success');
    }

