package com.thiepCuoi.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class CustomInvitationDTO {
    private Long id;
    
    @NotNull(message = "Mẫu thiệp không được để trống")
    private Long templateId;
    
    private String templateName;
    
    @NotBlank(message = "Tên chú rể không được để trống")
    private String groomName;
    
    @NotBlank(message = "Tên cô dâu không được để trống")
    private String brideName;
    
    @NotNull(message = "Ngày cưới không được để trống")
    private LocalDate weddingDate;
    
    private LocalTime weddingTime;
    private String weddingVenue;
    private String customMessage;
    private String generatedImageUrl;
    private Boolean isSaved;
    
    // Constructors
    public CustomInvitationDTO() {}
    
    public CustomInvitationDTO(Long templateId, String groomName, String brideName, LocalDate weddingDate) {
        this.templateId = templateId;
        this.groomName = groomName;
        this.brideName = brideName;
        this.weddingDate = weddingDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTemplateId() { return templateId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    
    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }
    
    public String getGroomName() { return groomName; }
    public void setGroomName(String groomName) { this.groomName = groomName; }
    
    public String getBrideName() { return brideName; }
    public void setBrideName(String brideName) { this.brideName = brideName; }
    
    public LocalDate getWeddingDate() { return weddingDate; }
    public void setWeddingDate(LocalDate weddingDate) { this.weddingDate = weddingDate; }
    
    public LocalTime getWeddingTime() { return weddingTime; }
    public void setWeddingTime(LocalTime weddingTime) { this.weddingTime = weddingTime; }
    
    public String getWeddingVenue() { return weddingVenue; }
    public void setWeddingVenue(String weddingVenue) { this.weddingVenue = weddingVenue; }
    
    public String getCustomMessage() { return customMessage; }
    public void setCustomMessage(String customMessage) { this.customMessage = customMessage; }
    
    public String getGeneratedImageUrl() { return generatedImageUrl; }
    public void setGeneratedImageUrl(String generatedImageUrl) { this.generatedImageUrl = generatedImageUrl; }
    
    public Boolean getIsSaved() { return isSaved; }
    public void setIsSaved(Boolean isSaved) { this.isSaved = isSaved; }
}