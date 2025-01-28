import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ProductTabelTree from '../../components/ProductTabelTree';
import jsonData from '../../api/dummyProducts.json';

export default function ProductClasificationPage() {
    return (
        <>
            <DashboardLayout>
                <h2 className="pb-2 fw-semibold">Klasifikasi Produk</h2>
                <ProductTabelTree data={jsonData.data} />
            </DashboardLayout>
        </>
    )
};