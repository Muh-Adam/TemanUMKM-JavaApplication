package id.temanumkm.model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** COMPOSITION: Produk memiliki banyak BiayaItem, tanpa peduli jenis aslinya. */
public class Produk {
    private final String nama;
    private final int jumlahPorsi;
    private final List<BiayaItem> items = new ArrayList<>();

    public Produk(String nama, int jumlahPorsi) {
        if (jumlahPorsi <= 0) throw new IllegalArgumentException("Jumlah porsi per batch harus lebih dari 0.");
        this.nama = (nama == null || nama.isBlank()) ? "Produk" : nama.trim();
        this.jumlahPorsi = jumlahPorsi;
    }

    public void tambah(BiayaItem item) {
        items.add(item);
    }

    public List<BiayaItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public double totalBiaya() {
        double total = 0;
        for (BiayaItem item : items) total += item.hitungBiaya(); // polymorphic call
        return total;
    }

    /** Harga Pokok Produksi per porsi. */
    public double hppPerPorsi() {
        return totalBiaya() / jumlahPorsi;
    }

    public String getNama() {
        return nama;
    }
}
