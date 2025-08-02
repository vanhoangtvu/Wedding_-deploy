package com.thiepCuoi.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public class TemplateDTO {
    private Long id;
    
    @NotBlank(message = "Tên mẫu thiệp không được để trống")
    private String name;
    
    private String description;
    
    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;
    
    private String categoryName;
    
    private String imageUrl;
    private String previewUrl;
    
    @DecimalMin(value = "0.0", message = "Giá không được âm")
    private BigDecimal price;
    
    private Boolean isActive;
    
    // Constructors
    public TemplateDTO() {}
    
    public TemplateDTO(String name, String description, Long categoryId, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.price = price;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getPreviewUrl() { return previewUrl; }
    public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}