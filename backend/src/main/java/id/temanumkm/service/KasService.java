package id.temanumkm.service;

import id.temanumkm.dto.Dtos.*;
import id.temanumkm.model.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class KasService {

    public KasRes rekap(KasReq req) {
        YearMonth bulan;
        try {
            bulan = YearMonth.parse(req.bulan());
        } catch (Exception e) {
            throw new IllegalArgumentException("Format bulan salah.");
        }

        BukuKas buku = new BukuKas();
        if (req.transaksi() != null) {
            for (TransaksiReq r : req.transaksi()) {
                Transaksi t = buat(r);
                if (YearMonth.from(t.getTanggal()).equals(bulan)) buku.tambah(t);
            }
        }

        List<HarianRes> harian = new ArrayList<>();
        double berjalan = 0;
        for (Map.Entry<LocalDate, double[]> e : buku.perHari().entrySet()) {
            berjalan += e.getValue()[0] - e.getValue()[1];
            harian.add(new HarianRes(e.getKey().toString(), e.getValue()[0], e.getValue()[1], berjalan));
        }
        List<KategoriRes> kategori = buku.pengeluaranPerKategori().stream()
                .map(e -> new KategoriRes(e.getKey(), e.getValue())).toList();

        return new KasRes(bulan.toString(), buku.jumlah(), buku.totalMasuk(), buku.totalKeluar(), buku.saldo(), harian, kategori);
    }

    /** Factory: pilih subclass dari jenis transaksi. */
    private Transaksi buat(TransaksiReq r) {
        return "KELUAR".equals(r.jenis())
                ? new Pengeluaran(r.tanggal(), r.kategori(), r.keterangan(), r.jumlah())
                : new Pemasukan(r.tanggal(), r.kategori(), r.keterangan(), r.jumlah());
    }
}
