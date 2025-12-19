package adiadas_backedn.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private Integer quantity;
    private BigDecimal price;

    // 🔥 SỬA: Thêm length = 50 cho Product ID
    @Column(name = "product_id", length = 50)
    private String productId;

    private String colorName;
    private String sizeValue;

    @ManyToOne
    @JoinColumn(name = "order_id") // Cái này nó sẽ tự theo Order.id (đã sửa là 50 ở turn trước) nên OK
    @JsonBackReference
    @ToString.Exclude
    private Order order;
}