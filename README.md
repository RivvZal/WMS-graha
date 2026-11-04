# WMS Graha Segara 

Aplikasi pake PHP native untuk rakit halaman dari partial, dengan CSS dan JavaScript terpisah.

Struktur utama nya =
- `index.php` — entry point dan susunan layout.
- `includes/partials/` — head, sidebar, header, modal, notifikasi, dan urutan pemuatan JavaScript.
- `assets/css/app.css` — styling tambahan.
- `assets/js/demo-data.js` — data simulasi yang masih disimpan di browser.
- `assets/js/app-core.js` — state, helper, pencarian, dan router.
- `assets/js/modules/` — logika UI per fitur WMS.

## Notes Integrasi backend berikutnya
Data dan transaksi masih berupa simulasi di `demo-data.js` dengan `localStorage`. Sumber data serta aksi simpan dapat dipindahkan ke endpoint PHP/database saat backend dibuat; modul UI per fitur sudah dipisahkan.

Cheers - Rifqi
