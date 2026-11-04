    const STORAGE_KEY = 'PT_GRAHA_SEGARA_WMS_STATE_V4';

    const DEFAULT_STATE = {
      activePage: 'dashboard',
      globalHub: 'ALL',
      inventorySubTab: 'list', // 'list' | 'categories' | 'vendorPricing'
      warehouseSelectedId: 'WH-GA-PROPERTY',
      reportSubTab: 'valuation', // 'valuation' | 'movement' | 'warehouseCap' | 'vendorPerf'

      categories: [
        { id: 'CAT-01', name: 'Reefer & Cold Chain Sparepart', code: 'RFC', desc: 'Komponen pendingin kontainer reefer, sensor suhu, kabel power plug' },
        { id: 'CAT-02', name: 'MHE & Suku Cadang Alat Berat', code: 'MHE', desc: 'Suku cadang Reachstacker, Forklift, Side Loader & Crane lapangan' },
        { id: 'CAT-03', name: 'Karantina, Segel & APD', code: 'QRT', desc: 'Segel kontainer, peralatan inspeksi TPFT Karantina, APD Cold Storage' },
        { id: 'CAT-04', name: 'Material Handling & Kemasan', code: 'PKG', desc: 'Pallet plastik heavy-duty, stretch film, strapping band, desiccant' },
        { id: 'CAT-05', name: 'Kelistrikan & IoT Gudang', code: 'ELC', desc: 'Panel listrik reefer, lampu high-bay LED, data logger temperatur' }
      ],

      units: [
        { code: 'Pcs', name: 'Pieces (Buah)', desc: 'Satuan komponen tunggal' },
        { code: 'Set', name: 'Set Lengkap', desc: 'Rangkaian kit atau pasangan komponen' },
        { code: 'Unit', name: 'Unit Utuh', desc: 'Alat atau perangkat mandiri' },
        { code: 'Box', name: 'Box / Karton', desc: 'Kemasan kotak standar industri' },
        { code: 'Roll', name: 'Roll / Gulung', desc: 'Material gulungan (kabel, plastik wrapping)' },
        { code: 'Liter', name: 'Liter (Cairan)', desc: 'Oli hidrolik, cairan desinfektan, coolant' }
      ],

      warehouses: [
        { id: 'WH-GA-PROPERTY', name: 'GA Property', division: 'GA', subDivision: 'Property', owner: 'Purchasing Admin', status: 'Aktif' },
        { id: 'WH-GA-BUILDING', name: 'GA Building', division: 'GA', subDivision: 'Building', owner: 'Purchasing Admin', status: 'Aktif' },
        { id: 'WH-ALBER', name: 'Alber', division: 'Alber', subDivision: '', owner: 'Purchasing Admin', status: 'Aktif' },
        { id: 'WH-EKONOMI', name: 'Ekonomi', division: 'Ekonomi', subDivision: '', owner: 'Purchasing Admin', status: 'Aktif' },
        { id: 'WH-KALIBARU', name: 'Kalibaru', division: 'Kalibaru', subDivision: '', owner: 'Purchasing Admin', status: 'Aktif' }
      ],

      vendors: [
        {
          id: 'VND-001',
          name: 'PT. Samudera Teknik Reeferindo',
          category: 'Reefer & Cold Chain Sparepart',
          city: 'Jakarta Utara',
          address: 'Jl. Yos Sudarso Kav. 48, Sunter, Jakarta Utara',
          npwp: '01.348.992.1-043.000',
          picName: 'Ir. Wahyu Nugroho',
          picRole: 'Key Account Manager',
          phone: '0811-8823-410',
          email: 'wahyu.nugroho@samuderareefer.co.id',
          paymentTerms: 'TOP 30 Hari',
          leadTimeDays: 3,
          status: 'Verified Partner'
        },
        {
          id: 'VND-002',
          name: 'PT. Traktor Maritim Nusantara',
          category: 'MHE & Suku Cadang Alat Berat',
          city: 'Bekasi',
          address: 'Kawasan Industri Jababeka Blok C-12, Cikarang, Bekasi',
          npwp: '02.881.410.5-412.000',
          picName: 'Dedi Kurniawan',
          picRole: 'Aftermarket Parts Head',
          phone: '0812-9011-7732',
          email: 'sales@traktormaritim.co.id',
          paymentTerms: 'TOP 45 Hari',
          leadTimeDays: 5,
          status: 'Verified Partner'
        },
        {
          id: 'VND-003',
          name: 'PT. Segel Aman Pelabuhan (SAP Seal)',
          category: 'Karantina, Segel & APD',
          city: 'Tangerang',
          address: 'Kawasan Industri Jatake Jl. Industri Raya III No. 19, Tangerang',
          npwp: '03.119.504.2-401.000',
          picName: 'Clara Shinta',
          picRole: 'Corporate Sales Executive',
          phone: '0813-1550-9821',
          email: 'clara@sapseal.id',
          paymentTerms: 'TOP 30 Hari',
          leadTimeDays: 2,
          status: 'Verified Partner'
        },
        {
          id: 'VND-004',
          name: 'CV. Prima Pallet & Packaging Logistik',
          category: 'Material Handling & Kemasan',
          city: 'Surabaya',
          address: 'Jl. Margomulyo Indah Blok B-9, Tandes, Surabaya',
          npwp: '04.512.771.8-605.000',
          picName: 'Agus Setiawan',
          picRole: 'Direktur Operasional',
          phone: '0817-0332-1190',
          email: 'order@primapallet.co.id',
          paymentTerms: 'TOP 14 Hari',
          leadTimeDays: 4,
          status: 'Active Vendor'
        },
        {
          id: 'VND-005',
          name: 'PT. Elektro Kargo Otomasi',
          category: 'Kelistrikan & IoT Gudang',
          city: 'Jakarta Barat',
          address: ' Komplek Glodok Plaza Blok F No. 22, Jakarta Barat',
          npwp: '01.908.332.7-032.000',
          picName: 'Kevin Tanoto',
          picRole: 'Technical Sales Engineer',
          phone: '0818-7721-904',
          email: 'kevin@elektrokargo.co.id',
          paymentTerms: 'TOP 30 Hari',
          leadTimeDays: 3,
          status: 'Verified Partner'
        },
        {
          id: 'VND-006',
          name: 'PT. Petro Lubrikan Bahari',
          category: 'MHE & Suku Cadang Alat Berat',
          city: 'Jakarta Utara',
          address: 'Jl. Cilincing Raya No. 88, Tanjung Priok, Jakarta Utara',
          npwp: '02.441.890.3-041.000',
          picName: 'Rizal Alamsyah',
          picRole: 'B2B Marine & Fleet Specialist',
          phone: '0811-9940-218',
          email: 'rizal@petrolubrikan.co.id',
          paymentTerms: 'TOP 30 Hari',
          leadTimeDays: 2,
          status: 'Active Vendor'
        }
      ],

      items: [
        {
          id: 'ITM-001',
          sku: 'GS-RFC-001',
          name: 'Reefer Power Plug & Socket CEE 32A 440V IP67',
          category: 'Reefer & Cold Chain Sparepart',
          unit: 'Set',
          minStock: 40,
          basePrice: 875000,
          preferredVendorId: 'VND-001',
          specs: '4-Pin 3h, 380-440V AC, IP67 Watertight untuk Monitoring Reefer Yard TPFT',
          stockByWh: { 'WH-GA-PROPERTY': 68, 'WH-GA-BUILDING': 0, 'WH-ALBER': 12, 'WH-EKONOMI': 24, 'WH-KALIBARU': 32 },
          vendorOffers: [
            { vendorId: 'VND-001', price: 875000, moq: 10, leadTime: 3, quoteNo: 'QT/STR/2026/104', validUntil: '2026-12-31', warranty: '12 Bulan', isPreferred: true },
            { vendorId: 'VND-005', price: 910000, moq: 5, leadTime: 2, quoteNo: 'QT/EKO/2026/088', validUntil: '2026-12-15', warranty: '6 Bulan', isPreferred: false }
          ]
        },
        {
          id: 'ITM-002',
          sku: 'GS-RFC-002',
          name: 'USDA/Cold Treatment Temperature Probe Sensor Carrier/ThermoKing',
          category: 'Reefer & Cold Chain Sparepart',
          unit: 'Pcs',
          minStock: 35,
          basePrice: 1450000,
          preferredVendorId: 'VND-001',
          specs: 'Akurasi ±0.1°C, Kabel 12m Heavy-Duty, Kompatibel Kontainer Karantina Buah/Daging',
          stockByWh: { 'WH-GA-PROPERTY': 16, 'WH-GA-BUILDING': 0, 'WH-ALBER': 0, 'WH-EKONOMI': 8, 'WH-KALIBARU': 6 },
          vendorOffers: [
            { vendorId: 'VND-001', price: 1450000, moq: 5, leadTime: 3, quoteNo: 'QT/STR/2026/112', validUntil: '2026-12-31', warranty: '12 Bulan', isPreferred: true },
            { vendorId: 'VND-005', price: 1520000, moq: 5, leadTime: 4, quoteNo: 'QT/EKO/2026/095', validUntil: '2026-11-30', warranty: '12 Bulan', isPreferred: false }
          ]
        },
        {
          id: 'ITM-003',
          sku: 'GS-QRT-001',
          name: 'High-Security Bolt Seal ISO 17712 (Berlogo & Nomor Seri)',
          category: 'Karantina, Segel & APD',
          unit: 'Box',
          minStock: 100,
          basePrice: 680000,
          preferredVendorId: 'VND-003',
          specs: '1 Box = 100 Pcs, Anti-Spin, Laser Barcoded untuk Segel Ulang Pemeriksaan TPFT',
          stockByWh: { 'WH-GA-PROPERTY': 185, 'WH-GA-BUILDING': 0, 'WH-ALBER': 45, 'WH-EKONOMI': 60, 'WH-KALIBARU': 75 },
          vendorOffers: [
            { vendorId: 'VND-003', price: 680000, moq: 20, leadTime: 2, quoteNo: 'QT/SAP/2026/210', validUntil: '2026-12-31', warranty: 'Sertifikasi ISO 17712', isPreferred: true },
            { vendorId: 'VND-004', price: 725000, moq: 15, leadTime: 4, quoteNo: 'QT/PPL/2026/041', validUntil: '2026-12-20', warranty: 'Standar SNI', isPreferred: false }
          ]
        },
        {
          id: 'ITM-004',
          sku: 'GS-MHE-001',
          name: 'Filter Hidrolik Utama Reachstacker Kalmar DRG450',
          category: 'MHE & Suku Cadang Alat Berat',
          unit: 'Pcs',
          minStock: 20,
          basePrice: 2350000,
          preferredVendorId: 'VND-002',
          specs: 'OEM Part Equivalen, Microglass 10 Micron, High Pressure Return Filter',
          stockByWh: { 'WH-GA-PROPERTY': 12, 'WH-GA-BUILDING': 0, 'WH-ALBER': 18, 'WH-EKONOMI': 6, 'WH-KALIBARU': 9 },
          vendorOffers: [
            { vendorId: 'VND-002', price: 2350000, moq: 4, leadTime: 5, quoteNo: 'QT/TMN/2026/077', validUntil: '2026-12-31', warranty: '6 Bulan / 1000 HM', isPreferred: true }
          ]
        },
        {
          id: 'ITM-005',
          sku: 'GS-MHE-002',
          name: 'Ban Solid Forklift 3.5 Ton (Ukuran 28x9-15 Heavy Duty)',
          category: 'MHE & Suku Cadang Alat Berat',
          unit: 'Pcs',
          minStock: 16,
          basePrice: 3850000,
          preferredVendorId: 'VND-002',
          specs: '3-Stage Compound Non-Marking / Heat Resistant untuk Operasional Dalam Gudang & Ramp',
          stockByWh: { 'WH-GA-PROPERTY': 4, 'WH-GA-BUILDING': 0, 'WH-ALBER': 6, 'WH-EKONOMI': 2, 'WH-KALIBARU': 2 },
          vendorOffers: [
            { vendorId: 'VND-002', price: 3850000, moq: 4, leadTime: 5, quoteNo: 'QT/TMN/2026/082', validUntil: '2026-12-31', warranty: '12 Bulan', isPreferred: true }
          ]
        },
        {
          id: 'ITM-006',
          sku: 'GS-PKG-001',
          name: 'Pallet Plastik Heavy Duty Racking 1200x1000x150mm (HDPE)',
          category: 'Material Handling & Kemasan',
          unit: 'Unit',
          minStock: 150,
          basePrice: 640000,
          preferredVendorId: 'VND-004',
          specs: 'Static Load 4 Ton, Dynamic 1.5 Ton, Racking 1.2 Ton dengan 4 Steel Bars Food/Cold Grade',
          stockByWh: { 'WH-GA-PROPERTY': 120, 'WH-GA-BUILDING': 0, 'WH-ALBER': 55, 'WH-EKONOMI': 40, 'WH-KALIBARU': 65 },
          vendorOffers: [
            { vendorId: 'VND-004', price: 640000, moq: 25, leadTime: 4, quoteNo: 'QT/PPL/2026/019', validUntil: '2026-12-31', warranty: '24 Bulan Pemakaian Normal', isPreferred: true },
            { vendorId: 'VND-003', price: 675000, moq: 20, leadTime: 3, quoteNo: 'QT/SAP/2026/219', validUntil: '2026-12-15', warranty: '12 Bulan', isPreferred: false }
          ]
        },
        {
          id: 'ITM-007',
          sku: 'GS-QRT-002',
          name: 'Jaket Parka Insulasi Cold Storage -25°C (Standar EN342)',
          category: 'Karantina, Segel & APD',
          unit: 'Set',
          minStock: 40,
          basePrice: 790000,
          preferredVendorId: 'VND-003',
          specs: 'Termasuk Celana Bib, Sarung Tangan Polar & Penutup Kepala untuk Tim Behandle Reefer',
          stockByWh: { 'WH-GA-PROPERTY': 18, 'WH-GA-BUILDING': 0, 'WH-ALBER': 4, 'WH-EKONOMI': 6, 'WH-KALIBARU': 8 },
          vendorOffers: [
            { vendorId: 'VND-003', price: 790000, moq: 10, leadTime: 2, quoteNo: 'QT/SAP/2026/225', validUntil: '2026-12-31', warranty: '6 Bulan Jahitan & Zipper', isPreferred: true }
          ]
        },
        {
          id: 'ITM-008',
          sku: 'GS-ELC-001',
          name: 'Digital USB Temperature & Humidity Data Logger Cold Chain',
          category: 'Kelistrikan & IoT Gudang',
          unit: 'Box',
          minStock: 30,
          basePrice: 1950000,
          preferredVendorId: 'VND-005',
          specs: '1 Box = 10 Unit Logger PDF Otomatis, Rentang -30°C s/d +70°C, Sertifikat Kalibrasi',
          stockByWh: { 'WH-GA-PROPERTY': 25, 'WH-GA-BUILDING': 0, 'WH-ALBER': 5, 'WH-EKONOMI': 9, 'WH-KALIBARU': 12 },
          vendorOffers: [
            { vendorId: 'VND-005', price: 1950000, moq: 5, leadTime: 3, quoteNo: 'QT/EKO/2026/103', validUntil: '2026-12-31', warranty: '12 Bulan', isPreferred: true },
            { vendorId: 'VND-001', price: 2050000, moq: 5, leadTime: 3, quoteNo: 'QT/STR/2026/128', validUntil: '2026-12-31', warranty: '12 Bulan', isPreferred: false }
          ]
        },
        {
          id: 'ITM-009',
          sku: 'GS-MHE-003',
          name: 'Oli Hidrolik Anti-Wear ISO VG 68 (Kemasan Pail 20 Liter)',
          category: 'MHE & Suku Cadang Alat Berat',
          unit: 'Liter',
          minStock: 200,
          basePrice: 48000,
          preferredVendorId: 'VND-006',
          specs: 'Oli Hidrolik Performa Tinggi untuk Spreader Reachstacker & Forklift Gudang',
          stockByWh: { 'WH-GA-PROPERTY': 140, 'WH-GA-BUILDING': 0, 'WH-ALBER': 220, 'WH-EKONOMI': 80, 'WH-KALIBARU': 100 },
          vendorOffers: [
            { vendorId: 'VND-006', price: 48000, moq: 100, leadTime: 2, quoteNo: 'QT/PLB/2026/055', validUntil: '2026-12-31', warranty: 'Keaslian Distributor Resmi', isPreferred: true },
            { vendorId: 'VND-002', price: 52000, moq: 60, leadTime: 4, quoteNo: 'QT/TMN/2026/090', validUntil: '2026-12-15', warranty: 'Standar OEM', isPreferred: false }
          ]
        },
        {
          id: 'ITM-010',
          sku: 'GS-PKG-002',
          name: 'Stretch Film Wrapping Machine Grade 500mm x 23 Micron',
          category: 'Material Handling & Kemasan',
          unit: 'Roll',
          minStock: 80,
          basePrice: 185000,
          preferredVendorId: 'VND-004',
          specs: 'Berat 15 Kg/Roll, Daya Regang 250% untuk Wrapping Kargo Pasca Pemeriksaan Karantina',
          stockByWh: { 'WH-GA-PROPERTY': 90, 'WH-GA-BUILDING': 0, 'WH-ALBER': 30, 'WH-EKONOMI': 22, 'WH-KALIBARU': 38 },
          vendorOffers: [
            { vendorId: 'VND-004', price: 185000, moq: 30, leadTime: 4, quoteNo: 'QT/PPL/2026/032', validUntil: '2026-12-31', warranty: 'Ganti Baru Jika Cacat Gulung', isPreferred: true }
          ]
        }
      ],

      movements: [
        {
          id: 'TRX-20261104-001',
          docNo: 'GRN/GS-JKT/2026/1101',
          type: 'IN',
          date: '2026-11-04 07:15',
          productionDate: '2026-10-20',
          itemId: 'ITM-001',
          qty: 30,
          unitPrice: 875000,
          warehouseId: 'WH-GA-PROPERTY',
          vendorId: 'VND-001',
          recipientOrSource: 'PT. Samudera Teknik Reeferindo (PO-2026-881)',
          operator: 'Hendra Saputra',
          notes: 'Penerimaan suku cadang plug reefer dermaga utara, kondisi fisik lengkap & lolos QC.'
        },
        {
          id: 'TRX-20261103-002',
          docNo: 'DO/GS-JKT/2026/0894',
          type: 'OUT',
          date: '2026-11-03 16:20',
          itemId: 'ITM-003',
          qty: 25,
          warehouseId: 'WH-GA-PROPERTY',
          vendorId: null,
          recipientOrSource: 'Tim Pemeriksaan Fisik Terpadu (TPFT) Blok B - Karantina',
          operator: 'Fajar Ramadhan',
          notes: 'Pengeluaran Bolt Seal ISO 17712 untuk penyegelan ulang 2.500 kontainer selesai periksa.'
        },
        {
          id: 'TRX-20261103-003',
          docNo: 'GRN/GS-JKT2/2026/1098',
          type: 'IN',
          date: '2026-11-03 13:40',
          productionDate: '2026-09-15',
          itemId: 'ITM-009',
          qty: 120,
          unitPrice: 48000,
          warehouseId: 'WH-ALBER',
          vendorId: 'VND-006',
          recipientOrSource: 'PT. Petro Lubrikan Bahari (PO-2026-875)',
          operator: 'Bambang Wijaya',
          notes: 'Restock oli hidrolik ISO VG 68 sebanyak 6 pail (120 Liter) untuk perawatan Reachstacker.'
        },
        {
          id: 'TRX-20261102-004',
          docNo: 'DO/GS-SBY/2026/0412',
          type: 'OUT',
          date: '2026-11-02 15:10',
          itemId: 'ITM-010',
          qty: 12,
          warehouseId: 'WH-KALIBARU',
          vendorId: null,
          recipientOrSource: 'Divisi Operasional Kalibaru',
          operator: 'Rina Kusumawardhani',
          notes: 'Pemakaian wrapping palet komoditas impor holtikultura pasca inspeksi.'
        },
        {
          id: 'TRX-20261102-005',
          docNo: 'TRF/GS-NAS/2026/0091',
          type: 'TRANSFER',
          date: '2026-11-02 10:05',
          itemId: 'ITM-008',
          qty: 5,
          warehouseId: 'WH-GA-PROPERTY',
          targetWarehouseId: 'WH-EKONOMI',
          vendorId: null,
          recipientOrSource: 'Mutasi antar gudang divisi: GA Property ke Ekonomi',
          operator: 'Hendra Saputra',
          notes: 'Pengiriman tambahan USB Data Logger untuk kebutuhan divisi Ekonomi.'
        },
        {
          id: 'TRX-20261101-006',
          docNo: 'GRN/GS-JKT/2026/1089',
          type: 'IN',
          date: '2026-11-01 11:30',
          productionDate: '2026-10-10',
          itemId: 'ITM-006',
          qty: 50,
          unitPrice: 640000,
          warehouseId: 'WH-GA-PROPERTY',
          vendorId: 'VND-004',
          recipientOrSource: 'CV. Prima Pallet & Packaging Logistik (PO-2026-860)',
          operator: 'Fajar Ramadhan',
          notes: 'Penambahan pallet plastik HDPE heavy duty untuk bay cold storage baru.'
        },
        {
          id: 'TRX-20261031-007',
          docNo: 'DO/GS-JKT2/2026/0881',
          type: 'OUT',
          date: '2026-10-31 14:45',
          itemId: 'ITM-004',
          qty: 4,
          warehouseId: 'WH-ALBER',
          vendorId: null,
          recipientOrSource: 'Divisi Alber — Unit Kalmar RS-04 & RS-07',
          operator: 'Bambang Wijaya',
          notes: 'Penggantian berkala filter hidrolik 2.000 HM.'
        }
      ],

      users: [
        { id: 'USR-01', name: 'Hendra Saputra', email: 'hendra.saputra@grahasegara.co.id', role: 'Kepala Gudang (Warehouse Manager)', hub: 'WH-GA-PROPERTY', status: 'Aktif', lastLogin: '2026-11-04 07:45' },
        { id: 'USR-02', name: 'Bambang Wijaya', email: 'bambang.wijaya@grahasegara.co.id', role: 'Kepala Gudang (Warehouse Manager)', hub: 'WH-ALBER', status: 'Aktif', lastLogin: '2026-11-04 07:10' },
        { id: 'USR-03', name: 'Fajar Ramadhan', email: 'fajar.ramadhan@grahasegara.co.id', role: 'Supervisor Inbound & Outbound', hub: 'WH-GA-PROPERTY', status: 'Aktif', lastLogin: '2026-11-04 06:55' },
        { id: 'USR-04', name: 'Nadia Putri Lestari', email: 'nadia.procurement@grahasegara.co.id', role: 'Procurement & Vendor Specialist', hub: 'ALL', status: 'Aktif', lastLogin: '2026-11-03 17:30' },
        { id: 'USR-05', name: 'Surya Darmawan', email: 'surya.belawan@grahasegara.co.id', role: 'Koordinator Gudang Ekonomi', hub: 'WH-EKONOMI', status: 'Aktif', lastLogin: '2026-11-03 16:12' },
        { id: 'USR-06', name: 'Rina Kusumawardhani', email: 'rina.perak@grahasegara.co.id', role: 'Koordinator Gudang Kalibaru', hub: 'WH-KALIBARU', status: 'Aktif', lastLogin: '2026-11-04 07:20' }
      ],

      prefillStockIn: null
    };

    let state = loadState();
    let chartInstances = {};

    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const loaded = Object.assign({}, JSON.parse(JSON.stringify(DEFAULT_STATE)), parsed);
          loaded.warehouses = JSON.parse(JSON.stringify(DEFAULT_STATE.warehouses));
          loaded.vendors.forEach(vendor => delete vendor.rating);
          loaded.items.forEach(item => {
            const stock = item.stockByWh || {};
            item.stockByWh = {
              'WH-GA-PROPERTY': Number(stock['WH-GA-PROPERTY'] !== undefined ? stock['WH-GA-PROPERTY'] : stock['WH-JKT-01'] || 0),
              'WH-GA-BUILDING': Number(stock['WH-GA-BUILDING'] || 0),
              'WH-ALBER': Number(stock['WH-ALBER'] !== undefined ? stock['WH-ALBER'] : stock['WH-JKT-02'] || 0),
              'WH-EKONOMI': Number(stock['WH-EKONOMI'] !== undefined ? stock['WH-EKONOMI'] : stock['WH-MDN-01'] || 0),
              'WH-KALIBARU': Number(stock['WH-KALIBARU'] !== undefined ? stock['WH-KALIBARU'] : stock['WH-SBY-01'] || 0)
            };
            delete item.rackLocation;
          });
          loaded.movements.forEach(movement => {
            movement.warehouseId = ({ 'WH-JKT-01': 'WH-GA-PROPERTY', 'WH-JKT-02': 'WH-ALBER', 'WH-MDN-01': 'WH-EKONOMI', 'WH-SBY-01': 'WH-KALIBARU' })[movement.warehouseId] || movement.warehouseId;
            movement.targetWarehouseId = ({ 'WH-JKT-01': 'WH-GA-PROPERTY', 'WH-JKT-02': 'WH-ALBER', 'WH-MDN-01': 'WH-EKONOMI', 'WH-SBY-01': 'WH-KALIBARU' })[movement.targetWarehouseId] || movement.targetWarehouseId;
            const seededInbound = {
              'TRX-20261104-001': { productionDate: '2026-10-20', unitPrice: 875000 },
              'TRX-20261103-003': { productionDate: '2026-09-15', unitPrice: 48000 },
              'TRX-20261101-006': { productionDate: '2026-10-10', unitPrice: 640000 }
            }[movement.id];
            if (movement.type === 'IN' && seededInbound) {
              if (movement.productionDate == null) movement.productionDate = seededInbound.productionDate;
              if (movement.unitPrice == null) movement.unitPrice = seededInbound.unitPrice;
            }
          });
          loaded.users.forEach(user => {
            user.hub = ({ 'WH-JKT-01': 'WH-GA-PROPERTY', 'WH-JKT-02': 'WH-ALBER', 'WH-MDN-01': 'WH-EKONOMI', 'WH-SBY-01': 'WH-KALIBARU' })[user.hub] || user.hub;
            user.role = (user.role || '').replace('Koordinator Hub Belawan', 'Koordinator Gudang Ekonomi').replace('Koordinator Hub Tanjung Perak', 'Koordinator Gudang Kalibaru');
          });
          loaded.globalHub = ({ 'WH-JKT-01': 'WH-GA-PROPERTY', 'WH-JKT-02': 'WH-ALBER', 'WH-MDN-01': 'WH-EKONOMI', 'WH-SBY-01': 'WH-KALIBARU' })[loaded.globalHub] || loaded.globalHub;
          loaded.warehouseSelectedId = ({ 'WH-JKT-01': 'WH-GA-PROPERTY', 'WH-JKT-02': 'WH-ALBER', 'WH-MDN-01': 'WH-EKONOMI', 'WH-SBY-01': 'WH-KALIBARU' })[loaded.warehouseSelectedId] || loaded.warehouseSelectedId;
          loaded.items.forEach(item => delete item.rackLocation);
          loaded.movements.forEach(movement => {
            movement.recipientOrSource = (movement.recipientOrSource || '').replace(/Tanjung Perak|Belawan Medan|Belawan|TPFT Priok|Digul/gi, 'gudang divisi');
            movement.notes = (movement.notes || '').replace(/Belawan/gi, 'gudang divisi');
            delete movement.zoneCode;
          });
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded)); } catch (storageError) { console.warn('Unable to save migrated state:', storageError); }
          return loaded;
        }
      } catch (err) {
        console.warn('Storage fallback used:', err);
      }
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (err) {
        console.warn('Unable to save state:', err);
      }
      updateSidebarBadges();
      if (typeof renderHeaderNotifications === 'function') renderHeaderNotifications();
    }

    function resetDemoData() {
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      saveState();
      renderCurrentPage();
      showToast('Data demo PT. Graha Segara berhasil di-reset ke kondisi awal.', 'info');
    }

