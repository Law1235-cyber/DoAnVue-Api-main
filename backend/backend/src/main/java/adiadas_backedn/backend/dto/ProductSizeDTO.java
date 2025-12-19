package adiadas_backedn.backend.dto;

import adiadas_backedn.backend.model.ProductSize;

class ProductSizeDTO {
    private Long id;
    private String sizeValue;
    private String size;

    public ProductSizeDTO() {}

    public ProductSizeDTO(ProductSize size) {
        this.id = size.getId();
        this.sizeValue = size.getSizeValue();
        this.size = size.getSize();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSizeValue() { return sizeValue; }
    public void setSizeValue(String sizeValue) { this.sizeValue = sizeValue; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}
