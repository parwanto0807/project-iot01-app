"use client";

import { useEffect, useState } from 'react';
import styles from '@/app/page.module.css'; // Pastikan Anda membuat file CSS ini

interface DataItem {
    id: number;
    serialNumber: string; 
    voltase: string; 
    ampere: string; 
}

export default function Home() {
    const [data, setData] = useState<DataItem[]>([]); // Ubah menjadi array
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/mqtt'); // Memanggil API yang sudah ada
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log('Data received from API:', result);

                // Cek apakah result adalah array
                if (Array.isArray(result)) {
                    // Tambahkan data baru ke dalam array
                    setData((prevData) => {
                        const newData = [...prevData, ...result];
                        // Reset data jika jumlah record mencapai 15
                        if (newData.length >= 15) {
                            return []; // Reset data
                        }
                        return newData;
                    });
                } else {
                    // Jika result bukan array, anggap itu adalah objek tunggal
                    setData((prevData) => {
                        const newData = [...prevData, result];
                        // Reset data jika jumlah record mencapai 15
                        if (newData.length >= 15) {
                            return []; // Reset data
                        }
                        return newData;
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // Memanggil fungsi fetchData saat komponen dimuat

        // Interval untuk memperbarui data setiap beberapa detik
        const interval = setInterval(fetchData, 5000); // Mengambil data setiap 5 detik

        // Cleanup function untuk menghentikan interval saat komponen unmount
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <main className={styles.container}>
            <h1>Data Pengukuran Ampere</h1>
            {data.length > 0 ? ( // Cek apakah data ada
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Serial Number</th>
                            <th>Voltase (V)</th>
                            <th title="Current in Amperes">Ampere (A)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1 }</td>
                                <td>{item.serialNumber}</td>
                                <td>{item.voltase}</td>
                                <td>{item.ampere}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No data available</div> // Menangani kasus ketika tidak ada data
            )}
        </main>
    );
}