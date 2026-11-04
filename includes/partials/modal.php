  
  <div id="modalOverlay" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden items-center justify-center p-4 overflow-y-auto">
    <div id="modalBox" class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fade my-8">
      <div class="px-6 py-4 bg-blue-900 text-white flex items-center justify-between">
        <h3 id="modalTitle" class="text-sm sm:text-base font-bold">Detail Informasi</h3>
        <button type="button" onclick="closeModal()" class="p-1 rounded-lg text-blue-100 hover:text-white hover:bg-blue-800">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div id="modalBody" class="p-6 max-h-[78vh] overflow-y-auto custom-scroll"></div>
    </div>
  </div>
