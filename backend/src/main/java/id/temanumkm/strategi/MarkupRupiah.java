package id.temanumkm.strategi;

/** Untung tetap dalam rupiah per porsi. */
public class MarkupRupiah implements StrategiHarga {
    private final double rupiah;

    public MarkupRupiah(double rupiah) {
        if (rupiah < 0) throw new IllegalArgumentException("Untung per porsi tidak boleh minus.");
        this.rupiah = rupiah;
    }

    @Override
    public double hitungHarga(double hpp) {
        return hpp + rupiah;
    }

    @Override
    public String getNama() {
        return "Untung tetap Rp" + Math.round(rupiah) + " per porsi";
    }
}
