package id.temanumkm.model;

public class PegawaiParuhWaktu extends Pegawai {
    private static final double MINGGU_PER_BULAN = 4.33;
    private final double tarifJam;
    private final double jamPerMinggu;

    public PegawaiParuhWaktu(String nama, String jabatan, double tarifJam, double jamPerMinggu) {
        super(nama, jabatan);
        this.tarifJam = tidakNegatif(tarifJam, "Tarif per jam");
        this.jamPerMinggu = tidakNegatif(jamPerMinggu, "Jam per minggu");
    }

    @Override public double hitungGajiBulanan() { return tarifJam * jamPerMinggu * MINGGU_PER_BULAN; }
    @Override public String getJenis() { return "Paruh waktu"; }
}
