import React, { useState, useEffect, useRef } from 'react';
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
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ChartComponent = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [textDateRange, setTextDateRange] = useState('Tanggal Mulai - Tanggal Akhir');
    const [chartData, setChartData] = useState({
        labels: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan'],
        datasets: [
            {
                label: 'Total Produk',
                data: [0, 0, 0, 0, 0],
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    });

    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const chart = chartRef.current;
            const ctx = chart.ctx;
            const chartArea = chart.chartArea;

            const createGradient = () => {
                const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
                gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');
                return gradient;
            };

            const gradient = createGradient();

            setChartData((prevData) => ({
                ...prevData,
                datasets: [
                    {
                        ...prevData.datasets[0],
                        backgroundColor: gradient,
                    },
                ],
            }));
        }
    }, [chartData.labels]); // Trigger ketika labelnya berubah

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
                    tension: 0.4,
                    fill: true,
                },
            ],
        });

        const startText = new Date(startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const endText = new Date(endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        setTextDateRange(`${startText} - ${endText}`);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setTextDateRange('Tanggal Mulai - Tanggal Akhir');
        setChartData({
            labels: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan'],
            datasets: [
                {
                    label: 'Total Produk',
                    data: [0, 0, 0, 0, 0],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.4,
                    fill: true,
                },
            ],
        });
    };

    return (
        <>
            <div className="filter d-flex justify-content-between align-items-center mb-4">
                <div className="fw-semibold fs-4">
                    {textDateRange}
                </div>
                <div className="d-flex gap-2">
                    <div className="d-flex flex-column">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 rounded"
                        />
                    </div>
                    <div className="d-flex align-items-center">
                        {"-"}
                    </div>
                    <div className="d-flex flex-column">
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 rounded"
                        />
                    </div>
                    <button className="px-4 rounded bg-info-subtle" onClick={handleFilter}>
                        Filter
                    </button>
                    <button className="px-4 rounded bg-danger-subtle" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </div>
            {chartData && (
                <div className="" style={{ height: '300px', width: '100%' }}>
                    <Line ref={chartRef} data={chartData} />
                </div>
            )}
        </>
    );
};

export default ChartComponent;