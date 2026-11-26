package id.temanumkm.strategi;

/** INTERFACE: cara menentukan harga jual dari HPP bisa diganti-ganti. */
public interface StrategiHarga {
    double hitungHarga(double hppPerPorsi);

    String getNama();
}
