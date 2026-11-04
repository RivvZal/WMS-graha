    function renderWarehouse(container) {
      const selectedWh = getWarehouseById(state.warehouseSelectedId || state.warehouses[0].id);

      container.innerHTML = `
        <div class="space-y-6 animate-fade">
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Daftar Fasilitas Gudang PT. Graha Segara</h3>
              <p class="text-xs text-slate-500">Klik salah satu kartu gudang untuk melihat detail denah lokasi penyimpanan (Zona/Rak) dan stok di gudang tersebut</p>
            </div>
            <button type="button" onclick="openAddZoneModal('${selectedWh.id}')" class="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs self-start">
              + Tambah Lokasi Rak / Zona (${selectedWh.id})
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            ${state.warehouses.map(wh => {
              const isSelected = wh.id === selectedWh.id;
              const pct = Math.round((wh.usedPallet / wh.capacityPallet) * 100);
              const totalUnitsWh = state.items.reduce((acc, it) => acc + Number(it.stockByWh?.[wh.id] || 0), 0);
              return `
                <div onclick="state.warehouseSelectedId='${wh.id}'; renderWarehouse(document.getElementById('viewContainer'))" class="warehouse-card p-4 rounded-2xl border transition cursor-pointer ${isSelected ? 'is-selected bg-sky-50 text-slate-800 border-sky-300 shadow-md' : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300 shadow-xs'}">
                  <div class="flex items-center justify-between mb-2">
                    <span class="px-2 py-0.5 rounded font-mono text-[11px] font-bold ${isSelected ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'}">${wh.id}</span>
                    <span class="text-[11px] font-medium text-emerald-700">● ${wh.status}</span>
                  </div>
                  <h4 class="font-bold text-sm leading-snug">${wh.name}</h4>
                  <p class="text-[11px] ${isSelected ? 'text-slate-600' : 'text-slate-500'} mt-1 line-clamp-2">${wh.address}</p>

                  <div class="mt-3 pt-3 border-t ${isSelected ? 'border-sky-100' : 'border-slate-100'} space-y-1.5 text-xs">
                    <div class="flex justify-between">
                      <span class="text-slate-500">Utilisasi Palet:</span>
                      <span class="font-mono font-bold text-slate-700">${wh.usedPallet}/${wh.capacityPallet} (${pct}%)</span>
                    </div>
                    <div class="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div class="h-full bg-sky-500 rounded-full" style="width:${pct}%"></div>
                    </div>
                    <div class="flex justify-between pt-1">
                      <span class="text-slate-500">Total Unit Barang:</span>
                      <span class="font-mono font-bold text-slate-700">${totalUnitsWh.toLocaleString('id-ID')} Unit</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div class="border-b border-slate-200 pb-3">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] font-mono font-bold text-sky-700 uppercase">Detail Gudang Terpilih • ${selectedWh.id}</span>
                  <span class="text-[11px] text-slate-500">${selectedWh.city}</span>
                </div>
                <h3 class="text-base font-bold text-slate-900 mt-0.5">${selectedWh.name}</h3>
                <p class="text-xs text-slate-500 mt-0.5">${selectedWh.address}</p>
              </div>

              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span class="text-slate-400 block text-[10px] uppercase font-semibold">Kepala Gudang (PIC)</span>
                  <span class="font-bold text-slate-800 mt-0.5 block">${selectedWh.manager}</span>
                  <span class="text-[11px] text-slate-500 font-mono">${selectedWh.phone}</span>
                </div>
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span class="text-slate-400 block text-[10px] uppercase font-semibold">Spesifikasi Suhu</span>
                  <span class="font-bold text-slate-800 mt-0.5 block">${selectedWh.temperature}</span>
                  <span class="text-[11px] text-slate-500">Telemetry Aktif</span>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Lokasi Penyimpanan (Zona & Rak Gudang)</h4>
                  <span class="text-[11px] text-slate-400">${selectedWh.zones.length} Zona Terdaftar</span>
                </div>
                <div class="space-y-2.5">
                  ${selectedWh.zones.map(z => {
                    const zPct = Math.round((z.used / z.capacity) * 100);
                    return `
                      <div class="p-3 rounded-xl border border-slate-200 hover:border-sky-300 bg-slate-50/60 transition">
                        <div class="flex items-center justify-between text-xs">
                          <span class="font-bold text-slate-900"><span class="font-mono text-sky-700 mr-1.5">[${z.code}]</span>${z.name}</span>
                          <span class="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-medium text-slate-600">${z.type}</span>
                        </div>
                        <div class="flex items-center justify-between text-[11px] text-slate-500 mt-2 mb-1">
                          <span>Kapasitas Rak/Bin</span>
                          <span class="font-mono font-semibold text-slate-700">${z.used} / ${z.capacity} Slot (${zPct}%)</span>
                        </div>
                        <div class="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div class="h-full ${zPct > 85 ? 'bg-amber-500' : 'bg-teal-600'} rounded-full" style="width:${zPct}%"></div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            
            <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 class="text-sm font-bold text-slate-900">Stok Barang Berdasarkan Gudang: ${selectedWh.name}</h3>
                    <p class="text-xs text-slate-500">Rincian kuantitas barang, nilai persediaan & titik lokasi rak penyimpanan di ${selectedWh.id}</p>
                  </div>
                  <button type="button" onclick="state.prefillStockIn={warehouseId:'${selectedWh.id}'}; switchPage('stockin')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0">
                    + Terima Barang di ${selectedWh.id}
                  </button>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                        <th class="py-2.5 px-3">Kode SKU</th>
                        <th class="py-2.5 px-3">Nama Barang</th>
                        <th class="py-2.5 px-3">Lokasi Rak / Zona</th>
                        <th class="py-2.5 px-3 text-right">Stok di ${selectedWh.id}</th>
                        <th class="py-2.5 px-3 text-right">Nilai Stok</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                      ${state.items.map(item => {
                        const qty = Number(item.stockByWh?.[selectedWh.id] || 0);
                        const rack = item.rackLocation?.[selectedWh.id] || selectedWh.zones[0]?.code || '-';
                        return `
                          <tr class="hover:bg-slate-50">
                            <td class="py-2.5 px-3 font-mono font-bold text-sky-700">${item.sku}</td>
                            <td class="py-2.5 px-3">
                              <div class="font-semibold text-slate-900">${item.name}</div>
                              <div class="text-[10px] text-slate-500">${item.category}</div>
                            </td>
                            <td class="py-2.5 px-3">
                              <span class="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-mono text-[11px] font-semibold">${rack}</span>
                            </td>
                            <td class="py-2.5 px-3 text-right font-mono font-bold ${qty === 0 ? 'text-rose-500' : 'text-slate-900'}">${qty.toLocaleString('id-ID')} ${item.unit}</td>
                            <td class="py-2.5 px-3 text-right font-mono text-slate-700">${formatRupiah(qty * item.basePrice)}</td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function openAddZoneModal(whId) {
      const wh = getWarehouseById(whId);
      const html = `
        <form onsubmit="saveNewZone(event, '${whId}')" class="space-y-4 text-xs">
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span class="text-slate-500">Target Gudang:</span>
            <span class="font-bold text-slate-900 ml-1">${wh.name} (${wh.id})</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kode Zona / Rak Baru *</label>
              <input id="zoneCodeInput" type="text" required placeholder="Contoh: Z-E05" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Tipe Penyimpanan *</label>
              <select id="zoneTypeInput" class="w-full px-3 py-2 rounded-xl border border-slate-300">
                <option value="Dry Rack">Dry Rack Standar</option>
                <option value="Cold Chain (-18°C)">Cold Chain (-18°C)</option>
                <option value="Chilled (+4°C)">Chilled (+4°C)</option>
                <option value="Heavy Floor MHE">Heavy Floor MHE</option>
                <option value="High Security Quarantine">High Security Quarantine</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Nama Deskripsi Zona *</label>
              <input id="zoneNameInput" type="text" required placeholder="Contoh: Zona E05 • Reefer Compressor & Fan Rack" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kapasitas Maksimal (Palet/Slot) *</label>
              <input id="zoneCapInput" type="number" min="10" required value="200" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Slot Terpakai Saat Ini *</label>
              <input id="zoneUsedInput" type="number" min="0" required value="45" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">Batal</button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold">Simpan Lokasi Penyimpanan</button>
          </div>
        </form>
      `;
      openModal(`Tambah Zona / Rak Penyimpanan — ${wh.id}`, html);
    }

    function saveNewZone(e, whId) {
      e.preventDefault();
      const wh = getWarehouseById(whId);
      const code = document.getElementById('zoneCodeInput').value.trim().toUpperCase();
      const name = document.getElementById('zoneNameInput').value.trim();
      const type = document.getElementById('zoneTypeInput').value;
      const capacity = Number(document.getElementById('zoneCapInput').value) || 100;
      const used = Number(document.getElementById('zoneUsedInput').value) || 0;
      wh.zones.push({ code, name, type, capacity, used });
      saveState();
      closeModal();
      renderWarehouse(document.getElementById('viewContainer'));
      showToast(`Lokasi penyimpanan ${code} berhasil ditambahkan ke ${wh.name}.`);
    }

