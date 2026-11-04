document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('globalSearchDropdown');
  const input = document.getElementById('globalQuickSearch');
  if (dropdown && input && !dropdown.contains(event.target) && event.target !== input) dropdown.classList.add('hidden');
  if (!event.target.closest('.header-menu-root')) closeHeaderMenus();
});

window.addEventListener('DOMContentLoaded', () => {
  const shell = document.getElementById('appShell');
  const sidebarToggle = document.getElementById('sidebarToggle');
  let sidebarHidden = false;
  try {
    sidebarHidden = window.matchMedia('(min-width: 1024px)').matches && localStorage.getItem('WMS_SIDEBAR_HIDDEN') === '1';
  } catch (err) {
    // Gunakan sidebar terbuka jika penyimpanan browser tidak tersedia.
  }
  if (shell && sidebarHidden) shell.classList.add('sidebar-hidden');
  if (sidebarToggle) {
    sidebarToggle.setAttribute('aria-expanded', String(!sidebarHidden));
    sidebarToggle.setAttribute('aria-label', sidebarHidden ? 'Tampilkan menu samping' : 'Sembunyikan menu samping');
  }

  const hubSelect = document.getElementById('globalHubFilter');
  if (hubSelect) hubSelect.value = state.globalHub || 'ALL';
  renderHeaderNotifications();
  switchPage(state.activePage || 'dashboard');
});
