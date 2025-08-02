package com.thiepCuoi.model.dto;

import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class RenderTemplateRequestDTO {
    @NotNull(message = "Card template ID không được để trống")
    private Long cardTemplateId;
    
    @NotNull(message = "Dữ liệu tùy chỉnh không được để trống")
    private Map<String, String> customData;
    
    private Boolean saveCard = false; // Có lưu card hay chỉ preview
    
    // Constructors
    public RenderTemplateRequestDTO() {}
    
    public RenderTemplateRequestDTO(Long cardTemplateId, Map<String, String> customData) {
        this.cardTemplateId = cardTemplateId;
        this.customData = customData;
    }
    
    // Getters and Setters
    public Long getCardTemplateId() { return cardTemplateId; }
    public void setCardTemplateId(Long cardTemplateId) { this.cardTemplateId = cardTemplateId; }
    
    public Map<String, String> getCustomData() { return customData; }
    public void setCustomData(Map<String, String> customData) { this.customData = customData; }
    
    public Boolean getSaveCard() { return saveCard; }
    public void setSaveCard(Boolean saveCard) { this.saveCard = saveCard; }
}