package adiadas_backedn.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

// ProductSize.java
@Entity
@Table(name = "product_sizes")
public class ProductSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "size_value")
    private String sizeValue;

    private String size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore // Thêm dòng này
    private Product product;

    // Constructors
    public ProductSize() {}

    public ProductSize(String sizeValue, Product product) {
        this.sizeValue = sizeValue;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSizeValue() { return sizeValue; }
    public void setSizeValue(String sizeValue) { this.sizeValue = sizeValue; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}