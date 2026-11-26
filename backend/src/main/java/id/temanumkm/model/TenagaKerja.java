package id.temanumkm.model;

public class TenagaKerja extends BiayaItem {
    private final double jam;
    private final double tarifPerJam;

    public TenagaKerja(String nama, double jam, double tarifPerJam) {
        super(nama);
        this.jam = tidakNegatif(jam, "Jam kerja");
        this.tarifPerJam = tidakNegatif(tarifPerJam, "Tarif per jam");
    }

    @Override
    public double hitungBiaya() {
        return jam * tarifPerJam;
    }

    @Override
    public String getJenis() {
        return "Tenaga";
    }
}
