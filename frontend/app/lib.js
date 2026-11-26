'use client';
import { useEffect, useState } from 'react';

export const rp = (n) => (n < 0 ? '-' : '') + 'Rp' + Math.abs(Math.round(n)).toLocaleString('id-ID');
export const angka = (v) => (v === '' || v == null ? 0 : Number(v));

// Alamat backend: pengaturan di aplikasi > env saat build > kosong (mode web, lewat proxy Next.js)
export function basis() {
  try {
    return (localStorage.getItem('apiUrl') || process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
  } catch {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
}

export async function kirim(path, body) {
  const res = await fetch(basis() + '/api/' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.pesan || 'Server tidak terjangkau. Pastikan backend menyala dan alamat server di bagian bawah halaman sudah benar.');
  if (data.hppPerPorsi === undefined && data.pendapatan === undefined && data.totalBulanan === undefined && data.totalMasuk === undefined) {
    throw new Error('Balasan server tidak dikenali. Alamat server belum diatur atau salah. Bangun ulang APK setelah variabel API_URL diisi.');
  }
  return data;
}

/** State yang otomatis tersimpan di perangkat (localStorage), jadi data tiap pengguna tidak tercampur di server. */
export function useLokal(kunci, awal) {
  const [nilai, setNilai] = useState(awal);
  const [siap, setSiap] = useState(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem('tu_' + kunci);
      if (s) setNilai(JSON.parse(s));
    } catch {}
    setSiap(true);
  }, [kunci]);
  useEffect(() => {
    if (siap) try { localStorage.setItem('tu_' + kunci, JSON.stringify(nilai)); } catch {}
  }, [kunci, nilai, siap]);
  return [nilai, setNilai];
}

/** Minta file .xlsx ke backend. Di web: diunduh. Di APK: dibuka lewat menu Bagikan (simpan/kirim). */
export async function eksporExcel(payload) {
  const res = await fetch(basis() + '/api/export/xlsx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Gagal membuat file Excel. Cek koneksi ke server.');
  const blob = await res.blob();

  const { Capacitor } = await import('@capacitor/core');
  if (Capacitor.isNativePlatform()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const data = await new Promise((ok, gagal) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result).split(',')[1]);
      r.onerror = gagal;
      r.readAsDataURL(blob);
    });
    const f = await Filesystem.writeFile({ path: 'TemanUMKM.xlsx', data, directory: Directory.Cache });
    await Share.share({ title: 'TemanUMKM.xlsx', url: f.uri });
  } else {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'TemanUMKM.xlsx';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
}
