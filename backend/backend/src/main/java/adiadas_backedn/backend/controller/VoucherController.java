package adiadas_backedn.backend.controller;

import adiadas_backedn.backend.dto.VoucherDTO;
import adiadas_backedn.backend.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "http://localhost:8080")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    // 🔹 Lấy tất cả voucher
    @GetMapping
    public ResponseEntity<List<VoucherDTO>> getAllVouchers() {
        try {
            return ResponseEntity.ok(voucherService.getAllVouchers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🔹 Admin tạo voucher mới
    @PostMapping
    public ResponseEntity<VoucherDTO> createVoucher(@RequestBody VoucherDTO dto) {
        try {
            VoucherDTO created = voucherService.createVoucher(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🔹 Client áp mã giảm giá
    @GetMapping("/apply")
    public ResponseEntity<?> applyVoucher(
            @RequestParam String code,
            @RequestParam double cartTotal) {
        try {
            double discount = voucherService.applyVoucher(code, cartTotal);
            double finalTotal = cartTotal - discount;

            Map<String, Object> result = new HashMap<>();
            result.put("code", code);
            result.put("discount", discount);
            result.put("finalTotal", finalTotal);

            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🔹 UPDATE voucher
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVoucher(
            @PathVariable Long id,
            @RequestBody VoucherDTO dto
    ) {
        try {
            VoucherDTO updated = voucherService.updateVoucher(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🔹 DELETE voucher
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable Long id) {
        try {
            voucherService.deleteVoucher(id);
            return ResponseEntity.ok("Deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
