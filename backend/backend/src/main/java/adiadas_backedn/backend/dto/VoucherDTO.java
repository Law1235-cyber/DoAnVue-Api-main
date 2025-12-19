package adiadas_backedn.backend.dto;

import adiadas_backedn.backend.model.Voucher;

import java.time.LocalDateTime;

public class VoucherDTO {

    private Long id;
    private String code;
    private String description;
    private String discountType;
    private Double discountValue;
    private Double minOrderValue;
    private Double maxDiscount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
    private Integer usedCount;
    private Boolean active;

    public VoucherDTO() {}

    public VoucherDTO(Voucher voucher) {
        this.id = voucher.getId();
        this.code = voucher.getCode();
        this.description = voucher.getDescription();
        this.discountType = voucher.getDiscountType();
        this.discountValue = voucher.getDiscountValue();
        this.minOrderValue = voucher.getMinOrderValue();
        this.maxDiscount = voucher.getMaxDiscount();
        this.startDate = voucher.getStartDate();
        this.endDate = voucher.getEndDate();
        this.usageLimit = voucher.getUsageLimit();
        this.usedCount = voucher.getUsedCount();
        this.active = voucher.getActive();
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public Double getMinOrderValue() { return minOrderValue; }
    public void setMinOrderValue(Double minOrderValue) { this.minOrderValue = minOrderValue; }

    public Double getMaxDiscount() { return maxDiscount; }
    public void setMaxDiscount(Double maxDiscount) { this.maxDiscount = maxDiscount; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getUsedCount() { return usedCount; }
    public void setUsedCount(Integer usedCount) { this.usedCount = usedCount; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
