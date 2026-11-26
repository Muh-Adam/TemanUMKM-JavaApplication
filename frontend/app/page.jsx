'use client';
import { useEffect, useState } from 'react';
import { angka, kirim, rp, useLokal } from './lib';
import { Baris, Isian, Nota } from './ui';
import Kas from './Kas';
import Pegawai from './Pegawai';
import Simpanan from './Simpanan';

const baris = {
  bahan: { nama: '', hargaBeli: '', jumlahBeli: '', jumlahPakai: '' },
  tenaga: { nama: '', jam: '', tarifPerJam: '' },
  overhead: { nama: '', nominal: '' },
};

const contoh = {
  namaProduk: 'Brownies kukus',
  jumlahPorsi: '20',
  bahan: [
    { nama: 'Tepung terigu (gram)', hargaBeli: '13000', jumlahBeli: '1000', jumlahPakai: '300' },
    { nama: 'Cokelat batang (gram)', hargaBeli: '48000', jumlahBeli: '500', jumlahPakai: '250' },
    { nama: 'Telur (butir)', hargaBeli: '28000', jumlahBeli: '16', jumlahPakai: '5' },
  ],
  tenaga: [{ nama: 'Bikin dan kukus', jam: '2', tarifPerJam: '10000' }],
  overhead: [
    { nama: 'Gas', nominal: '6000' },
    { nama: 'Kotak kemasan', nominal: '20000' },
  ],
  jenis: 'MARGIN',
  nilai: '40',
};

function PengaturanServer() {
  const [alamat, setAlamat] = useState('');
  const [tersimpan, setTersimpan] = useState(false);
  useEffect(() => { try { setAlamat(localStorage.getItem('apiUrl') || ''); } catch {} }, []);
  function simpan(e) {
    e.preventDefault();
    try { localStorage.setItem('apiUrl', alamat.trim()); setTersimpan(true); } catch {}
  }
  return (
    <details className="server">
      <summary>Alamat server (untuk aplikasi HP)</summary>
      <form onSubmit={simpan}>
        <Isian label="Contoh: http://192.168.1.10:8080" value={alamat} onChange={(e) => { setAlamat(e.target.value); setTersimpan(false); }} placeholder="http://IP-LAPTOP:8080" />
        <button className="tambah">Simpan</button>
        {tersimpan && <span> Tersimpan.</span>}
      </form>
    </details>
  );
}

function Daftar({ judul, bantuan, kunci, form, ubah, tambah, hapus, kolom }) {
  return (
    <fieldset className="bagian">
      <legend>{judul}</legend>
      <p className="bantuan">{bantuan}</p>
      {form[kunci].map((r, i) => (
        <div className="baris" key={i}>
          {kolom.map(([f, label, tipe]) => (
            <Isian
              key={f}
              label={label}
              type={tipe}
              inputMode={tipe === 'number' ? 'decimal' : undefined}
              min={tipe === 'number' ? 0 : undefined}
              value={r[f]}
              onChange={(e) => ubah(kunci, i, f, e.target.value)}
            />
          ))}
          <button type="button" className="hapus" onClick={() => hapus(kunci, i)} aria-label={`Hapus baris ${i + 1} dari ${judul}`}>
            Hapus
          </button>
        </div>
      ))}
      <button type="button" className="tambah" onClick={() => tambah(kunci)}>
        Tambah {judul.toLowerCase()}
      </button>
    </fieldset>
  );
}

