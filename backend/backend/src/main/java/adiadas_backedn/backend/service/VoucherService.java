package adiadas_backedn.backend.service;

import adiadas_backedn.backend.dto.VoucherDTO;
import adiadas_backedn.backend.model.Voucher;
import adiadas_backedn.backend.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    public List<VoucherDTO> getAllVouchers() {
        return voucherRepository.findAll()
                .stream()
                .map(VoucherDTO::new)
                .collect(Collectors.toList());
    }

    public Optional<Voucher> findByCode(String code) {
        return voucherRepository.findByCodeIgnoreCase(code);
    }

    public VoucherDTO createVoucher(VoucherDTO dto) {
        Voucher voucher = new Voucher();
        voucher.setCode(dto.getCode());
        voucher.setDescription(dto.getDescription());
        voucher.setDiscountType(dto.getDiscountType());
        voucher.setDiscountValue(dto.getDiscountValue());
        voucher.setMinOrderValue(dto.getMinOrderValue());
        voucher.setMaxDiscount(dto.getMaxDiscount());
        voucher.setStartDate(dto.getStartDate());
        voucher.setEndDate(dto.getEndDate());
        voucher.setUsageLimit(dto.getUsageLimit());
        voucher.setUsedCount(dto.getUsedCount() != null ? dto.getUsedCount() : 0);
        voucher.setActive(dto.getActive() != null ? dto.getActive() : true);

        Voucher saved = voucherRepository.save(voucher);
        return new VoucherDTO(saved);
    }

    public double applyVoucher(String code, double cartTotal) {

        Voucher voucher = voucherRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new RuntimeException("Mã giảm giá không tồn tại"));

        Boolean active = voucher.getActive();
        if (active != null && !active) {
            throw new RuntimeException("Mã giảm giá đang tạm dừng");
        }

        LocalDateTime now = LocalDateTime.now();

        if (voucher.getStartDate() != null && now.isBefore(voucher.getStartDate())) {
            throw new RuntimeException("Mã giảm giá chưa bắt đầu hiệu lực");
        }

        if (voucher.getEndDate() != null && now.isAfter(voucher.getEndDate())) {
            throw new RuntimeException("Mã giảm giá đã hết hạn");
        }

        if (voucher.getMinOrderValue() != null && cartTotal < voucher.getMinOrderValue()) {
            throw new RuntimeException("Đơn hàng chưa đạt giá trị tối thiểu");
        }

        double discount = 0.0;

        if ("PERCENT".equalsIgnoreCase(voucher.getDiscountType())) {
            discount = cartTotal * voucher.getDiscountValue() / 100.0;
            if (voucher.getMaxDiscount() != null) {
                discount = Math.min(discount, voucher.getMaxDiscount());
            }

        } else if ("FIXED".equalsIgnoreCase(voucher.getDiscountType())) {
            discount = voucher.getDiscountValue();
        } else {
            throw new RuntimeException("Loại mã giảm giá không hợp lệ");
        }

        discount = Math.min(discount, cartTotal);

        Integer usedCount = voucher.getUsedCount() == null ? 0 : voucher.getUsedCount();
        voucher.setUsedCount(usedCount + 1);
        voucherRepository.save(voucher);

        return discount;
    }

    public void increaseUsage(String code) {
        voucherRepository.findByCodeIgnoreCase(code).ifPresent(v -> {
            int used = (v.getUsedCount() == null ? 0 : v.getUsedCount());
            v.setUsedCount(used + 1);
            voucherRepository.save(v);
        });
    }

    // 🔹 UPDATE voucher
    public VoucherDTO updateVoucher(Long id, VoucherDTO dto) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        voucher.setCode(dto.getCode());
        voucher.setDescription(dto.getDescription());
        voucher.setDiscountType(dto.getDiscountType());
        voucher.setDiscountValue(dto.getDiscountValue());
        voucher.setMinOrderValue(dto.getMinOrderValue());
        voucher.setMaxDiscount(dto.getMaxDiscount());
        voucher.setStartDate(dto.getStartDate());
        voucher.setEndDate(dto.getEndDate());
        voucher.setUsageLimit(dto.getUsageLimit());
        voucher.setActive(dto.getActive());

        Voucher saved = voucherRepository.save(voucher);
        return new VoucherDTO(saved);
    }

    // 🔹 DELETE voucher
    public void deleteVoucher(Long id) {
        if (!voucherRepository.existsById(id)) {
            throw new RuntimeException("Voucher không tồn tại");
        }
        voucherRepository.deleteById(id);
    }
}
