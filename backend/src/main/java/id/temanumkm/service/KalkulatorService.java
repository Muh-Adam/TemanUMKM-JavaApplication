package id.temanumkm.service;

import id.temanumkm.dto.Dtos.*;
import id.temanumkm.model.*;
import id.temanumkm.strategi.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KalkulatorService {

    public HppRes hitungHpp(HppReq req) {
        Produk produk = new Produk(req.namaProduk(), req.jumlahPorsi());

        for (BahanReq b : orEmpty(req.bahan()))
            produk.tambah(new BahanBaku(b.nama(), b.hargaBeli(), b.jumlahBeli(), b.jumlahPakai()));
        for (TenagaReq t : orEmpty(req.tenaga()))
            produk.tambah(new TenagaKerja(t.nama(), t.jam(), t.tarifPerJam()));
        for (OverheadReq o : orEmpty(req.overhead()))
            produk.tambah(new Overhead(o.nama(), o.nominal()));

        double hpp = produk.hppPerPorsi();
        if (hpp <= 0) throw new IllegalArgumentException("Isi minimal satu biaya dengan nominal lebih dari 0.");

        StrategiHarga strategi = buatStrategi(req.strategi());
        double harga = strategi.hitungHarga(hpp);
        double bulat = Math.ceil(harga / 500) * 500; // harga di warung dibulatkan ke atas, kelipatan 500

        List<RincianRes> rincian = produk.getItems().stream()
                .map(i -> new RincianRes(i.getNama(), i.getJenis(), i.hitungBiaya()))
                .toList();

        return new HppRes(produk.getNama(), produk.totalBiaya(), hpp, strategi.getNama(),
                harga, bulat, bulat - hpp, (bulat - hpp) / bulat * 100, rincian);
    }

    public SimulasiRes simulasi(SimulasiReq req) {
        if (req.terjualPerBulan() < 0 || req.biayaTetapBulanan() < 0 || req.hppPerPorsi() < 0 || req.hargaJual() < 0)
            throw new IllegalArgumentException("Semua angka simulasi harus 0 atau lebih.");

        double pendapatan = req.hargaJual() * req.terjualPerBulan();
        double modal = req.hppPerPorsi() * req.terjualPerBulan();
        double labaKotor = pendapatan - modal;
        double labaBersih = labaKotor - req.biayaTetapBulanan();

        double untungPerPorsi = req.hargaJual() - req.hppPerPorsi();
        Integer impas = untungPerPorsi > 0 ? (int) Math.ceil(req.biayaTetapBulanan() / untungPerPorsi) : null;

        String status = labaBersih > 0 ? "UNTUNG" : (labaBersih == 0 ? "IMPAS" : "RUGI");
        return new SimulasiRes(pendapatan, modal, labaKotor, req.biayaTetapBulanan(), labaBersih, impas, status);
    }

    private StrategiHarga buatStrategi(StrategiReq s) {
        if (s == null) return new MarginPersen(30);
        return switch (s.jenis() == null ? "MARGIN" : s.jenis()) {
            case "MARKUP" -> new MarkupRupiah(s.nilai());
            default -> new MarginPersen(s.nilai());
        };
    }

    private static <T> List<T> orEmpty(List<T> list) {
        return list == null ? List.of() : list;
    }
}
