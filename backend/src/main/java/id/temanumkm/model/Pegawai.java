package id.temanumkm.model;

/** ABSTRACTION: tiap jenis pegawai punya cara hitung gaji bulanan sendiri. */
public abstract class Pegawai {
    private final String nama;
    private final String jabatan;

    protected Pegawai(String nama, String jabatan) {
        if (nama == null || nama.isBlank()) throw new IllegalArgumentException("Nama pegawai wajib diisi.");
        this.nama = nama.trim();
        this.jabatan = (jabatan == null || jabatan.isBlank()) ? "-" : jabatan.trim();
    }

    public String getNama() { return nama; }
    public String getJabatan() { return jabatan; }

    public abstract double hitungGajiBulanan();
    public abstract String getJenis();

    protected static double tidakNegatif(double v, String label) {
        if (v < 0) throw new IllegalArgumentException(label + " tidak boleh minus.");
        return v;
    }
}
