package adiadas_backedn.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "product_videos")
public class ProductVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "video_url", nullable = false)
    private String videoUrl;

    @Column(name = "video_order")
    private Integer videoOrder = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    // Constructors
    public ProductVideo() {}

    public ProductVideo(String videoUrl, Integer videoOrder, Product product) {
        this.videoUrl = videoUrl;
        this.videoOrder = videoOrder;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public Integer getVideoOrder() { return videoOrder; }
    public void setVideoOrder(Integer videoOrder) { this.videoOrder = videoOrder; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}