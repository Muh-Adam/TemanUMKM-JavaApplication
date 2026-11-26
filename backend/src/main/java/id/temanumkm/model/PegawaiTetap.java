package id.temanumkm.model;

public class PegawaiTetap extends Pegawai {
    private final double gajiPokok;
    private final double tunjangan;

    public PegawaiTetap(String nama, String jabatan, double gajiPokok, double tunjangan) {
        super(nama, jabatan);
        this.gajiPokok = tidakNegatif(gajiPokok, "Gaji pokok");
        this.tunjangan = tidakNegatif(tunjangan, "Tunjangan");
    }

    @Override public double hitungGajiBulanan() { return gajiPokok + tunjangan; }
    @Override public String getJenis() { return "Tetap"; }
}
