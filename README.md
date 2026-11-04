# WMS Graha Segara 

Aplikasi pake PHP native untuk rakit halaman dari partial, dengan CSS dan JavaScript terpisah.

Struktur utama nya =
- `index.php` — entry point dan susunan layout.
- `includes/partials/` — head, sidebar, header, modal, notifikasi, dan urutan pemuatan JavaScript.
- `assets/css/app.css` — styling tambahan.
- `assets/js/demo-data.js` — data simulasi disimpan di browser.
- `assets/js/app-core.js` — state, helper, pencarian, dan router.
- `assets/js/modules/` — logika UI per fitur WMS.

## Notes Integrasi backend berikutnya
Data dan transaksi masih berupa simulasi di `demo-data.js` dengan `localStorage`. Sumber data serta aksi simpan dapat dipindahkan ke endpoint PHP/database saat backend dibuat; modul UI per fitur sudah dipisahkan.

### 04/11/2026

1.User Per divisi gudang -> hanya bisa melihat gudang nya sendiri ( belum diterapkan di sistem )
2.Account -> admin ( purchasing & IT ) | User Divisi Per Gudang
3.Sistem User belum dibuat ( masih only admin view )

