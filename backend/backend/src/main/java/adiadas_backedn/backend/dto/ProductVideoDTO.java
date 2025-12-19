package adiadas_backedn.backend.dto;

import adiadas_backedn.backend.model.ProductVideo;

class ProductVideoDTO {
    private Long id;
    private String videoUrl;
    private Integer videoOrder;

    public ProductVideoDTO() {}

    public ProductVideoDTO(ProductVideo video) {
        this.id = video.getId();
        this.videoUrl = video.getVideoUrl();
        this.videoOrder = video.getVideoOrder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public Integer getVideoOrder() { return videoOrder; }
    public void setVideoOrder(Integer videoOrder) { this.videoOrder = videoOrder; }
}
