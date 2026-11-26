'use client';
import { useEffect, useState } from 'react';
import { Isian, Nota, Baris } from './ui';
import { angka, kirim, rp } from './lib';

const KATEGORI = {
  MASUK: ['Penjualan', 'Lainnya'],
  KELUAR: ['Bahan baku', 'Gaji', 'Sewa dan listrik', 'Kemasan', 'Transportasi', 'Lainnya'],
};

const hariIni = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const tgl = (iso) => iso.slice(8, 10) + '/' + iso.slice(5, 7);

export default function Kas({ kas, setKas }) {
  const [f, setF] = useState({ tanggal: hariIni(), jenis: 'MASUK', kategori: 'Penjualan', keterangan: '', jumlah: '' });
  const [bulan, setBulan] = useState(hariIni().slice(0, 7));
  const [rekap, setRekap] = useState(null);
  const [galat, setGalat] = useState('');

  const bulanIni = kas.filter((t) => t.tanggal.startsWith(bulan)).sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);

  // Rekap dihitung backend Java setiap data atau bulan berubah
  useEffect(() => {
    if (bulanIni.length === 0) { setRekap(null); return; }
    let batal = false;
    kirim('kas/rekap', { bulan, transaksi: bulanIni.map(({ id, ...r }) => r) })
      .then((d) => { if (!batal) { setRekap(d); setGalat(''); } })
      .catch((e) => { if (!batal) setGalat(e.message); });
    return () => { batal = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kas, bulan]);

  function ubahJenis(jenis) {
    setF({ ...f, jenis, kategori: KATEGORI[jenis][0] });
  }

  function tambah(e) {
    e.preventDefault();
    const jumlah = angka(f.jumlah);
    if (jumlah <= 0) return setGalat('Isi jumlah uang lebih dari 0.');
    if (!f.tanggal) return setGalat('Pilih tanggal.');
    setGalat('');
    setKas((l) => [...l, { id: Date.now(), tanggal: f.tanggal, jenis: f.jenis, kategori: f.kategori, keterangan: f.keterangan.trim(), jumlah }]);
    setBulan(f.tanggal.slice(0, 7));
    setF({ ...f, keterangan: '', jumlah: '' });
  }

  return (
    <div className="dua">
      <div>
        {galat && <p className="galat" role="alert">{galat}</p>}
        <form onSubmit={tambah}>
          <fieldset className="bagian">
            <legend>Catat uang masuk atau keluar</legend>
            <div className="pilih" role="group" aria-label="Jenis catatan">
              <button type="button" className={f.jenis === 'MASUK' ? 'on masuk' : ''} onClick={() => ubahJenis('MASUK')}>Uang masuk</button>
              <button type="button" className={f.jenis === 'KELUAR' ? 'on keluar' : ''} onClick={() => ubahJenis('KELUAR')}>Uang keluar</button>
            </div>
            <div className="baris atas">
              <Isian label="Tanggal" type="date" value={f.tanggal} onChange={(e) => setF({ ...f, tanggal: e.target.value })} />
              <label className="isian">
                <span>Kategori</span>
                <select value={f.kategori} onChange={(e) => setF({ ...f, kategori: e.target.value })}>
                  {KATEGORI[f.jenis].map((k) => <option key={k}>{k}</option>)}
                </select>
              </label>
              <Isian label="Jumlah (Rp)" type="number" inputMode="decimal" min="0" value={f.jumlah} onChange={(e) => setF({ ...f, jumlah: e.target.value })} />
              <Isian label="Keterangan (boleh kosong)" value={f.keterangan} onChange={(e) => setF({ ...f, keterangan: e.target.value })} />
            </div>
            <button className="utama">Catat</button>
          </fieldset>
        </form>

        <fieldset className="bagian">
          <legend>Catatan bulan ini ({bulanIni.length})</legend>
          <Isian label="Lihat bulan" type="month" value={bulan} onChange={(e) => e.target.value && setBulan(e.target.value)} />
          {bulanIni.length === 0 && <p className="bantuan" style={{ marginTop: 10 }}>Belum ada catatan di bulan ini. Data tersimpan di perangkat ini.</p>}
          <ul className="daftar" style={{ marginTop: 10 }}>
            {bulanIni.map((t) => (
              <li key={t.id}>
                <span><b>{t.kategori}</b><small>{tgl(t.tanggal)}{t.keterangan ? ' · ' + t.keterangan : ''}</small></span>
                <span className="aksi">
                  <span className={`angka ${t.jenis === 'MASUK' ? 'plus' : 'minus'}`}>{t.jenis === 'MASUK' ? '+' : '-'}{rp(t.jumlah)}</span>
                  <button type="button" className="hapus" onClick={() => setKas((l) => l.filter((x) => x.id !== t.id))} aria-label={`Hapus catatan ${t.kategori} ${tgl(t.tanggal)}`}>Hapus</button>
                </span>
              </li>
            ))}
          </ul>
        </fieldset>
      </div>

      <div className="samping">
        {rekap ? (
          <Nota judul={`Rekap ${rekap.bulan}`} stempel={rekap.saldo > 0 ? 'UNTUNG' : rekap.saldo < 0 ? 'RUGI' : 'IMPAS'}>
            <Baris k="Uang masuk" v={rp(rekap.totalMasuk)} />
            <Baris k="Uang keluar" v={rp(rekap.totalKeluar)} />
            <hr />
            <Baris k="Saldo bulan ini" v={rp(rekap.saldo)} tebal />
            {rekap.pengeluaranPerKategori.length > 0 && (
              <>
                <hr />
                <p className="subjudul">Uang keluar per kategori</p>
                {rekap.pengeluaranPerKategori.map((k) => <Baris key={k.kategori} k={k.kategori} v={rp(k.total)} kecil />)}
              </>
            )}
            <hr />
            <p className="subjudul">Saldo berjalan per hari</p>
            {rekap.harian.map((h) => <Baris key={h.tanggal} k={tgl(h.tanggal)} v={rp(h.saldo)} kecil />)}
          </Nota>
        ) : (
          <p className="kosong">Catat setiap uang masuk dan keluar. Rekap bulanan muncul di sini seperti nota.</p>
        )}
      </div>
    </div>
  );
}
