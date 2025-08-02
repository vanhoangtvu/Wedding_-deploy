package com.thiepCuoi.model.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryDTO {
    private Long id;
    
    @NotBlank(message = "Tên danh mục không được để trống")
    private String name;
    
    private String description;
    
    // Constructors
    public CategoryDTO() {}
    
    public CategoryDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}