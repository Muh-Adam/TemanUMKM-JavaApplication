'use client';
import { useState } from 'react';
import { Isian, Nota, Baris } from './ui';
import { angka, kirim, rp } from './lib';

const kosong = { nama: '', jabatan: '', jenis: 'TETAP', gajiPokok: '', tunjangan: '', upahHarian: '', hariKerja: '', tarifJam: '', jamPerMinggu: '' };
const LABEL = { TETAP: 'Tetap', HARIAN: 'Harian', PARUH_WAKTU: 'Paruh waktu' };

export default function Pegawai({ pegawai, setPegawai, pakaiGaji }) {
  const [f, setF] = useState(kosong);
  const [hasil, setHasil] = useState(null);
  const [galat, setGalat] = useState('');
  const [loading, setLoading] = useState(false);
  const isi = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const angkaInput = (label, k, extra = {}) => (
    <Isian label={label} type="number" inputMode="decimal" min="0" value={f[k]} onChange={isi(k)} {...extra} />
  );

  function tambah(e) {
    e.preventDefault();
    if (!f.nama.trim()) return setGalat('Nama pegawai wajib diisi.');
    setGalat('');
    setPegawai((l) => [
      ...l,
      {
        id: Date.now(), nama: f.nama.trim(), jabatan: f.jabatan.trim(), jenis: f.jenis,
        gajiPokok: angka(f.gajiPokok), tunjangan: angka(f.tunjangan), upahHarian: angka(f.upahHarian),
        hariKerja: Math.round(angka(f.hariKerja)), tarifJam: angka(f.tarifJam), jamPerMinggu: angka(f.jamPerMinggu),
      },
    ]);
    setF({ ...kosong, jenis: f.jenis });
    setHasil(null);
  }

  function hapus(id) {
    setPegawai((l) => l.filter((p) => p.id !== id));
    setHasil(null);
  }

  async function hitung() {
    setGalat('');
    setLoading(true);
    try {
      setHasil(await kirim('pegawai/hitung', pegawai.map(({ id, ...r }) => r)));
    } catch (err) {
      setGalat(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dua">
      <div>
        {galat && <p className="galat" role="alert">{galat}</p>}
        <form onSubmit={tambah}>
          <fieldset className="bagian">
            <legend>Tambah pegawai</legend>
            <div className="baris atas">
              <Isian label="Nama" value={f.nama} onChange={isi('nama')} />
              <Isian label="Jabatan (boleh kosong)" value={f.jabatan} onChange={isi('jabatan')} />
              <label className="isian">
                <span>Jenis pegawai</span>
                <select value={f.jenis} onChange={isi('jenis')}>
                  <option value="TETAP">Tetap (gaji bulanan)</option>
                  <option value="HARIAN">Harian</option>
                  <option value="PARUH_WAKTU">Paruh waktu (per jam)</option>
                </select>
              </label>
            </div>
            <div className="baris atas" style={{ marginTop: 10 }}>
              {f.jenis === 'TETAP' && <>{angkaInput('Gaji pokok (Rp)', 'gajiPokok')}{angkaInput('Tunjangan (Rp)', 'tunjangan')}</>}
              {f.jenis === 'HARIAN' && <>{angkaInput('Upah per hari (Rp)', 'upahHarian')}{angkaInput('Hari kerja sebulan', 'hariKerja', { max: 31 })}</>}
              {f.jenis === 'PARUH_WAKTU' && <>{angkaInput('Tarif per jam (Rp)', 'tarifJam')}{angkaInput('Jam kerja per minggu', 'jamPerMinggu')}</>}
            </div>
            <button className="tambah" style={{ marginTop: 12 }}>Tambah ke daftar</button>
          </fieldset>
        </form>

        <fieldset className="bagian">
          <legend>Daftar pegawai ({pegawai.length})</legend>
          {pegawai.length === 0 && <p className="bantuan">Belum ada pegawai. Data tersimpan di perangkat ini.</p>}
          <ul className="daftar">
            {pegawai.map((p) => (
              <li key={p.id}>
                <span><b>{p.nama}</b><small>{p.jabatan || '-'} · {LABEL[p.jenis]}</small></span>
                <button type="button" className="hapus" onClick={() => hapus(p.id)} aria-label={`Hapus ${p.nama}`}>Hapus</button>
              </li>
            ))}
          </ul>
          {pegawai.length > 0 && <button className="utama" onClick={hitung} disabled={loading}>{loading ? 'Menghitung…' : 'Hitung gaji sebulan'}</button>}
        </fieldset>
      </div>

      <div className="samping">
        {hasil ? (
          <Nota judul="Gaji pegawai sebulan">
            {hasil.pegawai.map((p, i) => <Baris key={i} k={`${p.nama} (${p.jenis.toLowerCase()})`} v={rp(p.gajiBulanan)} kecil />)}
            <hr />
            <Baris k="Total gaji" v={rp(hasil.totalBulanan)} tebal />
            <button className="utama kedua" onClick={() => pakaiGaji(hasil.totalBulanan)}>Pakai total ini di simulasi bulanan</button>
          </Nota>
        ) : (
          <p className="kosong">Tambahkan pegawai, lalu tekan <b>Hitung gaji sebulan</b>. Totalnya bisa dimasukkan otomatis ke simulasi untung rugi.</p>
        )}
      </div>
    </div>
  );
}
