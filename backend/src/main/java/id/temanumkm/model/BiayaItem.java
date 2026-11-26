package id.temanumkm.model;

/**
 * ABSTRACTION: kerangka umum untuk semua jenis biaya produksi.
 * ENCAPSULATION: field 'nama' private, hanya bisa dibaca lewat getter.
 */
public abstract class BiayaItem {
    private final String nama;

    protected BiayaItem(String nama) {
        this.nama = (nama == null || nama.isBlank()) ? "Tanpa nama" : nama.trim();
    }

    public String getNama() {
        return nama;
    }

    /** Setiap subclass punya cara hitung sendiri (POLYMORPHISM). */
    public abstract double hitungBiaya();

    public abstract String getJenis();

    protected static double tidakNegatif(double nilai, String label) {
        if (nilai < 0) throw new IllegalArgumentException(label + " tidak boleh minus.");
        return nilai;
    }
}
