package id.temanumkm.ekspor;

import id.temanumkm.dto.Dtos.*;
import id.temanumkm.service.PegawaiService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Comparator;
import java.util.List;

@Component
public class XlsxEksportir implements Eksportir {
    private final PegawaiService pegawaiService;

    public XlsxEksportir(PegawaiService pegawaiService) {
        this.pegawaiService = pegawaiService;
    }

    @Override
    public byte[] ekspor(ExportReq data) throws IOException {
        try (XSSFWorkbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Font tebal = wb.createFont();
            tebal.setBold(true);
            CellStyle judul = wb.createCellStyle();
            judul.setFont(tebal);
            CellStyle angka = wb.createCellStyle();
            angka.setDataFormat(wb.createDataFormat().getFormat("#,##0.##"));

            Sheet produk = lembar(wb, "Produk", judul, "Produk", "Total biaya", "HPP per porsi", "Cara untung", "Harga jual", "Laba per porsi", "Margin %");
            Sheet rincian = lembar(wb, "Rincian", judul, "Produk", "Komponen", "Jenis", "Biaya");
            int p = 1, r = 1;
            for (HppRes h : orEmpty(data.produk())) {
                baris(produk, p++, angka, h.namaProduk(), h.totalBiaya(), h.hppPerPorsi(), h.strategi(), h.hargaJualBulat(), h.labaPerPorsi(), h.marginAktual());
                for (RincianRes x : orEmpty(h.rincian())) baris(rincian, r++, angka, h.namaProduk(), x.nama(), x.jenis(), x.biaya());
            }

            GajiRes gaji = pegawaiService.hitungGaji(data.pegawai());
            Sheet peg = lembar(wb, "Pegawai", judul, "Nama", "Jabatan", "Jenis", "Gaji per bulan");
            int g = 1;
            for (PegawaiRes x : gaji.pegawai()) baris(peg, g++, angka, x.nama(), x.jabatan(), x.jenis(), x.gajiBulanan());
            baris(peg, g, angka, "TOTAL", "", "", gaji.totalBulanan());

            Sheet riwayat = lembar(wb, "Riwayat", judul, "Waktu", "Produk", "HPP per porsi", "Harga jual");
            int w = 1;
            for (RiwayatItem x : orEmpty(data.riwayat())) baris(riwayat, w++, angka, x.waktu(), x.namaProduk(), x.hppPerPorsi(), x.hargaJual());

            Sheet kas = lembar(wb, "Kas", judul, "Tanggal", "Jenis", "Kategori", "Keterangan", "Jumlah");
            int k = 1;
            for (TransaksiReq t : orEmpty(data.kas()).stream().sorted(Comparator.comparing((TransaksiReq x) -> nz(x.tanggal()))).toList())
                baris(kas, k++, angka, t.tanggal(), "KELUAR".equals(t.jenis()) ? "Keluar" : "Masuk", nz(t.kategori()), nz(t.keterangan()), t.jumlah());

            wb.write(out);
            return out.toByteArray();
        }
    }

    @Override public String mime() { return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; }
    @Override public String ekstensi() { return "xlsx"; }

    private Sheet lembar(Workbook wb, String nama, CellStyle judul, String... kolom) {
        Sheet s = wb.createSheet(nama);
        Row h = s.createRow(0);
        for (int i = 0; i < kolom.length; i++) {
            Cell c = h.createCell(i);
            c.setCellValue(kolom[i]);
            c.setCellStyle(judul);
            s.setColumnWidth(i, 5500); // lebar tetap: autoSize butuh font sistem yang tidak ada di server
        }
        return s;
    }

    private void baris(Sheet s, int idx, CellStyle angka, Object... nilai) {
        Row row = s.createRow(idx);
        for (int i = 0; i < nilai.length; i++) {
            Cell c = row.createCell(i);
            if (nilai[i] instanceof Number n) {
                c.setCellValue(n.doubleValue());
                c.setCellStyle(angka);
            } else {
                c.setCellValue(String.valueOf(nilai[i]));
            }
        }
    }

    private static String nz(String s) { return s == null ? "" : s; }

    private static <T> List<T> orEmpty(List<T> l) { return l == null ? List.of() : l; }
}
