    function renderDashboard(container) {
      const hub = state.globalHub;
      let totalUnits = 0;
      let totalValuation = 0;
      let lowStockItems = [];

      state.items.forEach(item => {
        const qty = getItemTotalStock(item, hub);
        totalUnits += qty;
        totalValuation += qty * item.basePrice;
        const threshold = hub === 'ALL' ? item.minStock : Math.ceil(item.minStock / 3);
        if (qty <= threshold) {
          lowStockItems.push({ item, qty, threshold });
        }
      });

      const filteredMovements = state.movements.filter(m =>
        hub === 'ALL' || m.warehouseId === hub || m.targetWarehouseId === hub
      );
      const totalInCount = filteredMovements.filter(m => m.type === 'IN').reduce((s, m) => s + Number(m.qty), 0);
      const totalOutCount = filteredMovements.filter(m => m.type === 'OUT').reduce((s, m) => s + Number(m.qty), 0);

      const activeWarehouses = hub === 'ALL' ? state.warehouses : state.warehouses.filter(w => w.id === hub);

      container.innerHTML = `
        <div class="dashboard-page space-y-6 animate-fade">
          
          <div class="dashboard-hero rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div class="space-y-1.5">
              <div class="dashboard-eyebrow inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-semibold">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Sistem Manajemen Gudang Terpadu • PT. Graha Segara</span>
              </div>
              <h2 class="text-lg sm:text-xl font-bold tracking-tight">Pusat Kendali Inventaris TPFT, Cold Chain & MHE Pelabuhan</h2>
              <p class="text-xs text-slate-300 max-w-2xl">
                Memantau ketersediaan suku cadang Reefer Container, segel karantina ISO 17712, peralatan bongkar muat (MHE), dan material logistik pada seluruh fasilitas gudang PT. Graha Segara.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2.5 shrink-0">
              <button type="button" onclick="switchPage('inventory'); openItemModal()" class="dashboard-secondary-action px-3.5 py-2 rounded-xl text-xs font-semibold border transition">
                + Tambah SKU Baru
              </button>
              <button type="button" onclick="switchPage('catalog')" class="dashboard-primary-action px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition">
                Buka Katalog Vendor
              </button>
            </div>
          </div>

          
          <div class="dashboard-kpis grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500">Total Kuantitas Stok</p>
                <p class="text-2xl font-extrabold text-slate-900 mt-1 font-mono">${totalUnits.toLocaleString('id-ID')}</p>
                <p class="text-[11px] text-emerald-600 font-medium mt-1">Tersebar di ${state.items.length} SKU Aktif</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500">Estimasi Nilai Persediaan</p>
                <p class="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 font-mono">${formatRupiah(totalValuation)}</p>
                <p class="text-[11px] text-slate-500 mt-1">Valuasi harga standar kontrak</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500">Arus Barang Masuk vs Keluar</p>
                <div class="flex items-baseline gap-3 mt-1">
                  <span class="text-lg font-extrabold text-emerald-600 font-mono">+${totalInCount} In</span>
                  <span class="text-slate-300">/</span>
                  <span class="text-lg font-extrabold text-amber-600 font-mono">-${totalOutCount} Out</span>
                </div>
                <p class="text-[11px] text-slate-500 mt-1">${filteredMovements.length} Transaksi tercatat</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-start justify-between">
              <div>
                <p class="text-xs font-medium text-slate-500">Peringatan Stok Menipis</p>
                <p class="text-2xl font-extrabold ${lowStockItems.length > 0 ? 'text-rose-600' : 'text-emerald-600'} mt-1 font-mono">${lowStockItems.length} SKU</p>
                <p class="text-[11px] text-slate-500 mt-1">Di bawah ambang batas minimum</p>
              </div>
              <div class="w-10 h-10 rounded-xl ${lowStockItems.length > 0 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'} flex items-center justify-center border">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              </div>
            </div>
          </div>

          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 class="text-sm font-bold text-slate-900">Grafik Pergerakan Inventaris Masuk & Keluar</h3>
                  <p class="text-xs text-slate-500">Volume transaksi penerimaan (Stock In) vs pengeluaran (Stock Out) 7 periode terakhir</p>
                </div>
                <div class="flex items-center gap-3 text-xs">
                  <span class="flex items-center gap-1.5 text-emerald-700 font-medium"><span class="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block"></span>Barang Masuk</span>
                  <span class="flex items-center gap-1.5 text-amber-700 font-medium"><span class="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block"></span>Barang Keluar</span>
                </div>
              </div>
              <div class="relative h-64">
                <canvas id="dashboardMovementChart"></canvas>
              </div>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div class="mb-4">
                <h3 class="text-sm font-bold text-slate-900">Komposisi Stok per Kategori</h3>
                <p class="text-xs text-slate-500">Distribusi unit berdasarkan kelompok barang</p>
              </div>
              <div class="relative h-64">
                <canvas id="dashboardCategoryChart"></canvas>
              </div>
            </div>
          </div>

          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div class="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900">Kapasitas & Utilisasi Gudang PT. Graha Segara</h3>
                    <p class="text-xs text-slate-500">Tingkat keterisian palet pada masing-masing hub pelabuhan</p>
                  </div>
                  <button type="button" onclick="switchPage('warehouse')" class="text-xs font-semibold text-sky-600 hover:text-sky-700">Detail Gudang →</button>
                </div>
                <div class="space-y-3.5">
                  ${activeWarehouses.map(wh => {
                    const pct = Math.round((wh.usedPallet / wh.capacityPallet) * 100);
                    const barColor = pct > 80 ? 'bg-amber-500' : 'bg-sky-600';
                    return `
                      <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition cursor-pointer" onclick="state.warehouseSelectedId='${wh.id}'; switchPage('warehouse')">
                        <div class="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1">
                          <span>${wh.name} (${wh.id})</span>
                          <span class="font-mono text-slate-700">${wh.usedPallet} / ${wh.capacityPallet} Palet (${pct}%)</span>
                        </div>
                        <div class="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div class="h-full ${barColor} rounded-full" style="width:${pct}%"></div>
                        </div>
                        <div class="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                          <span>PIC: ${wh.manager}</span>
                          <span>Suhu: ${wh.temperature}</span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            
            <div class="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900">Peringatan Stok Minimum (Reorder Alert)</h3>
                    <p class="text-xs text-slate-500">Item kritis yang memerlukan pemesanan ulang (Restock)</p>
                  </div>
                  <button type="button" onclick="switchPage('inventory')" class="text-xs font-semibold text-sky-600 hover:text-sky-700">Semua Barang →</button>
                </div>
                ${lowStockItems.length === 0 ? `
                  <div class="p-8 text-center bg-emerald-50/50 rounded-xl border border-emerald-200">
                    <p class="text-sm font-semibold text-emerald-800">Seluruh Stok Aman Di Atas Batas Minimum</p>
                    <p class="text-xs text-emerald-600 mt-1">Tidak ada SKU yang berada di bawah safety stock saat ini.</p>
                  </div>
                ` : `
                  <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr class="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                          <th class="py-2 px-2">SKU / Nama Barang</th>
                          <th class="py-2 px-2 text-right">Stok</th>
                          <th class="py-2 px-2 text-right">Min</th>
                          <th class="py-2 px-2 text-right">Aksi Cepat</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100">
                        ${lowStockItems.map(({ item, qty, threshold }) => `
                          <tr class="hover:bg-slate-50">
                            <td class="py-2.5 px-2">
                              <div class="font-semibold text-slate-800">${item.name}</div>
                              <div class="text-[11px] font-mono text-slate-500">${item.sku} • Vendor: ${getVendorById(item.preferredVendorId).name}</div>
                            </td>
                            <td class="py-2.5 px-2 text-right font-mono font-bold text-rose-600">${qty} ${item.unit}</td>
                            <td class="py-2.5 px-2 text-right font-mono text-slate-500">${threshold} ${item.unit}</td>
                            <td class="py-2.5 px-2 text-right">
                              <button type="button" onclick="quickRestockFromAlert('${item.id}')" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]">
                                + Stock In
                              </button>
                            </td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                `}
              </div>
            </div>
          </div>

          
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 class="text-sm font-bold text-slate-900">Aktivitas Logistik Terbaru (Real-Time Ledger)</h3>
                <p class="text-xs text-slate-500">Catatan transaksi penerimaan, pengeluaran, dan transfer barang terakhir</p>
              </div>
              <button type="button" onclick="switchPage('movements')" class="text-xs font-semibold text-sky-600 hover:text-sky-700">Lihat Semua Riwayat Transaksi →</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse text-xs">
                <thead>
                  <tr class="bg-slate-50 border-y border-slate-200 text-slate-600 uppercase text-[10px]">
                    <th class="py-2.5 px-3">No. Dokumen</th>
                    <th class="py-2.5 px-3">Waktu</th>
                    <th class="py-2.5 px-3">Tipe</th>
                    <th class="py-2.5 px-3">Barang / SKU</th>
                    <th class="py-2.5 px-3">Gudang</th>
                    <th class="py-2.5 px-3 text-right">Jumlah</th>
                    <th class="py-2.5 px-3">Vendor / Tujuan</th>
                    <th class="py-2.5 px-3 text-right">Detail</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${filteredMovements.slice(0, 6).map(m => {
                    const item = getItemById(m.itemId);
                    const wh = getWarehouseById(m.warehouseId);
                    const badgeClass = m.type === 'IN'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : m.type === 'OUT'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-sky-50 text-sky-700 border-sky-200';
                    const sign = m.type === 'IN' ? '+' : m.type === 'OUT' ? '-' : '⇄';
                    return `
                      <tr class="hover:bg-slate-50">
                        <td class="py-2.5 px-3 font-mono font-semibold text-slate-800">${m.docNo}</td>
                        <td class="py-2.5 px-3 text-slate-500 font-mono text-[11px]">${m.date}</td>
                        <td class="py-2.5 px-3">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}">${m.type}</span>
                        </td>
                        <td class="py-2.5 px-3">
                          <div class="font-medium text-slate-900">${item.name}</div>
                          <div class="text-[10px] font-mono text-slate-400">${item.sku}</div>
                        </td>
                        <td class="py-2.5 px-3 text-slate-600">${wh.id}</td>
                        <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${sign}${m.qty} ${item.unit}</td>
                        <td class="py-2.5 px-3 text-slate-600 truncate max-w-[200px]">${m.recipientOrSource}</td>
                        <td class="py-2.5 px-3 text-right">
                          <button type="button" onclick="showTransactionDetailModal('${m.id}')" class="text-sky-600 hover:underline font-medium">Surat</button>
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

      initDashboardCharts();
    }

    function initDashboardCharts() {
      const movCanvas = document.getElementById('dashboardMovementChart');
      if (movCanvas && window.Chart) {
        chartInstances.mov = new Chart(movCanvas, {
          type: 'bar',
          data: {
            labels: ['29 Okt', '30 Okt', '31 Okt', '01 Nov', '02 Nov', '03 Nov', '04 Nov'],
            datasets: [
              {
                label: 'Barang Masuk (Stock In)',
                data: [45, 30, 20, 50, 35, 120, 30],
                backgroundColor: '#10b981',
                borderRadius: 6
              },
              {
                label: 'Barang Keluar (Stock Out)',
                data: [20, 28, 14, 18, 17, 25, 10],
                backgroundColor: '#f59e0b',
                borderRadius: 6
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
              x: { grid: { display: false } }
            }
          }
        });
      }

      const catCanvas = document.getElementById('dashboardCategoryChart');
      if (catCanvas && window.Chart) {
        const catTotals = {};
        state.categories.forEach(c => { catTotals[c.name] = 0; });
        state.items.forEach(it => {
          catTotals[it.category] = (catTotals[it.category] || 0) + getItemTotalStock(it, state.globalHub);
        });
        chartInstances.cat = new Chart(catCanvas, {
          type: 'doughnut',
          data: {
            labels: Object.keys(catTotals),
            datasets: [{
              data: Object.values(catTotals),
              backgroundColor: ['#0284c7', '#0d9488', '#f59e0b', '#6366f1', '#ec4899'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
            }
          }
        });
      }
    }

    function quickRestockFromAlert(itemId) {
      const item = getItemById(itemId);
      state.prefillStockIn = {
        itemId: item.id,
        vendorId: item.preferredVendorId || state.vendors[0].id,
        warehouseId: state.globalHub === 'ALL' ? 'WH-JKT-01' : state.globalHub,
        qty: Math.max(20, item.minStock)
      };
      switchPage('stockin');
      showToast(`Formulir Stock In diisi otomatis untuk restock ${item.name}`, 'info');
    }

