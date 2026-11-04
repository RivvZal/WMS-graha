    function renderMovements(container) {
      container.innerHTML = `
        <div class="space-y-5 animate-fade">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">Cari No. Dokumen / Barang / Tujuan</label>
                <input id="movSearchInput" type="text" oninput="filterMovementsTable()" placeholder="Ketik GRN, DO, TRF, atau nama barang..." class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500" />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">Filter Tipe Pergerakan</label>
                <select id="movTypeFilter" onchange="filterMovementsTable()" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500">
                  <option value="ALL">Semua Transaksi (IN, OUT, TRANSFER)</option>
                  <option value="IN">IN — Penerimaan Barang Masuk</option>
                  <option value="OUT">OUT — Pengeluaran Barang</option>
                  <option value="TRANSFER">TRANSFER — Mutasi Antar Gudang</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-500 mb-1">Filter Gudang</label>
                <select id="movWhFilter" onchange="filterMovementsTable()" class="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500">
                  <option value="ALL">Semua Gudang</option>
                  ${state.warehouses.filter(w => state.globalHub === 'ALL' || w.id === state.globalHub).map(w => `<option value="${w.id}">${w.name}</option>`).join('')}
                </select>
              </div>
            </div>
            <button type="button" onclick="openTransferModal()" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs shrink-0">
              ⇄ Buat Transfer Antar Gudang
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                  <th class="py-3 px-3">No. Dokumen</th>
                  <th class="py-3 px-3">Tanggal & Jam</th>
                  <th class="py-3 px-3">Tipe</th>
                  <th class="py-3 px-3">SKU & Nama Barang</th>
                  <th class="py-3 px-3">Gudang</th>
                  <th class="py-3 px-3 text-right">Kuantitas</th>
                  <th class="py-3 px-3">Sumber / Tujuan & Catatan</th>
                  <th class="py-3 px-3">Operator</th>
                  <th class="py-3 px-3 text-right">Bukti</th>
                </tr>
              </thead>
              <tbody id="movementsTableBody" class="divide-y divide-slate-100"></tbody>
            </table>
          </div>
        </div>
      `;
      filterMovementsTable();
    }

    function filterMovementsTable() {
      const q = (document.getElementById('movSearchInput')?.value || '').toLowerCase();
      const tFilter = document.getElementById('movTypeFilter')?.value || 'ALL';
      const wFilter = document.getElementById('movWhFilter')?.value || 'ALL';
      const tbody = document.getElementById('movementsTableBody');
      if (!tbody) return;

      const list = state.movements.filter(m => {
        const item = getItemById(m.itemId);
        const matchT = tFilter === 'ALL' || m.type === tFilter;
        const matchW = wFilter === 'ALL' || m.warehouseId === wFilter || m.targetWarehouseId === wFilter;
        const matchQ = !q ||
          m.docNo.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          getWarehouseById(m.warehouseId).name.toLowerCase().includes(q) ||
          (m.targetWarehouseId && getWarehouseById(m.targetWarehouseId).name.toLowerCase().includes(q)) ||
          (m.recipientOrSource || '').toLowerCase().includes(q);
        return movementMatchesWarehouseFilter(m) && matchT && matchW && matchQ;
      });

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-slate-400">Tidak ada riwayat transaksi yang sesuai filter.</td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(m => {
        const item = getItemById(m.itemId);
        const badge = m.type === 'IN'
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : m.type === 'OUT'
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-sky-50 text-sky-700 border-sky-200';
        const sign = m.type === 'IN' ? '+' : m.type === 'OUT' ? '-' : '⇄ ';
        return `
          <tr class="hover:bg-slate-50">
            <td class="py-3 px-3 font-mono font-bold text-slate-900">${m.docNo}</td>
            <td class="py-3 px-3 font-mono text-[11px] text-slate-500">${m.date}</td>
            <td class="py-3 px-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge}">${m.type}</span></td>
            <td class="py-3 px-3">
              <div class="font-semibold text-slate-900">${item.name}</div>
              <div class="font-mono text-[10px] text-sky-700">${item.sku}</div>
            </td>
            <td class="py-3 px-3">
              <div class="font-semibold text-slate-800">${getWarehouseById(m.warehouseId).name}${m.targetWarehouseId ? ' → ' + getWarehouseById(m.targetWarehouseId).name : ''}</div>
            </td>
            <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">${sign}${m.qty} ${item.unit}</td>
            <td class="py-3 px-3 max-w-xs">
              <div class="font-medium text-slate-800 truncate">${m.recipientOrSource}</div>
              <div class="text-[11px] text-slate-500 truncate">${m.notes || '-'}</div>
            </td>
            <td class="py-3 px-3 text-slate-600">${m.operator}</td>
            <td class="py-3 px-3 text-right">
              <button type="button" onclick="showTransactionDetailModal('${m.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 text-sky-700 font-semibold text-[11px]">Lihat Bukti</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    function openTransferModal() {
      const html = `
        <form onsubmit="submitTransferForm(event)" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Gudang Asal *</label>
              <select id="trfSourceWh" class="w-full px-3 py-2 rounded-xl border border-slate-300">
                ${state.warehouses.map(w => `<option value="${w.id}">${w.id} • ${w.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Gudang Tujuan *</label>
              <select id="trfTargetWh" class="w-full px-3 py-2 rounded-xl border border-slate-300">
                ${state.warehouses.map((w, i) => `<option value="${w.id}" ${i === 1 ? 'selected' : ''}>${w.id} • ${w.name}</option>`).join('')}
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Pilih Barang yang Dimutasi *</label>
              <select id="trfItem" class="w-full px-3 py-2 rounded-xl border border-slate-300">
                ${state.items.map(it => `<option value="${it.id}">${it.sku} — ${it.name} (Stok total: ${getItemTotalStock(it, 'ALL')} ${it.unit})</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Jumlah Transfer *</label>
              <input id="trfQty" type="number" min="1" required value="5" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Keterangan Mutasi</label>
              <input id="trfNotes" type="text" value="Realokasi stok operasional antar gudang divisi" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">Batal</button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold">Proses Transfer Stok</button>
          </div>
        </form>
      `;
      openModal('Mutasi / Transfer Stok Antar Gudang PT. Graha Segara', html);
    }

    function submitTransferForm(e) {
      e.preventDefault();
      const srcWh = document.getElementById('trfSourceWh').value;
      const dstWh = document.getElementById('trfTargetWh').value;
      const itemId = document.getElementById('trfItem').value;
      const qty = Number(document.getElementById('trfQty').value) || 0;
      const notes = document.getElementById('trfNotes').value.trim();

      if (srcWh === dstWh) {
        showToast('Gudang asal dan gudang tujuan tidak boleh sama.', 'error');
        return;
      }
      const item = getItemById(itemId);
      const avail = Number(item.stockByWh?.[srcWh] || 0);
      if (qty > avail) {
        showToast(`Stok di ${srcWh} hanya tersedia ${avail} ${item.unit}.`, 'error');
        return;
      }

      item.stockByWh[srcWh] = avail - qty;
      item.stockByWh[dstWh] = Number(item.stockByWh?.[dstWh] || 0) + qty;

      state.movements.unshift({
        id: `TRX-${Date.now()}`,
        docNo: `TRF/GS-NAS/2026/00${92 + state.movements.length}`,
        type: 'TRANSFER',
        date: '2026-11-04 09:15',
        itemId,
        qty,
        warehouseId: srcWh,
        targetWarehouseId: dstWh,
        vendorId: null,
        recipientOrSource: `Mutasi antar gudang: ${srcWh} ke ${dstWh}`,
        operator: 'Hendra Saputra',
        notes
      });

      saveState();
      closeModal();
      renderMovements(document.getElementById('viewContainer'));
      showToast(`Transfer ${qty} ${item.unit} ${item.name} dari ${srcWh} ke ${dstWh} berhasil!`, 'success');
    }

    function showTransactionDetailModal(trxId) {
      const m = state.movements.find(t => t.id === trxId);
      if (!m) return;
      const item = getItemById(m.itemId);
      const wh = getWarehouseById(m.warehouseId);
      const inboundPriceKnown = m.type === 'IN' && m.unitPrice != null;
      const displayedPrice = inboundPriceKnown ? Number(m.unitPrice) : null;
      const transactionValue = m.type === 'IN'
        ? (inboundPriceKnown ? formatRupiah(Number(m.qty) * displayedPrice) : 'Belum dicatat')
        : formatRupiah(Number(m.qty) * Number(item.basePrice || 0));

      const html = `
        <div class="space-y-4 text-xs">
          <div class="p-4 rounded-xl border border-sky-200 bg-sky-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="font-extrabold text-sm text-slate-900">PT. GRAHA SEGARA — WAREHOUSE MANAGEMENT SYSTEM</div>
              <div class="text-[11px] text-slate-500">Manajemen persediaan gudang divisi</div>
            </div>
            <div class="text-left sm:text-right">
              <span class="px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-xs">${m.docNo}</span>
              <div class="text-[11px] text-slate-500 font-mono mt-1">Tanggal: ${m.date}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="p-3 rounded-xl border border-slate-200">
              <span class="text-[10px] font-bold uppercase text-slate-400">Fasilitas Gudang</span>
              <p class="font-bold text-slate-900 mt-0.5">${wh.name} (${wh.id})</p>
            </div>
            <div class="p-3 rounded-xl border border-slate-200">
              <span class="text-[10px] font-bold uppercase text-slate-400">Vendor / Unit Penerima</span>
              <p class="font-bold text-slate-900 mt-0.5">${m.recipientOrSource}</p>
              <p class="text-[11px] text-slate-500">Petugas Otorisasi: ${m.operator}</p>
            </div>
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100 border-b border-slate-200 text-[10px] uppercase text-slate-600">
                  <th class="py-2 px-3">Kode SKU</th>
                  <th class="py-2 px-3">Deskripsi Barang</th>
                  <th class="py-2 px-3">Tanggal Produksi</th>
                  <th class="py-2 px-3 text-right">Kuantitas</th>
                  <th class="py-2 px-3 text-right">Harga / Unit</th>
                  <th class="py-2 px-3 text-right">Nilai Barang</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-3 px-3 font-mono font-bold text-sky-700">${item.sku}</td>
                  <td class="py-3 px-3 font-semibold text-slate-900">${item.name}</td>
                  <td class="py-3 px-3">${m.type === 'IN' ? (m.productionDate || 'Belum dicatat') : '—'}</td>
                  <td class="py-3 px-3 text-right font-mono font-bold text-sm">${m.qty} ${item.unit}</td>
                  <td class="py-3 px-3 text-right font-mono">${m.type === 'IN' ? (inboundPriceKnown ? formatRupiah(displayedPrice) : 'Belum dicatat') : '—'}</td>
                  <td class="py-3 px-3 text-right font-mono">${transactionValue}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Catatan Pemeriksaan / Keterangan</span>
            <p class="text-slate-700 mt-0.5">${m.notes || '-'}</p>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="window.print()" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold">Cetak Dokumen</button>
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">Tutup</button>
          </div>
        </div>
      `;
      openModal(`Bukti Transaksi Logistik — ${m.docNo}`, html);
    }

