package id.temanumkm.model;

/** INHERITANCE: BahanBaku mewarisi BiayaItem. */
public class BahanBaku extends BiayaItem {
    private final double hargaBeli;
    private final double jumlahBeli;
    private final double jumlahPakai;

    public BahanBaku(String nama, double hargaBeli, double jumlahBeli, double jumlahPakai) {
        super(nama);
        this.hargaBeli = tidakNegatif(hargaBeli, "Harga beli");
        this.jumlahPakai = tidakNegatif(jumlahPakai, "Jumlah pakai");
        if (jumlahBeli <= 0) {
            throw new IllegalArgumentException("Jumlah beli '" + getNama() + "' harus lebih dari 0.");
        }
        this.jumlahBeli = jumlahBeli;
    }

    @Override
    public double hitungBiaya() {
        return hargaBeli / jumlahBeli * jumlahPakai; // harga per satuan x yang terpakai
    }

    @Override
    public String getJenis() {
        return "Bahan";
    }
}
