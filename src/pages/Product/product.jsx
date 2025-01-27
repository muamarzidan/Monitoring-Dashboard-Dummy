import React from 'react'
import DashboardLayout from '../../components/DashboardLayout';
import ProductTable2 from '../../components/productTable2';
import jsonData from '../../api/dummyProducts.json';

export default function ProdukPage() {
    return (
        <DashboardLayout>
            <h1 className="pb-2 fw-semibold">Halaman Produk</h1>
            <div className="bg-body p-4 rounded-3">
                <div className="d-flex flex-column gap-5">
                    <ProductTable2 data={jsonData.data} />
                </div>
            </div>
        </DashboardLayout>
    )
};