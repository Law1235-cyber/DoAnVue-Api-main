package adiadas_backedn.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequest {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String notes;
    private String userId;

    private String paymentMethod;
    private String status;
    private BigDecimal total;

    private List<OrderItemRequest> items;
}
