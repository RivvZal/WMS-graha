    function renderUsers(container) {
      container.innerHTML = `
        <div class="space-y-5 animate-fade">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Daftar Pengguna & Otorisasi Akses Cabang</h3>
              <p class="text-xs text-slate-500">Pengaturan hak akses operator gudang, kepala gudang, tim inspeksi TPFT & procurement PT. Graha Segara</p>
            </div>
            <button type="button" onclick="openUserModal()" class="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs self-start">
              + Tambah User Baru
            </button>
          </div>

          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-50 border-y border-slate-200 text-[10px] uppercase text-slate-500">
                  <th class="py-3 px-3">ID User</th>
                  <th class="py-3 px-3">Nama Lengkap & Email</th>
                  <th class="py-3 px-3">Role / Jabatan Sistem</th>
                  <th class="py-3 px-3">Akses Gudang Divisi</th>
                  <th class="py-3 px-3">Login Terakhir</th>
                  <th class="py-3 px-3 text-center">Status Akun</th>
                  <th class="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${state.users.map(u => `
                  <tr class="hover:bg-slate-50">
                    <td class="py-3 px-3 font-mono font-bold text-slate-700">${u.id}</td>
                    <td class="py-3 px-3">
                      <div class="font-semibold text-slate-900">${u.name}</div>
                      <div class="text-[11px] text-slate-500">${u.email}</div>
                    </td>
                    <td class="py-3 px-3">
                      <span class="px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-medium text-[11px]">${u.role}</span>
                    </td>
                    <td class="py-3 px-3 font-semibold text-slate-700">${u.hub === 'ALL' ? 'Semua Gudang Divisi' : (state.warehouses.find(wh => wh.id === u.hub)?.name || u.hub)}</td>
                    <td class="py-3 px-3 font-mono text-[11px] text-slate-500">${u.lastLogin}</td>
                    <td class="py-3 px-3 text-center">
                      <button type="button" onclick="toggleUserStatus('${u.id}')" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${u.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-300'}">
                        ${u.status}
                      </button>
                    </td>
                    <td class="py-3 px-3 text-right">
                      <button type="button" onclick="openUserModal('${u.id}')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-semibold">Edit</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    function toggleUserStatus(userId) {
      const u = state.users.find(x => x.id === userId);
      if (!u) return;
      u.status = u.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
      saveState();
      renderUsers(document.getElementById('viewContainer'));
      showToast(`Status akun ${u.name} diubah menjadi ${u.status}.`, 'info');
    }

    function openUserModal(editUserId = null) {
      const isEdit = Boolean(editUserId);
      const u = isEdit ? state.users.find(x => x.id === editUserId) : {
        name: '',
        email: '',
        role: 'Supervisor Inbound & Outbound',
        hub: 'WH-GA-PROPERTY',
        status: 'Aktif'
      };

      const html = `
        <form onsubmit="saveUserForm(event, '${editUserId || ''}')" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Nama Lengkap Personel *</label>
              <input id="uFormName" type="text" required value="${u.name}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div class="sm:col-span-2">
              <label class="block font-semibold text-slate-700 mb-1">Email Korporat (@grahasegara.co.id) *</label>
              <input id="uFormEmail" type="email" required value="${u.email}" class="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Role / Hak Akses Sistem *</label>
              <select id="uFormRole" class="w-full px-3 py-2 rounded-xl border border-slate-300">
                <option value="Super Admin WMS" ${u.role === 'Super Admin WMS' ? 'selected' : ''}>Super Admin WMS</option>
                <option value="Kepala Gudang (Warehouse Manager)" ${u.role === 'Kepala Gudang (Warehouse Manager)' ? 'selected' : ''}>Kepala Gudang (Warehouse Manager)</option>
                <option value="Supervisor Inbound & Outbound" ${u.role === 'Supervisor Inbound & Outbound' ? 'selected' : ''}>Supervisor Inbound & Outbound</option>
                <option value="Procurement & Vendor Specialist" ${u.role === 'Procurement & Vendor Specialist' ? 'selected' : ''}>Procurement & Vendor Specialist</option>
                <option value="Inspektor TPFT & Karantina" ${u.role === 'Inspektor TPFT & Karantina' ? 'selected' : ''}>Inspektor TPFT & Karantina</option>
              </select>
            </div>
            <div>
              <label class="block font-semibold text-slate-700 mb-1">Akses Gudang Divisi *</label>
              <select id="uFormHub" class="w-full px-3 py-2 rounded-xl border border-slate-300">
                <option value="ALL" ${u.hub === 'ALL' ? 'selected' : ''}>Semua Gudang Divisi (All Access)</option>
                ${state.warehouses.map(w => `<option value="${w.id}" ${w.id === u.hub ? 'selected' : ''}>${w.id} • ${w.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold">Batal</button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold">${isEdit ? 'Simpan Perubahan' : 'Tambahkan User'}</button>
          </div>
        </form>
      `;
      openModal(isEdit ? `Edit Akun Pengguna — ${u.name}` : 'Tambah Pengguna WMS Baru', html);
    }

    function saveUserForm(e, editUserId) {
      e.preventDefault();
      const name = document.getElementById('uFormName').value.trim();
      const email = document.getElementById('uFormEmail').value.trim();
      const role = document.getElementById('uFormRole').value;
      const hub = document.getElementById('uFormHub').value;

      if (editUserId) {
        const idx = state.users.findIndex(x => x.id === editUserId);
        if (idx !== -1) state.users[idx] = { ...state.users[idx], name, email, role, hub };
        showToast(`Data akun ${name} berhasil diperbarui.`);
      } else {
        state.users.push({
          id: `USR-0${state.users.length + 1}`,
          name, email, role, hub,
          status: 'Aktif',
          lastLogin: '2026-11-04 08:00'
        });
        showToast(`Akun pengguna baru ${name} berhasil ditambahkan.`);
      }
      saveState();
      closeModal();
      renderUsers(document.getElementById('viewContainer'));
    }
