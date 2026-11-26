package id.temanumkm.model;

public class Pengeluaran extends Transaksi {
    public Pengeluaran(String tanggal, String kategori, String keterangan, double jumlah) {
        super(tanggal, kategori, keterangan, jumlah);
    }

    @Override public double nilaiBersih() { return -getJumlah(); }
    @Override public String getJenis() { return "Keluar"; }
}
