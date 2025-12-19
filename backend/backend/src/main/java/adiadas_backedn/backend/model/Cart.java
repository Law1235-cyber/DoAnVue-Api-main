package adiadas_backedn.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cart")
public class Cart {
    @Id
    // 🔥 SỬA: Thêm length = 50
    @Column(name = "id", length = 50)
    private String id;

    // 🔥 SỬA: User ID cũng phải length = 50
    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;

    @Column(name = "total", precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    public Cart() {}

    public Cart(String id, String userId) {
        this.id = id;
        this.userId = userId;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters (Giữ nguyên)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<CartItem> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItem> cartItems) { this.cartItems = cartItems; }

    public void calculateTotal() {
        this.total = cartItems.stream()
                .map(item -> {
                    // 🔥 SỬA LỖI TẠI ĐÂY:
                    // Thay vì dùng 0.0 (double), phải dùng BigDecimal.ZERO để cùng kiểu dữ liệu
                    BigDecimal price = item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO;

                    // Nhân giá tiền (BigDecimal) với số lượng (Integer -> BigDecimal)
                    return price.multiply(BigDecimal.valueOf(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}