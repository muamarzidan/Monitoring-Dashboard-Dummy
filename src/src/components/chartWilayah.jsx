import React, { useState } from 'react';
import { filterWilayahDate } from '../api/data';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ChartComponent = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartData, setChartData] = useState({
        // bikin statis, jika sudah dinamis, bisa get dengan mapping per kota yang ada di data.js 
        labels: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan'],
        datasets: [
            {
                label: 'Total Produk',
                data: [0, 0, 0, 0, 0],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            }
        ]
    });

    const handleFilter = () => {
        if (!startDate || !endDate) {
            alert('Silakan lengkapi pilihan rentang tanggal untuk menampilkan data grafik');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('Pastikan start date itu tanggal lebih awal dari end date');
            return;
        }

        const filteredData = filterWilayahDate(startDate, endDate);
        const labels = filteredData.map((wilayah) => wilayah.nama);
        const data = filteredData.map((wilayah) => wilayah.produkPaid.length);

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Total Produk',
                    data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.20)',
                    tension: 0.4,
                }
            ]
        });
    };

    return (
        <div>
            <h2>Chart Produk Per Wilayah</h2>
            <div className="filter d-flex gap-3">
                <div className="d-flex flex-column">
                    <label htmlFor="startDate" className="text-center">Start Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="d-flex flex-column">
                    <label htmlFor="endDate" className="text-center">End Date:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="align-self-end">
                    <button className="px-3 rounded" onClick={handleFilter}>Filter</button>
                </div>
            </div>
            {chartData && (
                <div className="" style={{ height: '400px', width: '600px' }}>
                    <Line key={JSON.stringify(chartData)} data={chartData} />
                </div>
            )}
        </div>
    );
};

export default ChartComponent;