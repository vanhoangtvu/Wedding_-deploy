package com.thiepCuoi.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CardTemplateDTO {
    private Long id;
    
    @NotNull(message = "Template ID không được để trống")
    private Long templateId;
    
    private String templateName;
    
    @NotBlank(message = "Tên mẫu thiệp không được để trống")
    private String cardTemplateName;
    
    @NotBlank(message = "HTML content không được để trống")
    private String htmlContent;
    
    private String cssContent;
    private String templateVariables;
    private String previewImageUrl;
    private String thumbnailUrl;
    private String version;
    private Boolean isActive;
    private Long createdBy;
    private String createdByName;
    
    // Constructors
    public CardTemplateDTO() {}
    
    public CardTemplateDTO(Long templateId, String cardTemplateName, String htmlContent) {
        this.templateId = templateId;
        this.cardTemplateName = cardTemplateName;
        this.htmlContent = htmlContent;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    
    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }
    
    public String getCardTemplateName() { return cardTemplateName; }
    public void setCardTemplateName(String cardTemplateName) { this.cardTemplateName = cardTemplateName; }
    
    public String getHtmlContent() { return htmlContent; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }
    
    public String getCssContent() { return cssContent; }
    public void setCssContent(String cssContent) { this.cssContent = cssContent; }
    
    public String getTemplateVariables() { return templateVariables; }
    public void setTemplateVariables(String templateVariables) { this.templateVariables = templateVariables; }
    
    public String getPreviewImageUrl() { return previewImageUrl; }
    public void setPreviewImageUrl(String previewImageUrl) { this.previewImageUrl = previewImageUrl; }
    
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
}