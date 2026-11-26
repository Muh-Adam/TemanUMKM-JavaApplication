package id.temanumkm.model;

public class PegawaiHarian extends Pegawai {
    private final double upahHarian;
    private final int hariKerja;

    public PegawaiHarian(String nama, String jabatan, double upahHarian, int hariKerja) {
        super(nama, jabatan);
        this.upahHarian = tidakNegatif(upahHarian, "Upah harian");
        if (hariKerja < 0 || hariKerja > 31) throw new IllegalArgumentException("Hari kerja harus 0 sampai 31.");
        this.hariKerja = hariKerja;
    }

    @Override public double hitungGajiBulanan() { return upahHarian * hariKerja; }
    @Override public String getJenis() { return "Harian"; }
}
