const dataProduk = [
    {
        idWilayah: 1,
        nama: "Jakarta",
        kode: "JKT",
        produkPaid: [
            {
                id: 1,
                nama: 'Baju',
                harga: 100000,
                isPaid: true,
                kategori: ['Pakaian'],
                tanggal: '2025-01-02'
            },
            {
                id: 2,
                nama: 'Celana',
                harga: 150000,
                isPaid: false,
                kategori: ['Pakaian'],
                tanggal: '2025-01-04'
            },
            {
                id: 3,
                nama: 'TV',
                harga: 50000,
                isPaid: true,
                kategori: ['Elektronik'],
                tanggal: '2025-01-07'
            }
        ]
    },
    {
        idWilayah: 2,
        nama: "Bandung",
        kode: "BDG",
        produkPaid: [
            {
                id: 1,
                nama: 'Baju',
                harga: 100000,
                isPaid: true,
                kategori: ['Pakaian'],
                tanggal: '2025-01-03'
            },
            {
                id: 2,
                nama: 'Celana',
                harga: 150000,
                isPaid: false,
                kategori: ['Pakaian'],
                tanggal: '2025-01-06'
            },
            {
                id: 3,
                nama: 'TV',
                harga: 50000,
                isPaid: true,
                kategori: ['Elektronik'],
                tanggal: '2025-01-09'
            },
            {
                id: 4,
                nama: 'Pakaian Dalam',
                harga: 2000,
                isPaid: true,
                kategori: ['Pakaian'],
                tanggal: '2025-01-29'
            }
        ]
    },
    {
        idWilayah: 3,
        nama: "Surabaya",
        kode: "SBY",
        produkPaid: []
    },
    {
        idWilayah: 4,
        nama: "Yogyakarta",
        kode: "YGY",
        produkPaid: [
            {
                id: 1,
                nama: 'Meja',
                harga: 200000,
                isPaid: true,
                kategori: ['Furniture'],
                tanggal: '2025-01-01'
            },
            {
                id: 2,
                nama: 'Kursi',
                harga: 80000,
                isPaid: true,
                kategori: ['Furniture'],
                tanggal: '2025-01-03'
            },
            {
                id: 3,
                nama: 'Lampu',
                harga: 50000,
                isPaid: true,
                kategori: ['Elektronik'],
                tanggal: '2025-01-04'
            },
            {
                id: 4,
                nama: 'Kipas Angin',
                harga: 150000,
                isPaid: true,
                kategori: ['Elektronik'],
                tanggal: '2025-01-05'
            },
            {
                id: 5,
                nama: 'Gorden',
                harga: 90000,
                isPaid: true,
                kategori: ['Dekorasi'],
                tanggal: '2025-01-07'
            }
        ]
    },
    {
        idWilayah: 5,
        nama: "Medan",
        kode: "MDN",
        produkPaid: [
            {
                id: 1,
                nama: 'Buku',
                harga: 30000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-02'
            },
            {
                id: 2,
                nama: 'Pulpen',
                harga: 5000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-04'
            },
            {
                id: 3,
                nama: 'Pensil',
                harga: 5000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-15'
            },
            {
                id: 4,
                nama: 'Pensil Warna',
                harga: 20000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-20'
            },
            {
                id: 5,
                nama: 'Penggaris',
                harga: 15000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-21'
            },
            {
                id: 6,
                nama: 'Penggaris',
                harga: 15000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-23'
            },
            {
                id: 7,
                nama: 'Penggaris',
                harga: 15000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-26'
            },
            {
                id: 8,
                nama: 'Penghapus',
                harga: 20000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-28'
            },
            {
                id: 7,
                nama: 'Tipe x',
                harga: 10000,
                isPaid: true,
                kategori: ['Pendidikan'],
                tanggal: '2025-01-30'
            }
        ]
    },
    {
        idWilayah: 6,
        nama: "Semarang",
        kode: "SMG",
        produkPaid: []
    },
    {
        idWilayah: 7,
        nama: "Palembang",
        kode: "PLB",
        produkPaid: []
    },
    {
        idWilayah: 8,
        nama: "Makassar",
        kode: "MKS",
        produkPaid: []
    },
    {
        idWilayah: 9,
        nama: "Balikpapan",
        kode: "BPN",
        produkPaid: []
    },
    {
        idWilayah: 10,
        nama: "Manado",
        kode: "MND",
        produkPaid: []
    },
    {
        idWilayah: 11,
        nama: "Pekanbaru",
        kode: "PKU",
        produkPaid: []
    },
    // {
    //     idWilayah: 12,
    //     nama: "Padang",
    //     kode: "PDG",
    //     produkPaid: []
    // },
    // {
    //     idWilayah: 13,
    //     nama: "Denpasar",
    //     kode: "DPS",
    //     produkPaid: []
    // },
    // {
    //     idWilayah: 14,
    //     nama: "Banjarmasin",
    //     kode: "BJM",
    //     produkPaid: []
    // },
    // {
    //     idWilayah: 15,
    //     nama: "Pontianak",
    //     kode: "PTK",
    //     produkPaid: []
    // },
    // {
    //     idWilayah: 16,
    //     nama: "Ambon",
    //     kode: "AMQ",
    //     produkPaid: []
    // },
    // {
    //     idWilayah: 17,
    //     nama: "Jayapura",
    //     kode: "DJJ",
    //     produkPaid: []
    // }
];

/**
 * @param {String} startDate - Tanggal mulai (YYYY-MM-DD)
 * @param {String} endDate - Tanggal akhir (YYYY-MM-DD)
 * @returns Filtered data
 */
const filterByDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return dataProduk.map((wilayah) => {
        const filteredProduk = wilayah.produkPaid.filter((produk) => {
            const tanggalProduk = new Date(produk.tanggal);
            return tanggalProduk >= start && tanggalProduk <= end;
        });

        return { ...wilayah, produkPaid: filteredProduk };
    });
};

export { dataProduk, filterByDate };