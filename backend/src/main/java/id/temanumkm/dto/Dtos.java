package id.temanumkm.dto;

import java.util.List;

/** Bentuk data masuk dan keluar API (record = class immutable). */
public final class Dtos {
    private Dtos() {}

    public record BahanReq(String nama, double hargaBeli, double jumlahBeli, double jumlahPakai) {}
    public record TenagaReq(String nama, double jam, double tarifPerJam) {}
    public record OverheadReq(String nama, double nominal) {}
    public record StrategiReq(String jenis, double nilai) {}

    public record HppReq(String namaProduk, int jumlahPorsi, List<BahanReq> bahan,
                         List<TenagaReq> tenaga, List<OverheadReq> overhead, StrategiReq strategi) {}

    public record RincianRes(String nama, String jenis, double biaya) {}

    public record HppRes(String namaProduk, double totalBiaya, double hppPerPorsi, String strategi,
                         double hargaJual, double hargaJualBulat, double labaPerPorsi,
                         double marginAktual, List<RincianRes> rincian) {}

    public record SimulasiReq(double hppPerPorsi, double hargaJual, int terjualPerBulan, double biayaTetapBulanan) {}

    public record SimulasiRes(double pendapatan, double modalProduksi, double labaKotor,
                              double biayaTetap, double labaBersih, Integer titikImpasPorsi, String status) {}

    // ---- Pegawai ----
    /** Satu bentuk request untuk semua jenis pegawai; yang dipakai tergantung 'jenis'. */
    public record PegawaiReq(String nama, String jabatan, String jenis, double gajiPokok, double tunjangan,
                             double upahHarian, int hariKerja, double tarifJam, double jamPerMinggu) {}
    public record PegawaiRes(String nama, String jabatan, String jenis, double gajiBulanan) {}
    public record GajiRes(List<PegawaiRes> pegawai, double totalBulanan) {}

    // ---- Ekspor ----
    public record RiwayatItem(String waktu, String namaProduk, double hppPerPorsi, double hargaJual) {}
    public record ExportReq(List<HppRes> produk, List<PegawaiReq> pegawai, List<RiwayatItem> riwayat, List<TransaksiReq> kas) {}

    // ---- Buku kas ----
    public record TransaksiReq(String tanggal, String jenis, String kategori, String keterangan, double jumlah) {}
    public record KasReq(String bulan, List<TransaksiReq> transaksi) {}
    public record HarianRes(String tanggal, double masuk, double keluar, double saldo) {}
    public record KategoriRes(String kategori, double total) {}
    public record KasRes(String bulan, int jumlahTransaksi, double totalMasuk, double totalKeluar, double saldo,
                         List<HarianRes> harian, List<KategoriRes> pengeluaranPerKategori) {}
}
