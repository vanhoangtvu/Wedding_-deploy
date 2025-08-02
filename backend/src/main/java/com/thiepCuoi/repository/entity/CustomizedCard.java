package com.thiepCuoi.repository.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customized_cards")
public class CustomizedCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "card_template_id", nullable = false)
    private CardTemplate cardTemplate;
    
    @ManyToOne
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;
    
    @Column(name = "rendered_html", nullable = false, columnDefinition = "LONGTEXT")
    private String renderedHtml;
    
    @Column(name = "rendered_css", columnDefinition = "LONGTEXT")
    private String renderedCss;
    
    @Column(name = "custom_data", nullable = false, columnDefinition = "JSON")
    private String customData; // JSON string chứa dữ liệu user nhập
    
    @Column(name = "generated_image_url")
    private String generatedImageUrl;
    
    @Column(name = "generated_pdf_url")
    private String generatedPdfUrl;
    
    @Column(name = "preview_url")
    private String previewUrl;
    
    @Column(name = "is_saved")
    private Boolean isSaved = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Constructors
    public CustomizedCard() {}
    
    public CustomizedCard(User user, CardTemplate cardTemplate, Template template, 
                         String renderedHtml, String customData) {
        this.user = user;
        this.cardTemplate = cardTemplate;
        this.template = template;
        this.renderedHtml = renderedHtml;
        this.customData = customData;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public CardTemplate getCardTemplate() { return cardTemplate; }
    public void setCardTemplate(CardTemplate cardTemplate) { this.cardTemplate = cardTemplate; }
    
    public Template getTemplate() { return template; }
    public void setTemplate(Template template) { this.template = template; }
    
    public String getRenderedHtml() { return renderedHtml; }
    public void setRenderedHtml(String renderedHtml) { this.renderedHtml = renderedHtml; }
    
    public String getRenderedCss() { return renderedCss; }
    public void setRenderedCss(String renderedCss) { this.renderedCss = renderedCss; }
    
    public String getCustomData() { return customData; }
    public void setCustomData(String customData) { this.customData = customData; }
    
    public String getGeneratedImageUrl() { return generatedImageUrl; }
    public void setGeneratedImageUrl(String generatedImageUrl) { this.generatedImageUrl = generatedImageUrl; }
    
    public String getGeneratedPdfUrl() { return generatedPdfUrl; }
    public void setGeneratedPdfUrl(String generatedPdfUrl) { this.generatedPdfUrl = generatedPdfUrl; }
    
    public String getPreviewUrl() { return previewUrl; }
    public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }
    
    public Boolean getIsSaved() { return isSaved; }
    public void setIsSaved(Boolean isSaved) { this.isSaved = isSaved; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}