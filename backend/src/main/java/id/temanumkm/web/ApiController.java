package id.temanumkm.web;

import id.temanumkm.dto.Dtos.*;
import id.temanumkm.ekspor.Eksportir;
import id.temanumkm.service.KalkulatorService;
import id.temanumkm.service.KasService;
import id.temanumkm.service.PegawaiService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApiController {
    private final KalkulatorService service;
    private final PegawaiService pegawaiService;
    private final Eksportir eksportir;
    private final KasService kasService;

    public ApiController(KalkulatorService service, PegawaiService pegawaiService, Eksportir eksportir, KasService kasService) {
        this.service = service;
        this.pegawaiService = pegawaiService;
        this.eksportir = eksportir;
        this.kasService = kasService;
    }

    @PostMapping("/hpp")
    public HppRes hpp(@RequestBody HppReq req) {
        return service.hitungHpp(req);
    }

    @PostMapping("/simulasi")
    public SimulasiRes simulasi(@RequestBody SimulasiReq req) {
        return service.simulasi(req);
    }

    @PostMapping("/pegawai/hitung")
    public GajiRes gaji(@RequestBody List<PegawaiReq> daftar) {
        return pegawaiService.hitungGaji(daftar);
    }

    @PostMapping("/kas/rekap")
    public KasRes kas(@RequestBody KasReq req) {
        return kasService.rekap(req);
    }

    @PostMapping("/export/xlsx")
    public ResponseEntity<byte[]> ekspor(@RequestBody ExportReq req) throws IOException {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=TemanUMKM." + eksportir.ekstensi())
                .contentType(MediaType.parseMediaType(eksportir.mime()))
                .body(eksportir.ekspor(req));
    }
}
