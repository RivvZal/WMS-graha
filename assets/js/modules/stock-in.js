    let stockInView = 'history';

    function openStockInForm() {
      stockInView = 'form';
      renderStockIn(document.getElementById('viewContainer'));
    }

    function openStockInHistory() {
      stockInView = 'history';
      renderStockIn(document.getElementById('viewContainer'));
    }

    function renderStockIn(container) {
      const showForm = stockInView === 'form';
      const pre = state.prefillStockIn || {};
      const selectedWhId = pre.warehouseId || (state.globalHub !== 'ALL' ? state.globalHub : 'WH-JKT-01');
      const selectedVendorId = pre.vendorId || state.vendors[0].id;
      const selectedItemId = pre.itemId || state.items[0].id;
      const defaultQty = pre.qty || 15;
      if (showForm) state.prefillStockIn = null;

      const inboundHistory = state.movements.filter(m => m.type === 'IN');
      const nextGrnNo = `GRN/GS-JKT/2026/${1102 + inboundHistory.length}`;

      container.innerHTML = `
        <div class="space-y-6 animate-fade">
          
          <div class="${showForm ? '' : 'hidden'} w-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 self-start">
            <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">Formulir Inbound / GRN</span>
                <h3 class="text-base font-bold text-slate-900 mt-1">Input Penerimaan Barang Masuk</h3>
              </div>
              <button type="button" onclick="openStockInHistory()" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">Kembali ke riwayat</button>
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

              <div class="grid grid-cols-1 gap-3">
                <div>
                  <label class="block font-semibold text-slate-700 mb-1">Pilih Gudang Tujuan *</label>
                  <select id="stockInWarehouse" onchange="updateStockInItemHelper()" class="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600">
                    ${state.warehouses.map(w => `<option value="${w.id}" ${w.id === selectedWhId ? 'selected' : ''}>${w.id} • ${w.name}</option>`).join('')}
                  </select>
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

          
          <div class="${showForm ? 'hidden' : ''} bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-bold text-slate-900">Riwayat Barang Masuk (Inbound Log / GRN)</h3>
                <p class="text-xs text-slate-500">Daftar penerimaan barang dari vendor yang telah diverifikasi masuk ke gudang</p>
              </div>
              <div class="flex flex-col sm:flex-row gap-2">
                <label class="relative">
                  <span class="sr-only">Cari riwayat barang masuk</span>
                  <input id="stockInHistorySearch" type="search" oninput="filterStockInHistory(this.value)" placeholder="Cari GRN, barang, vendor, gudang..." class="w-full sm:w-64 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-3 text-xs focus:border-sky-500 focus:bg-white focus:outline-none" />
                </label>
                <button type="button" onclick="openStockInForm()" class="shrink-0 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700">+ Form Penerimaan</button>
              </div>
            </div>
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
              <span class="text-slate-500">Daftar transaksi penerimaan</span>
              <span id="stockInHistoryCount" class="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">${inboundHistory.length} dokumen GRN</span>
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
                    <th class="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody id="stockInHistoryBody" class="divide-y divide-slate-100">${renderStockInHistoryRows(inboundHistory)}</tbody>
              </table>
            </div>
          </div>
        </div>
      `;

      updateStockInItemHelper();
    }

    function renderStockInHistoryRows(rows) {
      if (!rows.length) return '<tr><td colspan="6" class="py-10 text-center text-slate-400">Tidak ada riwayat yang cocok.</td></tr>';
      return rows.map(m => {
        const item = getItemById(m.itemId);
        return `
          <tr class="hover:bg-slate-50">
            <td class="py-3 px-3"><div class="font-mono font-bold text-slate-900">${m.docNo}</div><div class="font-mono text-[10px] text-slate-500">${m.date}</div></td>
            <td class="py-3 px-3"><div class="font-semibold text-slate-900">${item.name}</div><div class="font-mono text-[10px] text-sky-700">${item.sku}</div></td>
            <td class="py-3 px-3 text-slate-700">${m.recipientOrSource || '-'}</td>
            <td class="py-3 px-3"><span class="font-semibold text-slate-800">${m.warehouseId}</span></td>
            <td class="py-3 px-3 text-right font-mono font-bold text-emerald-600">+${m.qty} ${item.unit}</td>
            <td class="py-3 px-3 text-right"><div class="flex justify-end gap-1.5"><button type="button" onclick="openStockInEditModal('${m.id}')" class="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700">Edit</button><button type="button" onclick="showTransactionDetailModal('${m.id}')" class="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700 hover:bg-sky-50">Bukti</button><button type="button" onclick="confirmDeleteStockIn('${m.id}')" class="rounded-lg bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100">Hapus</button></div></td>
          </tr>
        `;
      }).join('');
    }

    function filterStockInHistory(query) {
      const term = String(query || '').trim().toLowerCase();
      const rows = state.movements.filter(m => {
        if (m.type !== 'IN') return false;
        const item = getItemById(m.itemId);
        const vendor = getVendorById(m.vendorId);
        return [m.docNo, m.date, m.warehouseId, m.recipientOrSource, item.name, item.sku, vendor.name]
          .some(value => String(value || '').toLowerCase().includes(term));
      });
      const body = document.getElementById('stockInHistoryBody');
      const count = document.getElementById('stockInHistoryCount');
      if (body) body.innerHTML = renderStockInHistoryRows(rows);
      if (count) count.textContent = `${rows.length} dokumen GRN`;
    }

    function openStockInEditModal(transactionId) {
      const transaction = state.movements.find(m => m.id === transactionId && m.type === 'IN');
      if (!transaction) return;
      const itemOptions = state.items.map(item => `<option value="${item.id}" ${item.id === transaction.itemId ? 'selected' : ''}>${item.sku} — ${item.name}</option>`).join('');
      const warehouseOptions = state.warehouses.map(warehouse => `<option value="${warehouse.id}" ${warehouse.id === transaction.warehouseId ? 'selected' : ''}>${warehouse.id} — ${warehouse.name}</option>`).join('');
      const vendorOptions = state.vendors.map(vendor => `<option value="${vendor.id}" ${vendor.id === transaction.vendorId ? 'selected' : ''}>${vendor.name}</option>`).join('');
      const html = `
        <form onsubmit="saveStockInEdit(event, '${transaction.id}')" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="block font-semibold text-slate-700">Nomor GRN<input id="editStockInDocNo" required value="${escapeProfileValue(transaction.docNo)}" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono font-normal" /></label>
            <label class="block font-semibold text-slate-700">Tanggal & waktu<input id="editStockInDate" required value="${escapeProfileValue(transaction.date)}" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono font-normal" /></label>
            <label class="block font-semibold text-slate-700 sm:col-span-2">Barang<select id="editStockInItem" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal">${itemOptions}</select></label>
            <label class="block font-semibold text-slate-700 sm:col-span-2">Vendor<select id="editStockInVendor" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal">${vendorOptions}</select></label>
            <label class="block font-semibold text-slate-700 sm:col-span-2">Gudang<select id="editStockInWarehouse" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal">${warehouseOptions}</select></label>
            <label class="block font-semibold text-slate-700">Jumlah<input id="editStockInQty" type="number" min="1" required value="${Number(transaction.qty)}" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-mono font-normal" /></label>
            <label class="block font-semibold text-slate-700 sm:col-span-2">Catatan<textarea id="editStockInNotes" rows="2" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal">${escapeProfileValue(transaction.notes || '')}</textarea></label>
          </div>
          <div class="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button type="button" onclick="closeModal()" class="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700">Batal</button>
            <button type="submit" class="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">Simpan perubahan</button>
          </div>
        </form>
      `;
      openModal(`Edit Barang Masuk · ${transaction.docNo}`, html, 'max-w-2xl');
    }

    function saveStockInEdit(event, transactionId) {
      event.preventDefault();
      const transaction = state.movements.find(m => m.id === transactionId && m.type === 'IN');
      if (!transaction) return;
      const next = {
        docNo: document.getElementById('editStockInDocNo').value.trim(),
        date: document.getElementById('editStockInDate').value.trim(),
        itemId: document.getElementById('editStockInItem').value,
        vendorId: document.getElementById('editStockInVendor').value,
        warehouseId: document.getElementById('editStockInWarehouse').value,
        qty: Number(document.getElementById('editStockInQty').value) || 0,
        notes: document.getElementById('editStockInNotes').value.trim()
      };
      if (next.qty <= 0) {
        showToast('Jumlah barang masuk harus lebih dari 0.', 'error');
        return;
      }

      const oldItem = getItemById(transaction.itemId);
      const oldBalance = Number(oldItem.stockByWh?.[transaction.warehouseId] || 0);
      const sameStock = transaction.itemId === next.itemId && transaction.warehouseId === next.warehouseId;
      const projectedOldBalance = oldBalance - Number(transaction.qty || 0) + (sameStock ? next.qty : 0);
      if (projectedOldBalance < 0) {
        showToast('Stok sudah terpakai. Transaksi ini tidak bisa diubah ke data tersebut.', 'error');
        return;
      }

      oldItem.stockByWh[transaction.warehouseId] = oldBalance - Number(transaction.qty || 0);
      const newItem = getItemById(next.itemId);
      newItem.stockByWh[next.warehouseId] = Number(newItem.stockByWh?.[next.warehouseId] || 0) + next.qty;
      Object.assign(transaction, next, { recipientOrSource: getVendorById(next.vendorId).name });
      saveState();
      closeModal();
      renderStockIn(document.getElementById('viewContainer'));
      showToast('Transaksi barang masuk berhasil diperbarui.');
    }

    function confirmDeleteStockIn(transactionId) {
      const transaction = state.movements.find(m => m.id === transactionId && m.type === 'IN');
      if (!transaction) return;
      const item = getItemById(transaction.itemId);
      const html = `
        <div class="space-y-4 text-sm">
          <p class="text-slate-600">Hapus penerimaan <strong>${escapeProfileValue(transaction.docNo)}</strong> untuk ${escapeProfileValue(item.name)}? Stok gudang akan dikurangi sebanyak ${transaction.qty} ${item.unit}.</p>
          <div class="flex justify-end gap-2 border-t border-slate-200 pt-3">
            <button type="button" onclick="closeModal()" class="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">Batal</button>
            <button type="button" onclick="deleteStockIn('${transaction.id}')" class="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700">Hapus transaksi</button>
          </div>
        </div>
      `;
      openModal('Hapus Barang Masuk', html, 'max-w-md');
    }

    function deleteStockIn(transactionId) {
      const index = state.movements.findIndex(m => m.id === transactionId && m.type === 'IN');
      if (index === -1) return;
      const transaction = state.movements[index];
      const item = getItemById(transaction.itemId);
      const balance = Number(item.stockByWh?.[transaction.warehouseId] || 0);
      if (balance < Number(transaction.qty || 0)) {
        closeModal();
        showToast('Penerimaan ini tidak dapat dihapus karena sebagian stoknya sudah keluar.', 'error');
        return;
      }
      item.stockByWh[transaction.warehouseId] = balance - Number(transaction.qty || 0);
      state.movements.splice(index, 1);
      saveState();
      closeModal();
      renderStockIn(document.getElementById('viewContainer'));
      showToast('Transaksi barang masuk berhasil dihapus.');
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

      const newTrx = {
        id: `TRX-${Date.now()}`,
        docNo,
        type: 'IN',
        date,
        itemId,
        qty,
        warehouseId,
        vendorId,
        recipientOrSource: vendor.name,
        operator: 'Hendra Saputra',
        notes
      };
      state.movements.unshift(newTrx);
      saveState();
      stockInView = 'history';
      renderStockIn(document.getElementById('viewContainer'));
      showToast(`Penerimaan ${qty} ${item.unit} ${item.name} ke ${warehouseId} berhasil disimpan!`, 'success');
    }

