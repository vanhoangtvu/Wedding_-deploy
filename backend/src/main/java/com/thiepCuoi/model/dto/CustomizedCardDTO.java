package com.thiepCuoi.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CustomizedCardDTO {
    private Long id;
    
    @NotNull(message = "Card template ID không được để trống")
    private Long cardTemplateId;
    
    @NotNull(message = "Template ID không được để trống")
    private Long templateId;
    
    private String templateName;
    private String cardTemplateName;
    
    @NotBlank(message = "Dữ liệu tùy chỉnh không được để trống")
    private String customData; // JSON string
    
    private String renderedHtml;
    private String renderedCss;
    private String generatedImageUrl;
    private String generatedPdfUrl;
    private String previewUrl;
    private Boolean isSaved;
    
    // Parsed custom data fields for easy access
    private String groomName;
    private String brideName;
    private String weddingDate;
    private String weddingTime;
    private String weddingVenue;
    private String customMessage;
    
    // Constructors
    public CustomizedCardDTO() {}
    
    public CustomizedCardDTO(Long cardTemplateId, Long templateId, String customData) {
        this.cardTemplateId = cardTemplateId;
        this.templateId = templateId;
        this.customData = customData;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCardTemplateId() { return cardTemplateId; }
    public void setCardTemplateId(Long cardTemplateId) { this.cardTemplateId = cardTemplateId; }
    
    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    
    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }
    
    public String getCardTemplateName() { return cardTemplateName; }
    public void setCardTemplateName(String cardTemplateName) { this.cardTemplateName = cardTemplateName; }
    
    public String getCustomData() { return customData; }
    public void setCustomData(String customData) { this.customData = customData; }
    
    public String getRenderedHtml() { return renderedHtml; }
    public void setRenderedHtml(String renderedHtml) { this.renderedHtml = renderedHtml; }
    
    public String getRenderedCss() { return renderedCss; }
    public void setRenderedCss(String renderedCss) { this.renderedCss = renderedCss; }
    
    public String getGeneratedImageUrl() { return generatedImageUrl; }
    public void setGeneratedImageUrl(String generatedImageUrl) { this.generatedImageUrl = generatedImageUrl; }
    
    public String getGeneratedPdfUrl() { return generatedPdfUrl; }
    public void setGeneratedPdfUrl(String generatedPdfUrl) { this.generatedPdfUrl = generatedPdfUrl; }
    
    public String getPreviewUrl() { return previewUrl; }
    public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }
    
    public Boolean getIsSaved() { return isSaved; }
    public void setIsSaved(Boolean isSaved) { this.isSaved = isSaved; }
    
    // Parsed fields
    public String getGroomName() { return groomName; }
    public void setGroomName(String groomName) { this.groomName = groomName; }
    
    public String getBrideName() { return brideName; }
    public void setBrideName(String brideName) { this.brideName = brideName; }
    
    public String getWeddingDate() { return weddingDate; }
    public void setWeddingDate(String weddingDate) { this.weddingDate = weddingDate; }
    
    public String getWeddingTime() { return weddingTime; }
    public void setWeddingTime(String weddingTime) { this.weddingTime = weddingTime; }
    
    public String getWeddingVenue() { return weddingVenue; }
    public void setWeddingVenue(String weddingVenue) { this.weddingVenue = weddingVenue; }
    
    public String getCustomMessage() { return customMessage; }
    public void setCustomMessage(String customMessage) { this.customMessage = customMessage; }
}