export default function Home() {
  const [tab, setTab] = useState('hpp');
  const [form, setForm] = useState(contoh);
  const [hasil, setHasil] = useState(null);
  const [sim, setSim] = useState({ hppPerPorsi: '', hargaJual: '', terjualPerBulan: '300', biayaTetapBulanan: '500000', gajiPegawai: '' });
  const [hasilSim, setHasilSim] = useState(null);
  const [produk, setProduk] = useLokal('produk', []);
  const [riwayat, setRiwayat] = useLokal('riwayat', []);
  const [pegawai, setPegawai] = useLokal('pegawai', []);
  const [kas, setKas] = useLokal('kas', []);
  const [tersimpan, setTersimpan] = useState(false);
  const [galat, setGalat] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const ubah = (k, i, f, v) => setForm((s) => ({ ...s, [k]: s[k].map((r, x) => (x === i ? { ...r, [f]: v } : r)) }));
  const tambah = (k) => setForm((s) => ({ ...s, [k]: [...s[k], { ...baris[k] }] }));
  const hapus = (k, i) => setForm((s) => ({ ...s, [k]: s[k].filter((_, x) => x !== i) }));

  async function hitung(e) {
    e.preventDefault();
    setGalat('');
    setLoading(true);
    try {
      const num = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, k === 'nama' || k === 'satuan' ? v : angka(v)]));
      const data = await kirim('hpp', {
        namaProduk: form.namaProduk,
        jumlahPorsi: angka(form.jumlahPorsi),
        bahan: form.bahan.map(num),
        tenaga: form.tenaga.map(num),
        overhead: form.overhead.map(num),
        strategi: { jenis: form.jenis, nilai: angka(form.nilai) },
      });
      setHasil(data);
      setTersimpan(false);
      setRiwayat((r) => [{ id: Date.now(), waktu: new Date().toLocaleString('id-ID'), namaProduk: data.namaProduk, hppPerPorsi: data.hppPerPorsi, hargaJual: data.hargaJualBulat }, ...r].slice(0, 50));
    } catch (err) {
      setGalat(err.message);
      setHasil(null);
    } finally {
      setLoading(false);
    }
  }

  async function simulasikan(e) {
    e.preventDefault();
    setGalat('');
    setLoading(true);
    try {
      setHasilSim(
        await kirim('simulasi', {
          hppPerPorsi: angka(sim.hppPerPorsi),
          hargaJual: angka(sim.hargaJual),
          terjualPerBulan: Math.round(angka(sim.terjualPerBulan)),
          biayaTetapBulanan: angka(sim.biayaTetapBulanan) + angka(sim.gajiPegawai),
        })
      );
    } catch (err) {
      setGalat(err.message);
      setHasilSim(null);
    } finally {
      setLoading(false);
    }
  }

  function simpanProduk() {
    setProduk((l) => [{ id: Date.now(), nama: hasil.namaProduk, form, hasil }, ...l.filter((p) => p.nama !== hasil.namaProduk)]);
    setTersimpan(true);
  }

  function bukaProduk(p) {
    setForm(p.form);
    setHasil(p.hasil);
    setTersimpan(true);
    setGalat('');
    setTab('hpp');
  }

  function pakaiGaji(total) {
    setSim((s) => ({ ...s, gajiPegawai: String(Math.round(total)) }));
    setHasilSim(null);
    setGalat('');
    setTab('sim');
  }

  function keSimulasi() {
    setSim((s) => ({ ...s, hppPerPorsi: String(Math.round(hasil.hppPerPorsi)), hargaJual: String(hasil.hargaJualBulat) }));
    setHasilSim(null);
    setGalat('');
    setTab('sim');
  }

  return (
    <main>
      <header>
        <h1>TemanUMKM</h1>
        <p>Berapa modal sebenarnya satu porsi daganganmu, dan berapa harga jual yang aman?</p>
        <nav aria-label="Menu">
          <button className={tab === 'hpp' ? 'aktif' : ''} onClick={() => { setTab('hpp'); setGalat(''); }}>Hitung modal per porsi</button>
          <button className={tab === 'sim' ? 'aktif' : ''} onClick={() => { setTab('sim'); setGalat(''); }}>Untung rugi sebulan</button>
          <button className={tab === 'kas' ? 'aktif' : ''} onClick={() => { setTab('kas'); setGalat(''); }}>Buku kas</button>
          <button className={tab === 'pegawai' ? 'aktif' : ''} onClick={() => { setTab('pegawai'); setGalat(''); }}>Pegawai</button>
          <button className={tab === 'simpanan' ? 'aktif' : ''} onClick={() => { setTab('simpanan'); setGalat(''); }}>Simpanan</button>
        </nav>
      </header>

      {galat && <p className="galat" role="alert">{galat}</p>}

      {tab === 'hpp' ? (
        <div className="dua">
          <form onSubmit={hitung}>
            <div className="baris atas">
              <Isian label="Nama produk" value={form.namaProduk} onChange={(e) => set('namaProduk', e.target.value)} />
              <Isian label="Jadi berapa porsi per sekali produksi?" type="number" inputMode="numeric" min="1" value={form.jumlahPorsi} onChange={(e) => set('jumlahPorsi', e.target.value)} />
            </div>

            <Daftar judul="Bahan" bantuan="Isi harga dan jumlah beli di kemasan, lalu berapa yang terpakai. Biaya terpakai dihitung otomatis." kunci="bahan" form={form} ubah={ubah} tambah={tambah} hapus={hapus}
              kolom={[['nama', 'Nama bahan', 'text'], ['hargaBeli', 'Harga beli (Rp)', 'number'], ['jumlahBeli', 'Isi kemasan', 'number'], ['jumlahPakai', 'Terpakai', 'number']]} />
            <Daftar judul="Tenaga" bantuan="Gaji sendiri juga dihitung, supaya kerjamu tidak gratis." kunci="tenaga" form={form} ubah={ubah} tambah={tambah} hapus={hapus}
              kolom={[['nama', 'Pekerjaan', 'text'], ['jam', 'Jam', 'number'], ['tarifPerJam', 'Upah per jam (Rp)', 'number']]} />
            <Daftar judul="Biaya lain" bantuan="Gas, listrik, kemasan, ongkos antar untuk satu kali produksi." kunci="overhead" form={form} ubah={ubah} tambah={tambah} hapus={hapus}
              kolom={[['nama', 'Nama biaya', 'text'], ['nominal', 'Nominal (Rp)', 'number']]} />

            <fieldset className="bagian">
              <legend>Cara menentukan harga jual</legend>
              <div className="baris atas">
                <label className="isian">
                  <span>Hitung untung dengan</span>
                  <select value={form.jenis} onChange={(e) => set('jenis', e.target.value)}>
                    <option value="MARGIN">Persen dari harga jual</option>
                    <option value="MARKUP">Rupiah tetap per porsi</option>
                  </select>
                </label>
                <Isian label={form.jenis === 'MARGIN' ? 'Untung (%)' : 'Untung per porsi (Rp)'} type="number" inputMode="decimal" min="0" value={form.nilai} onChange={(e) => set('nilai', e.target.value)} />
              </div>
            </fieldset>

            <button className="utama" disabled={loading}>{loading ? 'Menghitung…' : 'Hitung modal dan harga jual'}</button>
          </form>

          <div className="samping">
            {hasil ? (
              <Nota judul={hasil.namaProduk}>
                {hasil.rincian.map((r, i) => <Baris key={i} k={`${r.nama} (${r.jenis.toLowerCase()})`} v={rp(r.biaya)} kecil />)}
                <hr />
                <Baris k="Total sekali produksi" v={rp(hasil.totalBiaya)} />
                <Baris k="Modal per porsi (HPP)" v={rp(hasil.hppPerPorsi)} tebal />
                <hr />
                <Baris k={hasil.strategi} v={rp(hasil.hargaJual)} kecil />
                <Baris k="Harga jual, dibulatkan" v={rp(hasil.hargaJualBulat)} tebal />
                <Baris k="Untung per porsi" v={rp(hasil.labaPerPorsi)} />
                <Baris k="Untung dari harga jual" v={hasil.marginAktual.toFixed(1) + '%'} kecil />
                <button className="utama kedua" onClick={keSimulasi}>Pakai angka ini untuk simulasi bulanan</button>
                <button className="utama kedua" onClick={simpanProduk} disabled={tersimpan}>{tersimpan ? 'Produk tersimpan' : 'Simpan produk ini'}</button>
              </Nota>
            ) : (
              <p className="kosong">Isi data di sebelah, lalu tekan <b>Hitung</b>. Hasilnya muncul di sini seperti nota.</p>
            )}
          </div>
        </div>
      ) : tab === 'sim' ? (
        <div className="dua">
          <form onSubmit={simulasikan}>
            <fieldset className="bagian">
              <legend>Angka usahamu</legend>
              <div className="baris atas">
                <Isian label="Modal per porsi (Rp)" type="number" inputMode="decimal" min="0" value={sim.hppPerPorsi} onChange={(e) => setSim({ ...sim, hppPerPorsi: e.target.value })} />
                <Isian label="Harga jual per porsi (Rp)" type="number" inputMode="decimal" min="0" value={sim.hargaJual} onChange={(e) => setSim({ ...sim, hargaJual: e.target.value })} />
                <Isian label="Porsi terjual sebulan" type="number" inputMode="numeric" min="0" value={sim.terjualPerBulan} onChange={(e) => setSim({ ...sim, terjualPerBulan: e.target.value })} />
                <Isian label="Biaya tetap sebulan (sewa, listrik, dll, Rp)" type="number" inputMode="decimal" min="0" value={sim.biayaTetapBulanan} onChange={(e) => setSim({ ...sim, biayaTetapBulanan: e.target.value })} />
                <Isian label="Gaji pegawai sebulan (Rp)" type="number" inputMode="decimal" min="0" value={sim.gajiPegawai} onChange={(e) => setSim({ ...sim, gajiPegawai: e.target.value })} placeholder="isi dari tab Pegawai" />
              </div>
            </fieldset>
            <button className="utama" disabled={loading}>{loading ? 'Menghitung…' : 'Simulasikan sebulan'}</button>
          </form>

          <div className="samping">
            {hasilSim ? (
              <Nota judul="Rekap sebulan" stempel={hasilSim.status}>
                <Baris k="Uang masuk" v={rp(hasilSim.pendapatan)} />
                <Baris k="Modal produksi" v={rp(hasilSim.modalProduksi)} />
                <Baris k="Untung sebelum biaya tetap" v={rp(hasilSim.labaKotor)} />
                <Baris k="Biaya tetap" v={rp(hasilSim.biayaTetap)} />
                <hr />
                <Baris k="Untung bersih" v={rp(hasilSim.labaBersih)} tebal />
                <Baris
                  k="Balik modal mulai"
                  v={hasilSim.titikImpasPorsi == null ? 'tidak tercapai' : `porsi ke-${hasilSim.titikImpasPorsi.toLocaleString('id-ID')}`}
                  kecil
                />
                {hasilSim.titikImpasPorsi == null && <p className="catatan">Harga jual belum di atas modal per porsi, jadi makin banyak terjual makin rugi. Naikkan harga atau turunkan modal.</p>}
              </Nota>
            ) : (
              <p className="kosong">Masukkan angka usaha, lalu tekan <b>Simulasikan</b>. Bisa juga dimulai dari tab hitung modal.</p>
            )}
          </div>
        </div>
      ) : tab === 'kas' ? (
        <Kas kas={kas} setKas={setKas} />
      ) : tab === 'pegawai' ? (
        <Pegawai pegawai={pegawai} setPegawai={setPegawai} pakaiGaji={pakaiGaji} />
      ) : (
        <Simpanan produk={produk} setProduk={setProduk} riwayat={riwayat} setRiwayat={setRiwayat} pegawai={pegawai} kas={kas} buka={bukaProduk} />
      )}

      <PengaturanServer />

      <footer>Mendukung SDG 8: pekerjaan layak dan pertumbuhan ekonomi. Harga yang sehat membuat usaha kecil bertahan.</footer>
    </main>
  );
}
