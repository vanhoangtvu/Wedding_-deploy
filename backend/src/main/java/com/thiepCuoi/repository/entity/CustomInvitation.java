package com.thiepCuoi.repository.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "custom_invitations")
public class CustomInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "template_id", nullable = false)
    private Template template;
    
    @Column(name = "groom_name", nullable = false)
    private String groomName;
    
    @Column(name = "bride_name", nullable = false)
    private String brideName;
    
    @Column(name = "wedding_date", nullable = false)
    private LocalDate weddingDate;
    
    @Column(name = "wedding_time")
    private LocalTime weddingTime;
    
    @Column(name = "wedding_venue")
    private String weddingVenue;
    
    @Column(name = "custom_message")
    private String customMessage;
    
    @Column(name = "generated_image_url")
    private String generatedImageUrl;
    
    @Column(name = "is_saved")
    private Boolean isSaved = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructors
    public CustomInvitation() {}
    
    public CustomInvitation(User user, Template template, String groomName, String brideName, LocalDate weddingDate) {
        this.user = user;
        this.template = template;
        this.groomName = groomName;
        this.brideName = brideName;
        this.weddingDate = weddingDate;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Template getTemplate() { return template; }
    public void setTemplate(Template template) { this.template = template; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}