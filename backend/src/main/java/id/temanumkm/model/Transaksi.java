package id.temanumkm.model;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

/** ABSTRACTION: satu catatan di buku kas. Pemasukan menambah saldo, pengeluaran menguranginya. */
public abstract class Transaksi {
    private final LocalDate tanggal;
    private final String kategori;
    private final String keterangan;
    private final double jumlah;

    protected Transaksi(String tanggal, String kategori, String keterangan, double jumlah) {
        try {
            this.tanggal = LocalDate.parse(tanggal);
        } catch (DateTimeParseException | NullPointerException e) {
            throw new IllegalArgumentException("Format tanggal salah.");
        }
        if (jumlah <= 0) throw new IllegalArgumentException("Jumlah uang harus lebih dari 0.");
        this.jumlah = jumlah;
        this.kategori = (kategori == null || kategori.isBlank()) ? "Lainnya" : kategori.trim();
        this.keterangan = keterangan == null ? "" : keterangan.trim();
    }

    public LocalDate getTanggal() { return tanggal; }
    public String getKategori() { return kategori; }
    public String getKeterangan() { return keterangan; }
    protected double getJumlah() { return jumlah; }

    /** Positif untuk pemasukan, negatif untuk pengeluaran. */
    public abstract double nilaiBersih();

    public abstract String getJenis();
}
