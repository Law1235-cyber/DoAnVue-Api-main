package adiadas_backedn.backend.dto;

import adiadas_backedn.backend.model.ProductImage;

class ProductImageDTO {
    private Long id;
    private String imageUrl;
    private Integer imageOrder;

    public ProductImageDTO() {}

    public ProductImageDTO(ProductImage image) {
        this.id = image.getId();
        this.imageUrl = image.getImageUrl();
        this.imageOrder = image.getImageOrder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getImageOrder() { return imageOrder; }
    public void setImageOrder(Integer imageOrder) { this.imageOrder = imageOrder; }
}

