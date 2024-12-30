"use client";

import { useEffect, useState } from 'react';
import styles from '@/app/page.module.css'; // Pastikan Anda membuat file CSS ini
import Speedometer from '@/components/Speedometer'; // Import komponen Speedometer

export default function Home() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [voltase, setVoltase] = useState<number>(0); // State untuk voltase
    const [frequency, setFrequency] = useState<number>(0); // State untuk frekuensi
    const [kWh, setKWh] = useState<number>(0); // State untuk kWh

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/mqtt'); // Memanggil API yang sudah ada
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log('Data received from API:', result);

                // Proses data yang diterima
                if (result) {
                    // Ambil nilai dari topik yang sesuai
                    if (result.volt) {
                        setVoltase(parseFloat(result.volt.voltase)); // Set voltase
                    }
                    if (result.hz) {
                        setFrequency(parseFloat(result.hz.frequency)); // Set frekuensi
                    }
                    if (result.kwh) {
                        const kWhValue = parseFloat(result.kwh.kWh);
                        setKWh(isNaN(kWhValue) ? 0 : kWhValue); // Set kWh, jika NaN set ke 0
                    }
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
        const interval = setInterval(fetchData, 3000); // Mengambil data setiap 3 detik

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
            <h1 className="text-2xl font-bold text-center mb-4">Data Pengukuran</h1>
            <div className={styles.chartContainer}>
                <div className={styles.speedometerRow}>
                    <Speedometer value={voltase} minValue={0} maxValue={225} label="Volt (V)" />
                    <Speedometer value={frequency} minValue={0} maxValue={225} label="Frekuensi (Hz)" />
                    <Speedometer value={kWh} minValue={0} maxValue={1000} label="KWh" />
                </div>
            </div>
        </main>
    );
}