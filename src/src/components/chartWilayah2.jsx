import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { filterByDate } from '../api/data';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ChartWilayah = () => {
    const [startDate, setStartDate] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    });
    const [endDate, setEndDate] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate()}`;
    });
    const [textDateRange, setTextDateRange] = useState('Tanggal Mulai - Tanggal Akhir');
    const [filteredData, setFilteredData] = useState(filterByDate(startDate, endDate));
    const chartRef = useRef(null);

    const handleFilter = () => {
        const startText = new Date(startDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const endText = new Date(endDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const updatedData = filterByDate(startDate, endDate);
        setFilteredData(updatedData);
        setTextDateRange(`${startText} - ${endText}`);
    };

    const handleReset = () => {
        const now = new Date();
        const defaultStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const defaultEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
        ).getDate()}`;

        setStartDate(defaultStart);
        setEndDate(defaultEnd);
        setFilteredData(filterByDate(defaultStart, defaultEnd));
        setTextDateRange('Tanggal Mulai - Tanggal Akhir');
    };

    const chartData = {
        labels: [],
        datasets: [],
    };

    const tanggalSet = new Set();
    filteredData.forEach((wilayah) => {
        wilayah.produkPaid.forEach((produk) => {
            tanggalSet.add(produk.tanggal);
        });
    });

    chartData.labels = Array.from(tanggalSet).sort();

    filteredData.forEach((wilayah) => {
        const dataPerTanggal = chartData.labels.map((tanggal) => {
            const totalHarga = wilayah.produkPaid
                .filter((produk) => produk.tanggal === tanggal)
                .reduce((sum, produk) => sum + produk.harga, 0);
            return totalHarga;
        });

        chartData.datasets.push({
            label: wilayah.nama,
            data: dataPerTanggal,
            borderColor: 'rgba(75, 192, 192, 1)',
            // borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            tension: 0.4,
            fill: true,
        });
    });

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
            chartData.datasets = chartData.datasets.map((dataset) => ({
                ...dataset,
                backgroundColor: gradient,
            }));
        }
    }, [chartData]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tanggal',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Total Harga',
                },
            },
        },
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
                    <div className="d-flex align-items-center">-</div>
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
            {/* {chartData && (
                <div style={{ height: '300px', width: '100%' }}>
                    <Line ref={chartRef} data={chartData} options={options} />
                </div>
            )} */}
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            {filteredData.map((wilayah) => (
                                <th key={wilayah.nama}>{wilayah.nama}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.labels.map((tanggal, index) => (
                            <tr key={index}>
                                <td className="text-center">{tanggal}</td>
                                {filteredData.map((wilayah) => {
                                    const totalHarga = wilayah.produkPaid
                                        .filter((produk) => produk.tanggal === tanggal)
                                        .reduce((sum, produk) => sum + produk.harga, 0);
                                    return (
                                        <td className="text-center" key={wilayah.nama}>
                                            {totalHarga > 0
                                                ? new Intl.NumberFormat('id-ID', {
                                                    style: 'currency',
                                                    currency: 'IDR',
                                                }).format(totalHarga)
                                                : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ChartWilayah;