'use client';
import { useState } from 'react';
import { eksporExcel, rp } from './lib';

export default function Simpanan({ produk, setProduk, riwayat, setRiwayat, pegawai, kas, buka }) {
  const [galat, setGalat] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  async function unduh() {
    setGalat('');
    setInfo('');
    setLoading(true);
    try {
      await eksporExcel({
        produk: produk.map((p) => p.hasil),
        pegawai: pegawai.map(({ id, ...r }) => r),
        riwayat: riwayat.map(({ id, ...r }) => r),
        kas: kas.map(({ id, ...r }) => r),
      });
      setInfo('File Excel siap.');
    } catch (err) {
      setGalat(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="satu">
      {galat && <p className="galat" role="alert">{galat}</p>}

      <fieldset className="bagian">
        <legend>Produk tersimpan ({produk.length})</legend>
        {produk.length === 0 && <p className="bantuan">Belum ada. Hitung sebuah produk, lalu tekan <b>Simpan produk ini</b>.</p>}
        <ul className="daftar">
          {produk.map((p) => (
            <li key={p.id}>
              <span><b>{p.nama}</b><small>Modal {rp(p.hasil.hppPerPorsi)} · jual {rp(p.hasil.hargaJualBulat)} · untung {rp(p.hasil.labaPerPorsi)}/porsi</small></span>
              <span className="aksi">
                <button type="button" className="tambah" onClick={() => buka(p)}>Buka</button>
                <button type="button" className="hapus" onClick={() => setProduk((l) => l.filter((x) => x.id !== p.id))} aria-label={`Hapus ${p.nama}`}>Hapus</button>
              </span>
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className="bagian">
        <legend>Riwayat perhitungan</legend>
        {riwayat.length === 0 && <p className="bantuan">Setiap kali kamu menekan Hitung, catatannya muncul di sini (maksimal 50 terakhir).</p>}
        <ul className="daftar">
          {riwayat.slice(0, 20).map((r) => (
            <li key={r.id}>
              <span><b>{r.namaProduk}</b><small>{r.waktu}</small></span>
              <span className="angka">Modal {rp(r.hppPerPorsi)}<br />Jual {rp(r.hargaJual)}</span>
            </li>
          ))}
        </ul>
        {riwayat.length > 0 && <button type="button" className="hapus" onClick={() => setRiwayat([])}>Hapus semua riwayat</button>}
      </fieldset>

      <fieldset className="bagian">
        <legend>Ekspor ke Excel</legend>
        <p className="bantuan">Berisi 5 lembar: Produk, Rincian biaya, Pegawai, Riwayat, dan Kas. Di HP, file dibuka lewat menu Bagikan sehingga bisa disimpan atau dikirim lewat WhatsApp.</p>
        <button className="utama" onClick={unduh} disabled={loading}>{loading ? 'Membuat file…' : 'Unduh Excel (.xlsx)'}</button>
        {info && <p role="status">{info}</p>}
      </fieldset>
    </div>
  );
}
