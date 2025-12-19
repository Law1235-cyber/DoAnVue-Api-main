package adiadas_backedn.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    // 🔥 SỬA QUAN TRỌNG: Thêm length = 50 để khớp với VARCHAR(50) trong Database cũ
    @Column(name = "id", length = 50)
    private String id;

    @Column(name = "customer_name")
    private String customerName;

    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String address;
    private String notes;

    @Column(name = "order_value")
    private BigDecimal orderValue;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "payment_method")
    private String paymentMethod;

    private String status;

    // 🔥 SỬA QUAN TRỌNG: user_id cũng phải giới hạn 50 ký tự
    @Column(name = "user_id", length = 50)
    private String userId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    @ToString.Exclude
    private List<OrderItem> orderItems;

    public BigDecimal getTotal() {
        return this.orderValue != null ? this.orderValue : BigDecimal.ZERO;
    }
}