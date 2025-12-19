package adiadas_backedn.backend.dto;

import adiadas_backedn.backend.model.Product;
import adiadas_backedn.backend.model.ProductColor;
import adiadas_backedn.backend.model.ProductImage;
import adiadas_backedn.backend.model.ProductSize;
import adiadas_backedn.backend.model.ProductVideo;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class ProductDTO {
    @Id
    // Cấu hình để tự sinh UUID
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String name;
    private Double price;
    private Boolean featured;
    private String category;
    private String image;
    private String hoverImage;
    private String link;
    private String rating;
    private String promoCodes;
    private String paymentOptions;
    private String shipping;
    private String returnsExchanges;
    private String sizingNote;
    private String description;
    private LocalDateTime createdAt;

    private Set<ProductImageDTO> images = new HashSet<>();
    private Set<ProductColorDTO> colors = new HashSet<>();
    private Set<ProductSizeDTO> sizes = new HashSet<>();
    private Set<ProductVideoDTO> videos = new HashSet<>();

    // Constructors
    public ProductDTO() {}

    public ProductDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.featured = product.getFeatured();
        this.category = product.getCategory();
        this.image = product.getImage();
        this.hoverImage = product.getHoverImage();
        this.link = product.getLink();
        this.rating = product.getRating();
        this.promoCodes = product.getPromoCodes();
        this.paymentOptions = product.getPaymentOptions();
        this.shipping = product.getShipping();
        this.returnsExchanges = product.getReturnsExchanges();
        this.sizingNote = product.getSizingNote();
        this.description = product.getDescription();
        this.createdAt = product.getCreatedAt();

        // Map images
        if (product.getImages() != null) {
            this.images = product.getImages().stream()
                    .map(ProductImageDTO::new)
                    .collect(Collectors.toSet());
        }

        // Map colors
        if (product.getColors() != null) {
            this.colors = product.getColors().stream()
                    .map(ProductColorDTO::new)
                    .collect(Collectors.toSet());
        }

        // Map sizes
        if (product.getSizes() != null) {
            this.sizes = product.getSizes().stream()
                    .map(ProductSizeDTO::new)
                    .collect(Collectors.toSet());
        }

        // Map videos
        if (product.getVideos() != null) {
            this.videos = product.getVideos().stream()
                    .map(ProductVideoDTO::new)
                    .collect(Collectors.toSet());
        }
    }

    // Getters and Setters
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

    public Set<ProductImageDTO> getImages() { return images; }
    public void setImages(Set<ProductImageDTO> images) { this.images = images; }

    public Set<ProductColorDTO> getColors() { return colors; }
    public void setColors(Set<ProductColorDTO> colors) { this.colors = colors; }

    public Set<ProductSizeDTO> getSizes() { return sizes; }
    public void setSizes(Set<ProductSizeDTO> sizes) { this.sizes = sizes; }

    public Set<ProductVideoDTO> getVideos() { return videos; }
    public void setVideos(Set<ProductVideoDTO> videos) { this.videos = videos; }

    // Helper method to check if featured
    public boolean isFeatured() {
        return Boolean.TRUE.equals(this.featured);
    }
}