    function renderVendors(container) {
      container.innerHTML = `
        <div class="space-y-5 animate-fade">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex-1">
              <label class="block text-[11px] font-semibold text-slate-500 mb-1">Cari Nama Vendor / Kategori / Kota / Kontak PIC</label>
              <input id="vendorSearchInput" type="text" oninput="filterVendorCards()" placeholder="Ketik nama PT/CV vendor, nama PIC, atau spesialisasi..." class="w-full max-w-md px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500" />
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="openVendorModal()" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                <span>Tambah Vendor Baru</span>
              </button>
            </div>
          </div>

          <div id="vendorGridContainer" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"></div>
        </div>
      `;
      filterVendorCards();
    }

    function filterVendorCards() {
      const q = (document.getElementById('vendorSearchInput')?.value || '').toLowerCase();
      const grid = document.getElementById('vendorGridContainer');
      if (!grid) return;

      const list = state.vendors.filter(v =>
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.picName.toLowerCase().includes(q)
      );

      grid.innerHTML = list.map(v => {
        const suppliedItems = state.items.filter(it =>
          it.preferredVendorId === v.id || (it.vendorOffers || []).some(o => o.vendorId === v.id)
        );
        return `
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-sky-300 transition flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">${v.id}</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">${v.status} • ★ ${v.rating}</span>
              </div>
              <h3 class="text-sm font-bold text-slate-900">${v.name}</h3>
              <p class="text-xs text-sky-700 font-medium mt-0.5">${v.category}</p>
              <p class="text-[11px] text-slate-500 mt-1">${v.address}</p>

              
              <div class="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                <div class="text-[10px] font-bold uppercase text-slate-400">Informasi Kontak PIC</div>
                <div class="font-semibold text-slate-800">${v.picName} <span class="font-normal text-slate-500">(${v.picRole})</span></div>
                <div class="text-slate-600 font-mono text-[11px]">Telp/WA: ${v.phone}</div>
                <div class="text-slate-600 text-[11px] truncate">Email: ${v.email}</div>
                <div class="flex items-center justify-between pt-1.5 mt-1.5 border-t border-slate-200 text-[11px] text-slate-500">
                  <span>Termin: <strong class="text-slate-700">${v.paymentTerms}</strong></span>
                  <span>SLA: <strong class="text-slate-700">${v.leadTimeDays} Hari</strong></span>
                </div>
              </div>

              
              <div class="mt-3">
                <div class="text-[11px] font-semibold text-slate-600 mb-1.5">Barang yang Disediakan (${suppliedItems.length} SKU):</div>
                <div class="flex flex-wrap gap-1">
                  ${suppliedItems.slice(0, 4).map(it => `
                    <span class="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/70 text-[10px] font-medium truncate max-w-[210px]">${it.name}</span>
                  `).join('')}
                  ${suppliedItems.length === 0 ? `<span class="text-[11px] text-slate-400">Belum ada SKU terhubung</span>` : ''}
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
              <button type="button" onclick="showVendorDetailModal('${v.id}')" class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-semibold transition">
                Detail & Barang Vendor
              </button>
              <button type="button" onclick="openVendorModal('${v.id}')" class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-semibold transition">
                Edit
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    function showVendorDetailModal(vendorId) {
      const v = getVendorById(vendorId);
      const suppliedItems = state.items.filter(it =>
        it.preferredVendorId === v.id || (it.vendorOffers || []).some(o => o.vendorId === v.id)
      );

      const html = `
        <div class="space-y-5 text-xs">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-[11px]">${v.id}</span>
              <h4 class="text-base font-bold text-slate-900 mt-1">${v.name}</h4>
              <p class="text-slate-500">${v.address} (${v.city})</p>
              <p class="text-[11px] font-mono text-slate-500 mt-0.5">NPWP: ${v.npwp}</p>
            </div>
            <div class="text-left sm:text-right shrink-0">
              <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">${v.status}</span>
              <p class="mt-2 text-slate-600">Termin: <strong>${v.paymentTerms}</strong></p>
              <p class="text-slate-600">Lead Time Rata-rata: <strong>${v.leadTimeDays} Hari</strong></p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="p-3 rounded-xl border border-slate-200">
              <span class="text-[10px] uppercase font-bold text-slate-400">Nama Kontak PIC</span>
              <p class="font-bold text-slate-900 mt-0.5">${v.picName}</p>
              <p class="text-[11px] text-slate-500">${v.picRole}</p>
            </div>
            <div class="p-3 rounded-xl border border-slate-200">
              <span class="text-[10px] uppercase font-bold text-slate-400">Nomor Telepon / WhatsApp</span>
              <p class="font-mono font-bold text-slate-900 mt-0.5">${v.phone}</p>
              <p class="text-[11px] text-emerald-600">Aktif Jam Kerja & Darurat Pelabuhan</p>
            </div>
            <div class="p-3 rounded-xl border border-slate-200">
              <span class="text-[10px] uppercase font-bold text-slate-400">Alamat Email Resmi</span>
              <p class="font-semibold text-sky-700 mt-0.5 break-all">${v.email}</p>
              <p class="text-[11px] text-slate-500">e-Procurement Terverifikasi</p>
            </div>
          </div>

          <div>
            <h5 class="font-bold text-slate-800 mb-2">Daftar Barang yang Disediakan oleh ${v.name} (${suppliedItems.length} SKU)</h5>
            <div class="overflow-x-auto border border-slate-200 rounded-xl">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-[10px] uppercase text-slate-500">
                    <th class="py-2 px-3">SKU</th>
                    <th class="py-2 px-3">Nama Barang</th>
                    <th class="py-2 px-3 text-right">Harga Penawaran</th>
                    <th class="py-2 px-3 text-center">Status</th>
                    <th class="py-2 px-3 text-right">Aksi Order</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  ${suppliedItems.map(it => {
                    const offer = (it.vendorOffers || []).find(o => o.vendorId === v.id) || { price: it.basePrice };
                    return `
                      <tr>
                        <td class="py-2.5 px-3 font-mono font-bold text-sky-700">${it.sku}</td>
                        <td class="py-2.5 px-3 font-medium text-slate-900">${it.name}</td>
                        <td class="py-2.5 px-3 text-right font-mono font-semibold">${formatRupiah(offer.price)} / ${it.unit}</td>
                        <td class="py-2.5 px-3 text-center">
                          ${it.preferredVendorId === v.id
                            ? `<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">Utama</span>`
                            : `<span class="text-slate-400">Pendamping</span>`}
                        </td>
                        <td class="py-2.5 px-3 text-right">
                          <button type="button" onclick="closeModal(); state.prefillStockIn={itemId:'${it.id}', vendorId:'${v.id}', qty:20}; switchPage('stockin')" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px]">
                            Terima Barang (Stock In)
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="closeModal(); openVendorModal('${v.id}')" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold">Edit Data Vendor</button>
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">Tutup</button>
          </div>
        </div>
      `;
      openModal(`Detail Mitra Vendor — ${v.name}`, html, 'max-w-3xl');
    }

    function openVendorModal(editVendorId = null) {
      const isEdit = Boolean(editVendorId);
      const v = isEdit ? getVendorById(editVendorId) : {
        name: '',
        category: state.categories[0]?.name || '',
        city: 'Jakarta Utara',
        address: '',
        npwp: '01.000.000.0-043.000',
        picName: '',
        picRole: 'Account Manager',
        phone: '',
        email: '',
        paymentTerms: 'TOP 30 Hari',
        leadTimeDays: 3,
        rating: 4.8,
        status: 'Verified Partner'
      };

      const html = `
        <form onsubmit="saveVendorForm(event, '${editVendorId || ''}')" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Nama Perusahaan Vendor (PT / CV) *</label>
              <input id="vFormName" type="text" required value="${v.name}" placeholder="Contoh: PT. Maritim Suku Cadang Indonesia" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kategori Spesialisasi *</label>
              <select id="vFormCat" class="w-full px-3 py-2 rounded-xl border border-slate-300">
                ${state.categories.map(c => `<option value="${c.name}" ${c.name === v.category ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Kota Domisili *</label>
              <input id="vFormCity" type="text" required value="${v.city}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Alamat Lengkap Kantor / Gudang Vendor *</label>
              <input id="vFormAddr" type="text" required value="${v.address}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Nama Kontak PIC *</label>
              <input id="vFormPic" type="text" required value="${v.picName}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Jabatan PIC *</label>
              <input id="vFormRole" type="text" required value="${v.picRole}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">No. Telepon / WhatsApp PIC *</label>
              <input id="vFormPhone" type="text" required value="${v.phone}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Email Resmi *</label>
              <input id="vFormEmail" type="email" required value="${v.email}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Termin Pembayaran</label>
              <select id="vFormTerms" class="w-full px-3 py-2 rounded-xl border border-slate-300">
                <option value="TOP 14 Hari" ${v.paymentTerms === 'TOP 14 Hari' ? 'selected' : ''}>TOP 14 Hari</option>
                <option value="TOP 30 Hari" ${v.paymentTerms === 'TOP 30 Hari' ? 'selected' : ''}>TOP 30 Hari</option>
                <option value="TOP 45 Hari" ${v.paymentTerms === 'TOP 45 Hari' ? 'selected' : ''}>TOP 45 Hari</option>
                <option value="CBD / Cash Before Delivery" ${v.paymentTerms === 'CBD / Cash Before Delivery' ? 'selected' : ''}>CBD / Cash Before Delivery</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Lead Time Pengiriman (Hari)</label>
              <input id="vFormLead" type="number" min="1" required value="${v.leadTimeDays}" class="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono" />
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">Batal</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold">${isEdit ? 'Simpan Perubahan Vendor' : 'Tambahkan Vendor'}</button>
          </div>
        </form>
      `;
      openModal(isEdit ? `Edit Data Vendor — ${v.name}` : 'Registrasi Mitra Vendor Baru', html);
    }

    function saveVendorForm(e, editVendorId) {
      e.preventDefault();
      const payload = {
        name: document.getElementById('vFormName').value.trim(),
        category: document.getElementById('vFormCat').value,
        city: document.getElementById('vFormCity').value.trim(),
        address: document.getElementById('vFormAddr').value.trim(),
        picName: document.getElementById('vFormPic').value.trim(),
        picRole: document.getElementById('vFormRole').value.trim(),
        phone: document.getElementById('vFormPhone').value.trim(),
        email: document.getElementById('vFormEmail').value.trim(),
        paymentTerms: document.getElementById('vFormTerms').value,
        leadTimeDays: Number(document.getElementById('vFormLead').value) || 3
      };

      if (editVendorId) {
        const idx = state.vendors.findIndex(v => v.id === editVendorId);
        if (idx !== -1) state.vendors[idx] = { ...state.vendors[idx], ...payload };
        showToast(`Data vendor ${payload.name} berhasil diperbarui.`);
      } else {
        const newId = `VND-${String(state.vendors.length + 1).padStart(3, '0')}`;
        state.vendors.push({
          id: newId,
          npwp: '01.882.441.9-043.000',
          rating: 4.8,
          status: 'Verified Partner',
          ...payload
        });
        showToast(`Vendor baru ${payload.name} berhasil ditambahkan.`);
      }
      saveState();
      closeModal();
      renderVendors(document.getElementById('viewContainer'));
    }

