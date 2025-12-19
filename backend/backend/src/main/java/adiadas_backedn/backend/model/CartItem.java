package adiadas_backedn.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor; // 🔥 Thêm cái này
import lombok.Data;
import lombok.NoArgsConstructor; // 🔥 Thêm cái này

import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor // Tạo constructor rỗng: new CartItem()
@AllArgsConstructor // Tạo constructor full tham số
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id", columnDefinition = "VARCHAR(50)")
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id", columnDefinition = "VARCHAR(50)")
    private Product product;

    @Column(name = "product_name")
    private String productName;

    private String image;
    private BigDecimal price; // Đã sửa Double -> BigDecimal ở bước trước

    @Column(name = "color_name")
    private String colorName;

    @Column(name = "size_value")
    private String sizeValue;

    private Integer quantity;
}