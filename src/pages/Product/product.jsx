import React from 'react'
import DashboardLayout from '../../components/DashboardLayout';
import ProductTable2 from '../../components/productTable2';
import jsonData from '../../api/dummyProducts.json';

export default function ProdukPage() {
    return (
        <DashboardLayout>
            <h2 className="pb-2 fw-semibold">Seluruh Produk</h2>
            <div className="bg-body p-4 rounded-3">
                <div className="d-flex flex-column gap-5">
                    <ProductTable2 data={jsonData.data} />
                </div>
            </div>
        </DashboardLayout>
    )
};