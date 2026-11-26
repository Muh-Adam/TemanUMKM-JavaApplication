package id.temanumkm.model;

import java.time.LocalDate;
import java.util.*;

/** COMPOSITION: BukuKas menyimpan banyak Transaksi tanpa peduli masuk atau keluar. */
public class BukuKas {
    private final List<Transaksi> daftar = new ArrayList<>();

    public void tambah(Transaksi t) { daftar.add(t); }

    public int jumlah() { return daftar.size(); }

    public double saldo() {
        double s = 0;
        for (Transaksi t : daftar) s += t.nilaiBersih(); // polymorphism
        return s;
    }

    public double totalMasuk() {
        double s = 0;
        for (Transaksi t : daftar) if (t.nilaiBersih() > 0) s += t.nilaiBersih();
        return s;
    }

    public double totalKeluar() {
        return totalMasuk() - saldo();
    }

    /** Per tanggal (terurut): [masuk, keluar]. */
    public SortedMap<LocalDate, double[]> perHari() {
        SortedMap<LocalDate, double[]> hasil = new TreeMap<>();
        for (Transaksi t : daftar) {
            double[] x = hasil.computeIfAbsent(t.getTanggal(), k -> new double[2]);
            if (t.nilaiBersih() > 0) x[0] += t.nilaiBersih(); else x[1] -= t.nilaiBersih();
        }
        return hasil;
    }

    /** Total pengeluaran per kategori, terbesar dulu. */
    public List<Map.Entry<String, Double>> pengeluaranPerKategori() {
        Map<String, Double> m = new HashMap<>();
        for (Transaksi t : daftar) if (t.nilaiBersih() < 0) m.merge(t.getKategori(), -t.nilaiBersih(), Double::sum);
        List<Map.Entry<String, Double>> l = new ArrayList<>(m.entrySet());
        l.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
        return l;
    }
}
