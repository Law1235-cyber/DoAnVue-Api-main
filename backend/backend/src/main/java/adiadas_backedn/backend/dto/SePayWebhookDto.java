package adiadas_backedn.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor // 🔥 Jackson cần cái này để tạo object rỗng trước
@AllArgsConstructor
public class SePayWebhookDto {
    private String gateway;
    private String transactionDate; // Bắt buộc là String
    private String accountNumber;
    private String code;
    private String content;
    private String transferType;
    private Long transferAmount;
    private Long accumulated;
    private String description;
    private Long id;
    private String referenceCode;
}