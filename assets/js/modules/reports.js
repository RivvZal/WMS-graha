    function renderReports(container) {
      let totalUnitsAll = 0;
      let totalValueAll = 0;
      state.items.forEach(it => {
        const q = getItemTotalStock(it, state.globalHub);
        totalUnitsAll += q;
        totalValueAll += q * it.basePrice;
      });

      container.innerHTML = `
        <div class="space-y-6 animate-fade">
          
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Laporan Valuasi Persediaan, Pergerakan Stok & Kinerja Gudang</h3>
              <p class="text-xs text-slate-500">Periode Laporan: November 2026 • Cakupan: ${state.globalHub === 'ALL' ? 'Seluruh Gudang Divisi PT. Graha Segara' : getWarehouseById(state.globalHub).name}</p>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="exportInventoryCsv()" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs">
                Unduh CSV Laporan Stok
              </button>
              <button type="button" onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold">
                Cetak Laporan
              </button>
            </div>
          </div>

          
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-bold text-slate-900">1. Rekapitulasi Valuasi Inventaris & Sebaran Stok Gudang</h4>
              <span class="font-mono text-xs font-bold text-sky-700">Total Nilai: ${formatRupiah(totalValueAll)} (${totalUnitsAll.toLocaleString('id-ID')} Unit)</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                    <th class="py-2.5 px-3">SKU</th>
                    <th class="py-2.5 px-3">Nama Barang</th>
                    ${state.warehouses.map(wh => `<th class="py-2.5 px-3 text-right">${wh.name}</th>`).join('')}
                    <th class="py-2.5 px-3 text-right">Total Stok</th>
                    <th class="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th class="py-2.5 px-3 text-right">Total Valuasi (Rp)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${state.items.map(it => {
                    const tot = getItemTotalStock(it, 'ALL');
                    return `
                      <tr class="hover:bg-slate-50">
                        <td class="py-2.5 px-3 font-mono font-bold text-sky-700">${it.sku}</td>
                        <td class="py-2.5 px-3 font-medium text-slate-900">${it.name}</td>
                        ${state.warehouses.map(wh => `<td class="py-2.5 px-3 text-right font-mono">${it.stockByWh?.[wh.id] || 0}</td>`).join('')}
                        <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${tot} ${it.unit}</td>
                        <td class="py-2.5 px-3 text-right font-mono text-slate-600">${formatRupiah(it.basePrice)}</td>
                        <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-700">${formatRupiah(tot * it.basePrice)}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 class="text-sm font-bold text-slate-900 mb-3">2. Ringkasan Stok per Gudang Divisi</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                      <th class="py-2 px-2.5">Gudang</th>
                      <th class="py-2 px-2.5">Divisi</th>
                      <th class="py-2 px-2.5 text-right">Jenis Barang</th>
                      <th class="py-2 px-2.5 text-right">Total Unit</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    ${state.warehouses.map(w => {
                      const units = state.items.reduce((sum, item) => sum + Number(item.stockByWh?.[w.id] || 0), 0);
                      const kinds = state.items.filter(item => Number(item.stockByWh?.[w.id] || 0) > 0).length;
                      return `
                        <tr>
                          <td class="py-2.5 px-2.5 font-semibold text-slate-800">${w.name}</td>
                          <td class="py-2.5 px-2.5">${w.division}${w.subDivision ? ` · ${w.subDivision}` : ''}</td>
                          <td class="py-2.5 px-2.5 text-right font-mono">${kinds}</td>
                          <td class="py-2.5 px-2.5 text-right font-mono font-bold text-sky-700">${units.toLocaleString('id-ID')}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h4 class="text-sm font-bold text-slate-900 mb-3">3. Ketentuan Pengadaan Vendor</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                      <th class="py-2 px-2.5">Mitra Vendor</th>
                      <th class="py-2 px-2.5">Termin</th>
                      <th class="py-2 px-2.5 text-right">Lead Time</th>
                      <th class="py-2 px-2.5">Kategori</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    ${state.vendors.map(v => `
                      <tr>
                        <td class="py-2.5 px-2.5 font-semibold text-slate-800">${v.name}</td>
                        <td class="py-2.5 px-2.5 text-slate-600">${v.paymentTerms}</td>
                        <td class="py-2.5 px-2.5 text-right font-mono">${v.leadTimeDays} Hari</td>
                        <td class="py-2.5 px-2.5 text-slate-600">${v.category}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function exportInventoryCsv() {
      const headers = ['SKU', 'Nama Barang', 'Kategori', 'Satuan', ...state.warehouses.map(wh => wh.name), 'Total Stok', 'Harga Satuan', 'Total Valuasi'];
      const rows = state.items.map(it => {
        const tot = getItemTotalStock(it, 'ALL');
        return [
          it.sku,
          `"${it.name.replace(/"/g, '""')}"`,
          `"${it.category}"`,
          it.unit,
          ...state.warehouses.map(wh => it.stockByWh?.[wh.id] || 0),
          tot,
          it.basePrice,
          tot * it.basePrice
        ].join(',');
      });
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Laporan_WMS_PT_Graha_Segara_2026.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('File CSV Laporan Inventaris PT. Graha Segara berhasil diunduh.');
    }

