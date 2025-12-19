package adiadas_backedn.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "products")
public class Product {
    @Id
    // 🔥 SỬA: Thêm length = 50
    @Column(name = "id", length = 50)
    private String id;

    @Column(nullable = false)
    private String name;

    private Double price;

    @Column(name = "featured")
    private Boolean featured = false;

    private String category;
    private String image;

    @Column(name = "hover_image")
    private String hoverImage;

    private String link;
    private String rating;

    @Column(name = "promo_codes", length = 1000)
    private String promoCodes;

    @Column(name = "payment_options", length = 1000)
    private String paymentOptions;

    private String shipping;

    @Column(name = "returns_exchanges", length = 1000)
    private String returnsExchanges;

    @Column(name = "sizing_note", length = 1000)
    private String sizingNote;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductImage> images = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductColor> colors = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductSize> sizes = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductVideo> videos = new HashSet<>();

    public Product() {
    }

    // Getters and Setters (Giữ nguyên)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getHoverImage() { return hoverImage; }
    public void setHoverImage(String hoverImage) { this.hoverImage = hoverImage; }
    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
    public String getPromoCodes() { return promoCodes; }
    public void setPromoCodes(String promoCodes) { this.promoCodes = promoCodes; }
    public String getPaymentOptions() { return paymentOptions; }
    public void setPaymentOptions(String paymentOptions) { this.paymentOptions = paymentOptions; }
    public String getShipping() { return shipping; }
    public void setShipping(String shipping) { this.shipping = shipping; }
    public String getReturnsExchanges() { return returnsExchanges; }
    public void setReturnsExchanges(String returnsExchanges) { this.returnsExchanges = returnsExchanges; }
    public String getSizingNote() { return sizingNote; }
    public void setSizingNote(String sizingNote) { this.sizingNote = sizingNote; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Set<ProductImage> getImages() { return images; }
    public void setImages(Set<ProductImage> images) { this.images = images; }
    public Set<ProductColor> getColors() { return colors; }
    public void setColors(Set<ProductColor> colors) { this.colors = colors; }
    public Set<ProductSize> getSizes() { return sizes; }
    public void setSizes(Set<ProductSize> sizes) { this.sizes = sizes; }
    public Set<ProductVideo> getVideos() { return videos; }
    public void setVideos(Set<ProductVideo> videos) { this.videos = videos; }

    @Transient
    public boolean isFeatured() {
        return Boolean.TRUE.equals(this.featured);
    }
}