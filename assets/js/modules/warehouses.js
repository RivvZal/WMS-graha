function renderWarehouse(container) {
  const selectedWh = getWarehouseById(state.warehouseSelectedId || state.warehouses[0].id);
  const totalStock = wh => state.items.reduce((sum, item) => sum + Number(item.stockByWh?.[wh.id] || 0), 0);

  container.innerHTML = `
    <div class="space-y-6 animate-fade">
      <div>
        <h3 class="text-lg font-bold text-slate-900">Gudang Divisi</h3>
        <p class="text-sm text-slate-500">Pilih gudang untuk melihat ringkasan stok. GA memiliki gudang Property dan Building.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        ${state.warehouses.map(wh => {
          const active = wh.id === selectedWh.id;
          const qty = totalStock(wh);
          return `
            <button type="button" onclick="state.warehouseSelectedId='${wh.id}'; renderWarehouse(document.getElementById('viewContainer'))" class="warehouse-card text-left p-4 rounded-2xl border transition ${active ? 'is-selected bg-sky-50 border-sky-300 shadow-sm' : 'bg-white border-slate-200 hover:border-sky-300'}">
              <div class="flex items-start justify-between gap-2">
                <span class="text-[10px] font-mono font-bold text-slate-500">${wh.id}</span>
                <span class="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
              </div>
              <h4 class="mt-3 font-bold text-base text-slate-900">${wh.name}</h4>
              <p class="mt-1 text-xs text-slate-500">${wh.division === 'GA' ? `Divisi ${wh.division} · ${wh.subDivision}` : `Divisi ${wh.division}`}</p>
              <div class="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                <span class="text-slate-500">Total stok</span>
                <span class="font-mono font-bold text-slate-800">${qty.toLocaleString('id-ID')} unit</span>
              </div>
            </button>
          `;
        }).join('')}
      </div>
      <section class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div class="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="text-[11px] font-mono font-bold text-sky-700 uppercase">${selectedWh.id} · Divisi ${selectedWh.division}</div>
            <h3 class="text-lg font-bold text-slate-900 mt-1">${selectedWh.name}</h3>
            <p class="text-sm text-slate-500">Dikelola oleh ${selectedWh.owner}</p>
          </div>
          <button type="button" onclick="openStockInForm({warehouseId:'${selectedWh.id}'})" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shrink-0">+ Barang Masuk</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead><tr class="bg-slate-50 border-b border-slate-200 text-[11px] uppercase text-slate-500"><th class="py-3 px-4">Kode SKU</th><th class="py-3 px-4">Nama Barang</th><th class="py-3 px-4 text-right">Stok</th><th class="py-3 px-4 text-right">Nilai Stok</th></tr></thead>
            <tbody class="divide-y divide-slate-100">
              ${state.items.map(item => {
                const qty = Number(item.stockByWh?.[selectedWh.id] || 0);
                return `<tr class="hover:bg-slate-50"><td class="py-3 px-4 font-mono font-bold text-sky-700">${item.sku}</td><td class="py-3 px-4"><div class="font-semibold text-slate-900">${item.name}</div><div class="text-xs text-slate-500">${item.category}</div></td><td class="py-3 px-4 text-right font-mono font-bold ${qty === 0 ? 'text-slate-400' : 'text-slate-900'}">${qty.toLocaleString('id-ID')} ${item.unit}</td><td class="py-3 px-4 text-right font-mono text-slate-700">${formatRupiah(qty * item.basePrice)}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}
