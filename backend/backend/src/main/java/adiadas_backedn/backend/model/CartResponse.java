package adiadas_backedn.backend.model;

import java.math.BigDecimal;
import java.util.List;

public class CartResponse {
    private String cartId;
    private String userId;
    private BigDecimal total;
    private List<CartItemResponse> items;

    // Constructors
    public CartResponse() {}

    public CartResponse(String cartId, String userId, BigDecimal total, List<CartItemResponse> items) {
        this.cartId = cartId;
        this.userId = userId;
        this.total = total;
        this.items = items;
    }

    // Getters and Setters
    public String getCartId() { return cartId; }
    public void setCartId(String cartId) { this.cartId = cartId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public List<CartItemResponse> getItems() { return items; }
    public void setItems(List<CartItemResponse> items) { this.items = items; }
}
