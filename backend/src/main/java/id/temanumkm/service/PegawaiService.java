package id.temanumkm.service;

import id.temanumkm.dto.Dtos.*;
import id.temanumkm.model.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PegawaiService {

    public GajiRes hitungGaji(List<PegawaiReq> daftar) {
        List<Pegawai> semua = new ArrayList<>();
        if (daftar != null) for (PegawaiReq r : daftar) semua.add(buat(r));

        double total = 0;
        List<PegawaiRes> hasil = new ArrayList<>();
        for (Pegawai p : semua) { // polymorphism: tiap subclass menghitung dengan caranya sendiri
            double gaji = p.hitungGajiBulanan();
            total += gaji;
            hasil.add(new PegawaiRes(p.getNama(), p.getJabatan(), p.getJenis(), gaji));
        }
        return new GajiRes(hasil, total);
    }

    /** Factory: memilih subclass berdasarkan jenis pegawai. */
    private Pegawai buat(PegawaiReq r) {
        String jenis = r.jenis() == null ? "TETAP" : r.jenis();
        return switch (jenis) {
            case "HARIAN" -> new PegawaiHarian(r.nama(), r.jabatan(), r.upahHarian(), r.hariKerja());
            case "PARUH_WAKTU" -> new PegawaiParuhWaktu(r.nama(), r.jabatan(), r.tarifJam(), r.jamPerMinggu());
            default -> new PegawaiTetap(r.nama(), r.jabatan(), r.gajiPokok(), r.tunjangan());
        };
    }
}
