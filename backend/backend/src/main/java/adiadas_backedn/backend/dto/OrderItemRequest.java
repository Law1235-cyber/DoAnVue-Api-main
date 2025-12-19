package adiadas_backedn.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemRequest {
    // --- SỬA Ở ĐÂY ---
    private String productId; // Đổi từ Long thành String (nếu DB lưu ID sản phẩm là chuỗi)

    private Integer quantity;
    private BigDecimal price;
    private String colorName;
    private String sizeValue;
}