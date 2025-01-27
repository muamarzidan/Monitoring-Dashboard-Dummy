import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ContohComponent from '../../components/ProductTabelTree';
import jsonData from '../../api/dummyProducts.json';

export default function ProductClasificationPage() {
    return (
        <>
            <DashboardLayout>
                <h2 className="pb-2 fw-semibold">Klasifikasi Produk</h2>
                <ContohComponent data={jsonData.data} />
            </DashboardLayout>
        </>
    )
};