package id.temanumkm.strategi;

/** Untung sekian persen dari harga jual (margin), bukan dari modal. */
public class MarginPersen implements StrategiHarga {
    private final double persen;

    public MarginPersen(double persen) {
        if (persen < 0 || persen >= 100) throw new IllegalArgumentException("Margin harus antara 0 dan 99%.");
        this.persen = persen;
    }

    @Override
    public double hitungHarga(double hpp) {
        return hpp / (1 - persen / 100);
    }

    @Override
    public String getNama() {
        return "Margin " + persen + "% dari harga jual";
    }
}
