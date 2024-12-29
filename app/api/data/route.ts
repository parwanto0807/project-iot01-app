import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    const filePath = path.join(process.cwd(), 'public', 'digital_ampere_meter_data.txt');

    try {
        // Membaca file secara sinkron
        const fileData = fs.readFileSync(filePath, 'utf-8');

        // Parse data JSON dari file
        const jsonData = JSON.parse(fileData);

        // Mengembalikan data JSON sebagai respons
        return NextResponse.json(jsonData);
    } catch (error) {
        console.error('Error reading file:', error);
        return NextResponse.json({ error: 'Error reading file' }, { status: 500 });
    }
}
