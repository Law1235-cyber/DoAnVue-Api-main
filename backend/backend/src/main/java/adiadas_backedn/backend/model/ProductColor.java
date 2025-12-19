package adiadas_backedn.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

// ProductColor.java
@Entity
@Table(name = "product_colors")
public class ProductColor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "color_name")
    private String colorName;

    @Column(name = "image_url")
    private String imageUrl;

    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore // Thêm dòng này
    private Product product;

    // Constructors
    public ProductColor() {}

    public ProductColor(String colorName, String imageUrl, Product product) {
        this.colorName = colorName;
        this.imageUrl = imageUrl;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getColorName() { return colorName; }
    public void setColorName(String colorName) { this.colorName = colorName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}