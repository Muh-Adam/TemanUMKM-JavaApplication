package id.temanumkm.model;

/** Biaya lain per batch: gas, listrik, kemasan, ongkir. */
public class Overhead extends BiayaItem {
    private final double nominal;

    public Overhead(String nama, double nominal) {
        super(nama);
        this.nominal = tidakNegatif(nominal, "Nominal biaya");
    }

    @Override
    public double hitungBiaya() {
        return nominal;
    }

    @Override
    public String getJenis() {
        return "Lain-lain";
    }
}
