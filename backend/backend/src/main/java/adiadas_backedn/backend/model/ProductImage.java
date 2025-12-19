package adiadas_backedn.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

// ProductImage.java
@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "image_order")
    private Integer imageOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore // Thêm dòng này
    private Product product;

    // Constructors
    public ProductImage() {}

    public ProductImage(String imageUrl, Integer imageOrder, Product product) {
        this.imageUrl = imageUrl;
        this.imageOrder = imageOrder;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getImageOrder() { return imageOrder; }
    public void setImageOrder(Integer imageOrder) { this.imageOrder = imageOrder; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}