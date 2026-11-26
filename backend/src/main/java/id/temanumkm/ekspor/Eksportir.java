package id.temanumkm.ekspor;

import id.temanumkm.dto.Dtos.ExportReq;

import java.io.IOException;

/** INTERFACE: format ekspor bisa ditambah (CSV, PDF) tanpa mengubah controller. */
public interface Eksportir {
    byte[] ekspor(ExportReq data) throws IOException;

    String mime();

    String ekstensi();
}
