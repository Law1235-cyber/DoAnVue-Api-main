package adiadas_backedn.backend.dto;

import adiadas_backedn.backend.model.ProductColor;

class ProductColorDTO {
    private Long id;
    private String colorName;
    private String imageUrl;
    private String color;

    public ProductColorDTO() {}

    public ProductColorDTO(ProductColor color) {
        this.id = color.getId();
        this.colorName = color.getColorName();
        this.imageUrl = color.getImageUrl();
        this.color = color.getColor();
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
}

