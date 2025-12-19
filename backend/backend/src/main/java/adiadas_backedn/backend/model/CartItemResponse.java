package adiadas_backedn.backend.model;

import java.math.BigDecimal;

public class CartItemResponse {
    private Long id;
    private String productId;
    private String productName;
    private String image;
    private BigDecimal price;
    private String colorName;
    private String sizeValue;
    private Integer quantity;
    private BigDecimal subtotal;

    // Constructors, Getters and Setters
    public CartItemResponse() {}

    public CartItemResponse(Long id, String productId, String productName, String image,
                            BigDecimal price, String colorName, String sizeValue, Integer quantity) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.image = image;
        this.price = price;
        this.colorName = colorName;
        this.sizeValue = sizeValue;
        this.quantity = quantity;
        this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getColorName() { return colorName; }
    public void setColorName(String colorName) { this.colorName = colorName; }

    public String getSizeValue() { return sizeValue; }
    public void setSizeValue(String sizeValue) { this.sizeValue = sizeValue; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
